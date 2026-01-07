import { useState, useCallback } from "react";
import { Flex, Text, Icon, Box, Button, Dialog, Portal, CloseButton } from "@chakra-ui/react";
import { FiAlertTriangle } from "react-icons/fi";
import { RxReload } from "react-icons/rx";
import { useNavigate } from "react-router";
// Note: You'll need to install this package: npm install react-easy-crop
import { type Area } from 'react-easy-crop';
import { toaster } from "@/components/ui/toaster";
import { createCroppedImage } from "@/utils/imageUtils";
import { UploadStatus, StorageKeys } from "@/constants/upload";
import CroppingView from "./upload/CroppingView";
import UploadProgressView from "./upload/UploadProgressView";
import UploadSuccessView from "./upload/UploadSuccessView";

interface UploadDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    uploadStatus: UploadStatus | "idle" | "cropping" | "uploading" | "success" | "error"; // Keeping string union for backward compatibility if needed, but preferably just UploadStatus
    errorMessage: string;
    fileSize: number;
    fileName: string;
    fileType: string;
    filePreview: string;
    croppedImage?: string | null;
    uploadedRecordId?: string | null;
    uploadProgress: number;
    isPreviewLoading?: boolean;
    onClose: () => void;
    onRetry: () => Promise<void>;
    handleConfirmCrop?: (croppedImageData: string) => Promise<void>;
    handleCancelCrop?: () => void;
}

const UploadDialog = ({
    open,
    setOpen,
    uploadStatus,
    fileSize,
    fileName,
    fileType,
    filePreview,
    uploadProgress,
    isPreviewLoading = false,
    uploadedRecordId,
    onClose,
    onRetry,
    handleConfirmCrop,
    handleCancelCrop
}: UploadDialogProps) => {

    const navigate = useNavigate();
    const [isExtracting, setIsExtracting] = useState(false)
    const handleSubmit = async () => {
        try {
            setIsExtracting(true);
            const id = uploadedRecordId || localStorage.getItem(StorageKeys.RecordId);

            if (!id) {
                throw new Error("No record ID found");
            }

            // Navigate to the details page with the record ID
            navigate(`/records/details/${id}`);

            // Show success message
            toaster.create({
                title: "Extraction Initiated",
                description: "Your file is being processed. You will be redirected shortly.",
                type: "success",
                duration: 5000,
            });

        } catch (error) {
            // console.error("Error during navigation:", error); 
            setIsExtracting(false);
            toaster.create({
                title: "Navigation Failed",
                description: "Could not navigate to the details page. Please try again.",
                type: "error",
                duration: 5000,
            });
        } finally {
            setIsExtracting(false);
        }
    };

    // State for cropping
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    //const [aspectRatio, setAspectRatio] = useState(16 / 9); // Default aspect ratio
    const [cropWidth, setCropWidth] = useState(200); // Default crop width
    const [cropHeight, setCropHeight] = useState(200); // Default crop height
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropConfirm = async () => {
        if (!croppedAreaPixels || !handleConfirmCrop) return;

        try {
            const croppedImage = await createCroppedImage(
                filePreview,
                croppedAreaPixels,
                rotation
            );

            await handleConfirmCrop(croppedImage);
        } catch (e) {
            console.error('Error creating cropped image:', e);
        }
    };
    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} size="cover" placement="center" motionPreset="slide-in-bottom" closeOnInteractOutside={false} closeOnEscape={false} scrollBehavior="outside" unmountOnExit>
            <Dialog.Trigger />
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner p={{ mdDown: "4" }}>
                    <Dialog.Content>
                        <Dialog.Body display="flex" justifyContent="center" alignItems="center" borderWidth="1px" borderColor="outlineVariant" rounded="md" bgColor="bg.panel" p="0">
                            {uploadStatus === "cropping" && (
                                <CroppingView
                                    filePreview={filePreview}
                                    isPreviewLoading={isPreviewLoading}
                                    crop={crop}
                                    setCrop={setCrop}
                                    zoom={zoom}
                                    setZoom={setZoom}
                                    rotation={rotation}
                                    setRotation={setRotation}
                                    cropWidth={cropWidth}
                                    setCropWidth={setCropWidth}
                                    cropHeight={cropHeight}
                                    setCropHeight={setCropHeight}
                                    onCropComplete={onCropComplete}
                                    handleCancelCrop={handleCancelCrop || (() => { })}
                                    handleCropConfirm={handleCropConfirm}
                                />
                            )}

                            {uploadStatus === "uploading" && (
                                <UploadProgressView
                                    fileType={fileType}
                                    fileName={fileName}
                                    uploadProgress={uploadProgress}
                                    fileSize={fileSize}
                                    onClose={onClose}
                                />
                            )}

                            {uploadStatus === "success" && (
                                <UploadSuccessView
                                    fileType={fileType}
                                    filePreview={filePreview}
                                    fileName={fileName}
                                    fileSize={fileSize}
                                    isExtracting={isExtracting}
                                    onClose={onClose}
                                    handleSubmit={handleSubmit}
                                />
                            )}

                            {uploadStatus === "error" && (
                                <>
                                    <Dialog.CloseTrigger asChild onClick={onClose}>
                                        <CloseButton size="sm" colorPalette="red" />
                                    </Dialog.CloseTrigger>
                                    <Flex justifyContent="center" alignItems="center" direction="column" gap="6" w="full">
                                        <Flex p="2" bgColor="bg.warning" rounded="md" borderColor="fg.warning" borderWidth="1px">
                                            <Icon as={FiAlertTriangle} size="2xl" color="fg.warning" m="2" />
                                        </Flex>
                                        <Flex direction="column" justifyContent="center" alignItems="center" gap="3" px={{ mdDown: "8" }}>
                                            <Text fontWeight="bold" fontSize="lg" textAlign="center" lineHeight="moderate">Something went wrong...</Text>
                                            <Text color="outline" textWrap="pretty" textAlign="center">Your file couldn't be uploaded. Don't worry! You can retry or reach out for help.</Text>
                                        </Flex>
                                        <Flex gap="4" justifyContent="center" width="full" colorPalette="brand" direction={{ base: "row", mdDown: "column" }} px={{ mdDown: "8" }}>
                                            <Button variant="outline" size="sm">
                                                <Box as="span" fontSize="sm">Contact Support</Box>
                                            </Button>
                                            <Button variant="solid" size="sm" onClick={onRetry}>
                                                <RxReload /> <Box as="span" fontSize="sm">Retry</Box>
                                            </Button>
                                        </Flex>
                                    </Flex>
                                </>
                            )}
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default UploadDialog;
