import { Suspense } from "react";
import { Flex, Text, Box, Card, Icon, CloseButton, Button, Dialog, Image, Spinner, Stack, VStack } from "@chakra-ui/react";
import { GrDocumentPdf, GrDocumentImage } from "react-icons/gr";
import { PiSparkle } from "react-icons/pi";
import { FormatByte } from "@chakra-ui/react";

interface UploadSuccessViewProps {
    fileType: string;
    filePreview: string;
    fileName: string;
    fileSize: number;
    isExtracting: boolean;
    onClose: () => void;
    handleSubmit: () => void;
}

const LoadingFallback = () => (
    <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center">
        <VStack>
            <Spinner size="xl" borderWidth="4px" color="primary" />
        </VStack>
    </Stack>
);

const UploadSuccessView = ({
    fileType,
    filePreview,
    fileName,
    fileSize,
    isExtracting,
    onClose,
    handleSubmit
}: UploadSuccessViewProps) => {
    return (
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
                <Button variant="solid" size="sm" onClick={handleSubmit} loading={isExtracting} loadingText="Extracting...">
                    <PiSparkle /> <Box as="span" fontSize="sm">Open record</Box>
                </Button>
                <Dialog.CloseTrigger asChild onClick={onClose} colorPalette="red">
                    <CloseButton size="sm" />
                </Dialog.CloseTrigger>
            </Flex>
        </Flex>
    );
}

export default UploadSuccessView;
