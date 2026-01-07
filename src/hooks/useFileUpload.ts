import { useState } from "react";

type UploadStatus = "idle" | "cropping" | "uploading" | "success" | "error";
import { type FileChangeDetails } from "@zag-js/file-upload";
import axios, { type CancelTokenSource } from "axios";
import { toaster } from "@/components/ui/toaster";
import { type ApiError } from "@/types/api.types";
import { extract } from "@/api/patient-records";
import { StorageKeys } from "@/constants/upload";
import { base64ToFile } from "@/utils/imageUtils";

const useFileUpload = () => {
	const [open, setOpen] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadStatus, setUploadStatus] = useState<UploadStatus>(
		"idle" as UploadStatus
	);
	const [errorMessage, setErrorMessage] = useState("");
	const [fileSize, setFileSize] = useState(0);
	const [fileName, setFileName] = useState("");
	const [fileType, setFileType] = useState("");
	const [filePreview, setFilePreview] = useState("");
	const [uploadedRecordId, setUploadedRecordId] = useState<string | null>(null);
	const [uploadCancelToken, setUploadCancelToken] =
		useState<CancelTokenSource | null>(null);
	const [uploadKey, setUploadKey] = useState(0);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [croppedImage, setCroppedImage] = useState<string | null>(null);
	const [isPreviewLoading, setIsPreviewLoading] = useState(false);

	const uploadFile = async (file: File) => {
		setFileName(file.name);
		setFileSize(Math.round(file.size));
		setFileType(file.type);

		const reader = new FileReader();
		reader.onloadend = () => {
			setFilePreview(reader.result as string);
		};
		reader.readAsDataURL(file);

		setUploadProgress(0);
		setUploadStatus("uploading");
		setErrorMessage("");
		setOpen(true);

		const cancelTokenSource = axios.CancelToken.source();
		setUploadCancelToken(cancelTokenSource);

		try {
			const response = await extract(
				{
					image: file,
					recordType: "patient",
					recordTypeGroup: "clinical",
				},
				(progressEvent) => {
					const total = progressEvent.total ? progressEvent.total : 1;
					const progress = Math.round((progressEvent.loaded * 100) / total);
					setUploadProgress(progress);
				}
			);
			localStorage.setItem(StorageKeys.RecordId, response.record.id)
			setUploadedRecordId(response.record.id);
			setUploadStatus("success");
		} catch (err) {
			if (axios.isCancel(err)) {
				// Upload cancelled
			} else {
				const apiError = err as ApiError;
				setErrorMessage(
					apiError.response?.data?.message ||
						"An error occurred while uploading."
				);
				setUploadStatus("error");
			}
		}
	};

	const handleFileChange = async (details: FileChangeDetails) => {
		if (
			details?.rejectedFiles[0]?.errors &&
			details?.rejectedFiles[0]?.errors[0] === "FILE_TOO_LARGE"
		) {
			// 10 MB limit
			toaster.create({
				title: "Upload Failed",
				description: "Your file is too large. Please upload a smaller file.",
				type: "error",
				duration: 5000,
			});
			return;
		} else if (
			details?.rejectedFiles[0]?.errors &&
			details?.rejectedFiles[0].errors[0] === "FILE_INVALID_TYPE"
		) {
			// PNG, JPG, PDF only
			toaster.create({
				title: "Upload Failed",
				description:
					"Your file type is invalid. Please upload a PNG, JPG, or PDF.",
				type: "error",
				duration: 5000,
			});
			return;
		} else if (details?.acceptedFiles.length > 1) {
			// Only one file can be uploaded at a time
			toaster.create({
				title: "Upload Failed",
				description: "You can only upload one file at a time.",
				type: "error",
				duration: 5000,
			});
			return;
		}
		const files = details?.acceptedFiles;
		if (!files || files.length === 0) return;
		const file = files[0];
		setSelectedFile(file);

		// Set file info
		setFileName(file.name);
		setFileSize(Math.round(file.size));
		setFileType(file.type);

		// For PDF files, skip cropping and go straight to upload
		if (file.type === "application/pdf") {
			await uploadFile(file);
			return;
		}

		// For image files, show cropping UI immediately
		setUploadStatus("cropping");
		setOpen(true);
		setIsPreviewLoading(true);

		// Load preview asynchronously
		const reader = new FileReader();
		reader.onloadend = () => {
			setFilePreview(reader.result as string);
			setIsPreviewLoading(false);
		};
		reader.onerror = () => {
			setIsPreviewLoading(false);
			setErrorMessage("Failed to load image preview");
		};
		reader.readAsDataURL(file);
	};

	const handleRetry = async () => {
		if (croppedImage && selectedFile) {
			const croppedFile = base64ToFile(croppedImage, selectedFile.name);
			await uploadFile(croppedFile);
		} else if (selectedFile) {
			await uploadFile(selectedFile);
		}
	};

	const handleConfirmCrop = async (croppedImageData: string) => {
		setCroppedImage(croppedImageData);

		// Convert base64 string to a File object
		if (selectedFile) {
			const croppedFile = base64ToFile(croppedImageData, selectedFile.name);

			// Upload the cropped file
			await uploadFile(croppedFile);
		}
	};

	const handleCancelCrop = () => {
		setOpen(false);
		setUploadStatus("idle");
		setCroppedImage(null);
		setFilePreview("");
		setUploadKey((prevKey) => prevKey + 1);
	};

	const handleCloseDialog = () => {
		if (uploadStatus === "uploading" && uploadCancelToken) {
			uploadCancelToken.cancel("Upload cancelled by user.");
		}
		setOpen(false);
		setUploadProgress(0);
		setUploadStatus("idle");
		setErrorMessage("");
		setFileSize(0);
		setFileName("");
		setFileType("");
		setFilePreview("");
		setCroppedImage(null);
		setUploadedRecordId(null);
		setUploadKey((prevKey) => prevKey + 1);
	};

	return {
		open,
		setOpen,
		uploadProgress,
		uploadStatus,
		errorMessage,
		fileSize,
		fileName,
		fileType,
		filePreview,
		croppedImage,
		uploadedRecordId,
		uploadCancelToken,
		uploadKey,
		isPreviewLoading,
		handleFileChange,
		handleCloseDialog,
		handleRetry,
		handleConfirmCrop,
		handleCancelCrop,
		setUploadKey,
	};
};

export default useFileUpload;
