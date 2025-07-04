import {
	Dialog,
	Portal,
	Button,
	Flex,
	Text,
	Spinner,
	VStack,
	HStack,
	NativeSelect,
	Icon,
	CloseButton
} from "@chakra-ui/react";
import { FiCameraOff, FiCamera } from "react-icons/fi";
import { useRef, useEffect } from "react";

interface CameraDialogProps {
	isCameraOpen: boolean;
	closeCamera: () => void;
	devices: MediaDeviceInfo[];
	isSearching: boolean;
	stream: MediaStream | null;
	selectedDevice: string | null;
	selectDevice: (deviceId: string) => void;
	captureImage: (videoElement: HTMLVideoElement) => Promise<void>;
	error: string | null;
}

export const CameraDialog = ({
	isCameraOpen,
	closeCamera,
	devices,
	isSearching,
	stream,
	selectedDevice,
	selectDevice,
	captureImage,
	error,
}: CameraDialogProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	const handleCapture = () => {
		if (videoRef.current) {
			captureImage(videoRef.current);
		}
	};

	const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const deviceId = e.currentTarget.value;
		if (deviceId) {
			selectDevice(deviceId);
		}
	};

	return (
		<Dialog.Root
			open={isCameraOpen}
			onOpenChange={(e) => !e.open && closeCamera()}
			size="xl"
			placement="center"
			motionPreset="slide-in-bottom"
		>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner p="4">
					<Dialog.Content>
						<Dialog.Header fontSize="lg" fontWeight="bold" color="primary">
							Document Capture
						</Dialog.Header>
						<Dialog.Body>
							<Flex direction="column" gap="4">
								{isSearching && !selectedDevice ? (
									<VStack gap="4" justify="center" h="300px">
										<Spinner size="xl" />
										<Text>Searching for devices...</Text>
									</VStack>
								) : error ? (
									<VStack gap="4" justify="center" h="300px">
										<Icon as={FiCameraOff} boxSize="12" color="red.500" />
										<Text color="red.500">{error}</Text>
									</VStack>
								) : (
									<Flex direction="column" gap="6">
										<Flex maxH="400px" w="full" bg="black" rounded="md">
											{stream ? (
												<video ref={videoRef} autoPlay playsInline muted width="100%" style={{ borderRadius: "var(--chakra-radii-md)", backgroundColor: "black" }} />
											) : (
												<VStack width="full" py="24">
													<Icon as={FiCameraOff} boxSize="12" color="gray.500" />
													<Text color="gray.500">No camera selected</Text>
												</VStack>
											)}
										</Flex>
										<HStack gap="6">
											<NativeSelect.Root
												size="sm"
												width="full"
											>
												<NativeSelect.Field
													value={selectedDevice || ""}
													onChange={handleDeviceChange}
												>
													<option value="" disabled>
														Select a camera
													</option>
													{devices.map((device, index) => (
														<option key={device.deviceId} value={device.deviceId}>
															{device.label || `Camera ${index + 1}`}
														</option>
													))}
												</NativeSelect.Field>
												<NativeSelect.Indicator />
											</NativeSelect.Root>
											<Button
												onClick={handleCapture}
												disabled={!stream}
												colorPalette="brand"
											>
												<Icon as={FiCamera} mr="2" />
												Capture
											</Button>
										</HStack>
									</Flex>
								)}
							</Flex>
						</Dialog.Body>
						<Dialog.CloseTrigger asChild>
							<CloseButton size="sm" onClick={closeCamera} />
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};