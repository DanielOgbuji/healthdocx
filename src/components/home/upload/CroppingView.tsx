import { Flex, Text, Stack, VStack, Spinner, Slider, HStack, Box, Button } from "@chakra-ui/react";
import { PiCheck } from "react-icons/pi";
import Cropper, { type Area } from 'react-easy-crop';

interface CroppingViewProps {
    filePreview: string;
    isPreviewLoading: boolean;
    crop: { x: number; y: number };
    setCrop: (crop: { x: number; y: number }) => void;
    zoom: number;
    setZoom: (zoom: number) => void;
    rotation: number;
    setRotation: (rotation: number) => void;
    cropWidth: number;
    setCropWidth: (width: number) => void;
    cropHeight: number;
    setCropHeight: (height: number) => void;
    onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
    handleCancelCrop: () => void;
    handleCropConfirm: () => void;
}

const CroppingView = ({
    filePreview,
    isPreviewLoading,
    crop,
    setCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    cropWidth,
    setCropWidth,
    cropHeight,
    setCropHeight,
    onCropComplete,
    handleCancelCrop,
    handleCropConfirm
}: CroppingViewProps) => {
    return (
        <Flex justifyContent="center" alignItems="center" direction="column" p="12" px={{ mdDown: "6" }} gap="12" w="full" h="full">
            <Flex direction="column" justifyContent="center" alignItems="center" gap="3">
                <Text fontWeight="bold" fontSize="xl" color="primary" textAlign="center" lineHeight="moderate">Crop and Rotate Your Image</Text>
                <Text color="outline" textAlign="center">Adjust your image before uploading to get the best results.</Text>
            </Flex>
            <Flex w="full" h="full" pt="0" gap="12" direction={{ base: "column", mdDown: "column", lg: "row" }} justifyContent="center" alignItems="center">
                <Flex position="relative" width="full" height={{ base: "full", lgDown: "400px", mdDown: "300px" }} rounded="md" overflow="hidden" borderWidth="1px" borderColor="outlineVariant">
                    {isPreviewLoading || !filePreview ? (
                        <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center">
                            <VStack gap="4">
                                <Spinner size="xl" borderWidth="4px" color="primary" />
                                <Text color="primary" textAlign="center">Loading image...</Text>
                            </VStack>
                        </Stack>
                    ) : (
                        <Cropper
                            image={filePreview}
                            crop={crop}
                            objectFit="contain"
                            zoom={zoom}
                            rotation={rotation}
                            cropSize={{ width: cropWidth, height: cropHeight }}
                            onCropChange={setCrop}
                            zoomWithScroll={false}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    )}
                </Flex>

                <Flex width={{ base: "80%", mdDown: "90%" }} direction="column" gap="8">
                    <Flex direction="column" gap="2">
                        <Slider.Root
                            min={0.1}
                            max={3}
                            step={0.1}
                            value={[zoom]}
                            onValueChange={(e) => setZoom(e.value[0])}
                            colorPalette="brand"
                        >
                            <HStack justify="space-between">
                                <Slider.Label>Zoom</Slider.Label>
                                <Slider.ValueText />
                            </HStack>
                            <Slider.Control>
                                <Slider.Track>
                                    <Slider.Range />
                                </Slider.Track>
                                <Slider.Thumbs />
                            </Slider.Control>
                        </Slider.Root>
                    </Flex>

                    <Flex direction="column" gap="2">
                        <Slider.Root
                            min={0}
                            max={360}
                            step={1}
                            value={[rotation]}
                            onValueChange={(e) => setRotation(e.value[0])}
                            colorPalette="brand"
                        >
                            <HStack justify="space-between">
                                <Slider.Label>Rotation</Slider.Label>
                                <Text><Slider.ValueText />°</Text>
                            </HStack>
                            <Slider.Control>
                                <Slider.Track>
                                    <Slider.Range />
                                </Slider.Track>
                                <Slider.Thumbs />
                            </Slider.Control>
                        </Slider.Root>
                    </Flex>

                    <Flex direction="column" gap="2">
                        <Slider.Root
                            min={50}
                            max={800}
                            step={2}
                            value={[cropWidth]}
                            onValueChange={(e) => setCropWidth(e.value[0])}
                            colorPalette="brand"
                        >
                            <HStack justify="space-between">
                                <Slider.Label>Crop Width</Slider.Label>
                                <Slider.ValueText />
                            </HStack>
                            <Slider.Control>
                                <Slider.Track>
                                    <Slider.Range />
                                </Slider.Track>
                                <Slider.Thumbs />
                            </Slider.Control>
                        </Slider.Root>
                    </Flex>

                    <Flex direction="column" gap="2">
                        <Slider.Root
                            min={50}
                            max={800}
                            step={2}
                            value={[cropHeight]}
                            onValueChange={(e) => setCropHeight(e.value[0])}
                            colorPalette="brand"
                        >
                            <HStack justify="space-between">
                                <Slider.Label>Crop Height</Slider.Label>
                                <Slider.ValueText />
                            </HStack>
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
    );
}

export default CroppingView;
