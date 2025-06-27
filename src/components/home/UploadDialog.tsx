import { Suspense } from "react";
import { Flex, Text, Icon, Image, Box, Card, HStack, Progress, Button, Dialog, Portal, CloseButton, Stack, VStack, Spinner } from "@chakra-ui/react";
import { GrDocumentPdf, GrDocumentImage } from "react-icons/gr";
import { FiAlertTriangle } from "react-icons/fi";
import { RxReload } from "react-icons/rx";
import { PiSparkle } from "react-icons/pi";
import uploadInProgress from "@/assets/images/Illustration.svg";
import { FormatByte } from "@chakra-ui/react";
import { getPatientRecords } from "@/api/patient-records";
import { useNavigate } from "react-router";

interface UploadDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    uploadStatus: "idle" | "uploading" | "success" | "error";
    errorMessage: string;
    fileSize: number;
    fileName: string;
    fileType: string;
    filePreview: string;
    uploadProgress: number;
    onClose: () => void;
    onRetry: () => Promise<void>;
}

const LoadingFallback = () => (
    <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center">
        <VStack>
            <Spinner borderWidth="4px" color="primary" />
        </VStack>
    </Stack>
);


const UploadDialog = ({ open, setOpen, uploadStatus, fileSize, fileName, fileType, filePreview, uploadProgress, onClose, onRetry }: UploadDialogProps) => {
    const navigate = useNavigate();
    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} size="cover" placement="center" motionPreset="slide-in-bottom" closeOnInteractOutside={false} closeOnEscape={false} scrollBehavior="outside" unmountOnExit>
            <Dialog.Trigger />
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Body display="flex" justifyContent="center" alignItems="center" borderWidth="1px" borderColor="outlineVariant" rounded="md" h="full" p="0">
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
