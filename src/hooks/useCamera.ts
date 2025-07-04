import { useState, useCallback, useEffect, useRef } from "react";
import { type FileChangeDetails } from "@zag-js/file-upload";

export const useCamera = (
	handleFileChange: (details: FileChangeDetails) => Promise<void>
) => {
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const selectedDeviceRef = useRef(selectedDevice);
	useEffect(() => {
		selectedDeviceRef.current = selectedDevice;
	}, [selectedDevice]);

	const openCamera = useCallback(() => setIsCameraOpen(true), []);
	const closeCamera = useCallback(() => setIsCameraOpen(false), []);

	const stopStream = useCallback(() => {
		setStream((currentStream) => {
			if (currentStream) {
				currentStream.getTracks().forEach((track) => track.stop());
			}
			return null;
		});
	}, []);

	const startStream = useCallback(async (deviceId: string) => {
		stopStream();
		setIsSearching(true);
		setError(null);
		try {
			const newStream = await navigator.mediaDevices.getUserMedia({
				video: {
					deviceId: { exact: deviceId },
					//width: { ideal: 1280 },
					//height: { ideal: 720 },
				},
			});
			setStream(newStream);
			setSelectedDevice(deviceId);
		} catch (err) {
			console.error("Error starting camera stream.", err);
			setError("Could not start camera stream with the selected device.");
		} finally {
			setIsSearching(false);
		}
	}, [stopStream]);

	useEffect(() => {
		if (!isCameraOpen) {
			stopStream();
			setDevices([]);
			setSelectedDevice(null);
			setError(null);
			return;
		}

		const initialize = async () => {
			setIsSearching(true);
			setError(null);
			try {
				const permissionStream = await navigator.mediaDevices.getUserMedia({ video: true });
				permissionStream.getTracks().forEach((track) => track.stop());

				const allDevices = await navigator.mediaDevices.enumerateDevices();
				const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
				console.log("Available video devices:", videoDevices.map((d) => d.label));
				setDevices(videoDevices);

				if (videoDevices.length === 0) {
					setError("No camera devices found.");
				}
			} catch (err) {
				console.error("Error initializing camera.", err);
				setError("Could not access camera. Please ensure permissions are granted.");
			} finally {
				setIsSearching(false);
			}
		};

		initialize();

		const handleDeviceChange = async () => {
			const allDevices = await navigator.mediaDevices.enumerateDevices();
			const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
			setDevices(videoDevices);

			const isSelectedStillAvailable = videoDevices.some(
				(d) => d.deviceId === selectedDeviceRef.current
			);

			if (!isSelectedStillAvailable && selectedDeviceRef.current) {
				setError("Selected camera was disconnected.");
				stopStream();
				setSelectedDevice(null);
			} else if (videoDevices.length === 0) {
				setError("No camera devices found.");
				stopStream();
				setSelectedDevice(null);
			}
		};

		navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

		return () => {
			navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
			stopStream();
		};
	}, [isCameraOpen, stopStream]);

	const captureImage = useCallback(async (videoElement: HTMLVideoElement) => {
		if (!videoElement) return;

		const canvas = document.createElement("canvas");
		canvas.width = videoElement.videoWidth;
		canvas.height = videoElement.videoHeight;
		const context = canvas.getContext("2d");
		if (context) {
			context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
			const dataUrl = canvas.toDataURL("image/jpeg");

			const byteString = atob(dataUrl.split(",")[1]);
			const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
			const ab = new ArrayBuffer(byteString.length);
			const ia = new Uint8Array(ab);
			for (let i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			const blob = new Blob([ab], { type: mimeString });
			const file = new File([blob], `capture-${new Date().toISOString()}.jpg`, { type: mimeString });

			await handleFileChange({ acceptedFiles: [file], rejectedFiles: [] });
			closeCamera();
		}
	}, [handleFileChange, closeCamera]);

	return {
		isCameraOpen,
		openCamera,
		closeCamera,
		devices,
		isSearching,
		stream,
		selectedDevice,
		selectDevice: startStream,
		captureImage,
		error,
	};
};