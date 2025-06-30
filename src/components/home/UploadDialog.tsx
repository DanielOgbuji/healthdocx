import { Suspense, useState, useCallback } from "react";
import { Flex, Text, Icon, Image, Box, Card, HStack, Progress, Button, Dialog, Portal, CloseButton, Stack, VStack, Spinner, Slider } from "@chakra-ui/react";
import { GrDocumentPdf, GrDocumentImage } from "react-icons/gr";
import { FiAlertTriangle } from "react-icons/fi";
import { RxReload } from "react-icons/rx";
import { PiSparkle, PiCheck } from "react-icons/pi";
import uploadInProgress from "@/assets/images/Illustration.svg";
import { FormatByte } from "@chakra-ui/react";
import { getPatientRecords } from "@/api/patient-records";
import { useNavigate } from "react-router";
// Note: You'll need to install this package: npm install react-easy-crop
import Cropper from 'react-easy-crop';
import { type Area } from 'react-easy-crop';

interface UploadDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    uploadStatus: "idle" | "cropping" | "uploading" | "success" | "error";
    errorMessage: string;
    fileSize: number;
    fileName: string;
    fileType: string;
    filePreview: string;
    croppedImage?: string | null;
    uploadProgress: number;
    onClose: () => void;
    onRetry: () => Promise<void>;
    handleConfirmCrop?: (croppedImageData: string) => Promise<void>;
    handleCancelCrop?: () => void;
}

const LoadingFallback = () => (
    <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center">
        <VStack>
            <Spinner borderWidth="4px" color="primary" />
        </VStack>
    </Stack>
);


// Helper function to create a cropped image
const createCroppedImage = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
): Promise<string> => {
    const image = new window.Image();
    image.src = imageSrc;

    return new Promise((resolve) => {
        image.onload = () => {
            // Create a canvas large enough for the rotated image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                resolve('');
                return;
            }

            // Calculate bounding box for rotated image
            const radians = (rotation * Math.PI) / 180;
            const sin = Math.abs(Math.sin(radians));
            const cos = Math.abs(Math.cos(radians));
            const rotatedWidth = image.width * cos + image.height * sin;
            const rotatedHeight = image.width * sin + image.height * cos;

            canvas.width = rotatedWidth;
            canvas.height = rotatedHeight;

            // Move to center, rotate, then draw image centered
            ctx.translate(rotatedWidth / 2, rotatedHeight / 2);
            ctx.rotate(radians);
            ctx.drawImage(image, -image.width / 2, -image.height / 2);

            // Create a new canvas for the cropped image
            const cropCanvas = document.createElement('canvas');
            const cropCtx = cropCanvas.getContext('2d');

            if (!cropCtx) {
                resolve('');
                return;
            }

            cropCanvas.width = pixelCrop.width;
            cropCanvas.height = pixelCrop.height;

            // Draw the cropped area from the rotated image
            cropCtx.drawImage(
                canvas,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );
            console.log("Cropped image data:", cropCanvas.toDataURL('image/jpeg'));
            resolve(cropCanvas.toDataURL('image/jpeg'));
        };
    });
};

const UploadDialog = ({
    open,
    setOpen,
    uploadStatus,
    fileSize,
    fileName,
    fileType,
    filePreview,
    uploadProgress,
    onClose,
    onRetry,
    handleConfirmCrop,
    handleCancelCrop
}: UploadDialogProps) => {
    const navigate = useNavigate();

    // State for cropping
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [aspectRatio, setAspectRatio] = useState(16 / 9); // Default aspect ratio
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
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
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Body display="flex" justifyContent="center" alignItems="center" borderWidth="1px" borderColor="outlineVariant" rounded="md" h="full" p="0">
                            {uploadStatus === "cropping" && (
                                <Flex justifyContent="center" alignItems="center" direction="column" gap="6" w="full" h="full">
                                    <Flex direction="column" justifyContent="center" alignItems="center" gap="3" px={{ mdDown: "8" }}>
                                        <Text fontWeight="bold" fontSize="xl" color="primary" textAlign="center" lineHeight="moderate">Crop and Rotate Your Image</Text>
                                        <Text color="outline" textAlign="center">Adjust your image before uploading to get the best results.</Text>
                                    </Flex>
                                    <Flex w="full" p="12" pt="0" gap="12" direction={{ base: "column", mdDown: "column", lg: "row" }} justifyContent="center" alignItems="center">
                                        <Flex position="relative" width="full" height={{ base: "400px", mdDown: "200px" }} rounded="md" overflow="hidden" borderWidth="1px" borderColor="outlineVariant">
                                            <Cropper
                                                image={filePreview}
                                                crop={crop}
                                                objectFit="contain"
                                                zoom={zoom}
                                                rotation={rotation}
                                                aspect={aspectRatio}
                                                onCropChange={setCrop}
                                                onCropComplete={onCropComplete}
                                                onZoomChange={setZoom}
                                            />
                                        </Flex>

                                        <Flex width={{ base: "80%", mdDown: "90%" }} direction="column" gap="4">
                                            <Flex direction="column" gap="2">
                                                <Flex justifyContent="space-between">
                                                    <Text fontSize="sm">Zoom</Text>
                                                    <Text fontSize="sm">{zoom.toFixed(1)}x</Text>
                                                </Flex>
                                                <Slider.Root
                                                    min={1}
                                                    max={3}
                                                    step={0.1}
                                                    value={[zoom]}
                                                    onValueChange={(e) => setZoom(e.value[0])}
                                                    colorPalette="brand"
                                                >
                                                    <Slider.Control>
                                                        <Slider.Track>
                                                            <Slider.Range />
                                                        </Slider.Track>
                                                        <Slider.Thumbs />
                                                    </Slider.Control>
                                                </Slider.Root>
                                            </Flex>

                                            <Flex direction="column" gap="2">
                                                <Flex justifyContent="space-between">
                                                    <Text fontSize="sm">Rotation</Text>
                                                    <Text fontSize="sm">{rotation}°</Text>
                                                </Flex>
                                                <Slider.Root
                                                    min={0}
                                                    max={360}
                                                    step={1}
                                                    value={[rotation]}
                                                    onValueChange={(e) => setRotation(e.value[0])}
                                                    colorPalette="brand"
                                                >
                                                    <Slider.Control>
                                                        <Slider.Track>
                                                            <Slider.Range />
                                                        </Slider.Track>
                                                        <Slider.Thumbs />
                                                    </Slider.Control>
                                                </Slider.Root>
                                            </Flex>

                                            <Flex direction="column" gap="2">
                                                <Flex justifyContent="space-between">
                                                    <Text fontSize="sm">Aspect Ratio</Text>
                                                    <Text fontSize="sm">{aspectRatio.toFixed(2)}</Text>
                                                </Flex>
                                                <Slider.Root
                                                    min={0.25} // 1/4
                                                    max={4}    // 4/1
                                                    step={0.01}
                                                    value={[aspectRatio]}
                                                    onValueChange={(e) => setAspectRatio(e.value[0])}
                                                    colorPalette="brand"
                                                >
                                                    <Slider.Control>
                                                        <Slider.Track>
                                                            <Slider.Range />
                                                        </Slider.Track>
                                                        <Slider.Thumbs />
                                                    </Slider.Control>
                                                </Slider.Root>
                                            </Flex>

                                            <Flex gap="4" justifyContent="center" width="full" mt="4">
                                                <Button variant="outline" size="sm" onClick={handleCancelCrop}>
                                                    Cancel
                                                </Button>
                                                <Button variant="solid" size="sm" onClick={handleCropConfirm} colorPalette="brand">
                                                    <PiCheck /> <Box as="span" fontSize="sm">Confirm</Box>
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            )}

                            {uploadStatus === "uploading" && (
                                <Flex justifyContent="center" alignItems="center" direction="column" gap="6" w="full" h="full">
                                    <Image src={uploadInProgress} />
                                    <Flex direction="column" justifyContent="center" alignItems="center" gap="3" px={{ mdDown: "8" }}>
                                        <Text fontWeight="bold" fontSize="xl" color="primary" textAlign="center" lineHeight="moderate">Hang tight! Your upload is <Box as="span" fontStyle="italic">in progress</Box></Text>
                                        <Text color="outline" textAlign="center">We're processing your file right now. Sit back, relax, and let the magic happen!</Text>
                                    </Flex>
                                    <Flex width={{ base: "50%", mdDown: "full" }} px={{ mdDown: "8" }} direction="column">
                                        <Card.Root flex={1}>
                                            <Card.Body gap="4" flexDirection="column" p="4">
                                                <Flex gap="4">
                                                    <Flex h="44px" w="44px" bgColor="outline/10" justifyContent="center" alignItems="center" rounded="sm">
                                                        <Icon size="md" color="onSurface">
                                                            {fileType === "application/pdf" ? <GrDocumentPdf /> : <GrDocumentImage />}
                                                        </Icon>
                                                        <Dialog.CloseTrigger asChild onClick={onClose}>
                                                            <CloseButton size="sm" />
                                                        </Dialog.CloseTrigger>
                                                    </Flex>
                                                    <Flex direction="column" gap="2">
                                                        <Card.Title fontSize="sm" lineHeight="short">{fileName}</Card.Title>
                                                        <Card.Description fontSize="xs">
                                                            <FormatByte value={Math.round(uploadProgress * fileSize / 100)} /> of <FormatByte value={fileSize} />
                                                        </Card.Description>
                                                    </Flex>
                                                </Flex>
                                                <Progress.Root value={uploadProgress} size="lg" width="full" colorPalette="brand" striped animated>
                                                    <HStack gap="5">
                                                        <Progress.Track flex="1" rounded="full">
                                                            <Progress.Range />
                                                        </Progress.Track>
                                                        <Progress.ValueText>{uploadProgress}%</Progress.ValueText>
                                                    </HStack>
                                                </Progress.Root>
                                            </Card.Body>
                                        </Card.Root>
                                    </Flex>
                                </Flex >
                            )}

                            {uploadStatus === "success" && (
                                <Flex justifyContent="center" alignItems="center" direction="column" gap="6" w="full">
                                    <Flex p="2" bgColor="outline/10" rounded="md">
                                        {fileType === "application/pdf" ? (
                                            <Icon as={GrDocumentPdf} size="2xl" color="onSurface" m="2" />
                                        ) : (
                                            <Suspense fallback={<LoadingFallback />}>
                                                <Image src={filePreview} height="160px" />
                                            </Suspense>
                                        )}
                                    </Flex>
                                    <Flex direction="column" justifyContent="center" alignItems="center" gap="3" px={{ mdDown: "8" }}>
                                        <Text fontWeight="bold" fontSize="lg" textAlign="center" lineHeight="moderate">Done! Your file is <Box as="span" fontStyle="italic">successfully uploaded</Box></Text>
                                        <Text color="outline" textWrap="pretty" textAlign="center">Your file has been uploaded without a hitch and is now ready to use.</Text>
                                    </Flex>
                                    <Flex width={{ base: "50%", mdDown: "full" }} px={{ mdDown: "8" }} direction="column">
                                        <Card.Root flex={1}>
                                            <Card.Body gap="4" flexDirection="column" p="4">
                                                <Flex gap="4">
                                                    <Flex h="44px" w="44px" bgColor="surface" justifyContent="center" alignItems="center" rounded="sm">
                                                        <Icon size="md" color="onSurface">
                                                            {fileType === "application/pdf" ? <GrDocumentPdf /> : <GrDocumentImage />}
                                                        </Icon>
                                                        <Dialog.CloseTrigger asChild onClick={onClose}>
                                                            <CloseButton size="sm" colorPalette="red" />
                                                        </Dialog.CloseTrigger>
                                                    </Flex>
                                                    <Flex direction="column" gap="2">
                                                        <Card.Title fontSize="sm" lineHeight="short" textOverflow="ellipsis">{fileName}</Card.Title>
                                                        <Card.Description fontSize="xs">
                                                            <FormatByte value={fileSize} />
                                                        </Card.Description>
                                                    </Flex>
                                                </Flex>
                                            </Card.Body>
                                        </Card.Root>
                                    </Flex>
                                    <Flex gap="4" justifyContent="center" width="full" colorPalette="brand" direction={{ base: "row", mdDown: "column" }} px={{ mdDown: "8" }}>
                                        <Button variant="solid" size="sm" onClick={async () => {
                                            try {
                                                const records = await getPatientRecords();
                                                console.log("Fetched records:", records);
                                                const lastRecord = records[records.length - 1];
                                                console.log("Fetched last record:", lastRecord);
                                                const structuredData = lastRecord.data.structuredData;
                                                const id = lastRecord.id;
                                                localStorage.setItem("structuredData", structuredData);
                                                localStorage.setItem("id", id);
                                                console.log("Data saved to local storage:", { structuredData, id });
                                                navigate(`/records/details/${id}`, {
                                                    state: { structuredData, id }
                                                });
                                            } catch (error) {
                                                console.error("Error saving data to local storage:", error);
                                            }
                                        }}>
                                            <PiSparkle /> <Box as="span" fontSize="sm">Extract record</Box>
                                        </Button>
                                    </Flex>
                                </Flex>
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
