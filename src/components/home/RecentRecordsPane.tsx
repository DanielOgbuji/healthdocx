import {
    Button,
    ButtonGroup,
    EmptyState,
    Flex,
    VStack,
    Box,
    Icon,
    Image,
    Spinner,
    Text,
    Stack,
} from "@chakra-ui/react";
import noRecord from "@/assets/images/norecord.svg";
import noRecordDark from "@/assets/images/norecord-dark.svg";
import { useColorMode } from "@/components/ui/color-mode";
import { IoMdAdd } from "react-icons/io";
import UploadButton from "@/components/home/UploadButton";
import useFileUpload from "@/hooks/useFileUpload";
import UploadDialog from "@/components/home/UploadDialog";
import { useEffect, useState } from "react";
import { getPatientRecords } from "@/api/patient-records";
import type { PatientRecord } from "@/types/api.types";
import RecentRecordCard from "./RecentRecordCard";
import { FiAlertTriangle } from "react-icons/fi"
import { RxReload } from "react-icons/rx"

const RecentRecordsPane = () => {
    const { colorMode } = useColorMode();
    const [records, setRecords] = useState<PatientRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
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
        handleFileChange,
        handleCloseDialog,
        handleRetry,
        handleConfirmCrop,
        handleCancelCrop,
    } = useFileUpload();

    const fetchRecords = async () => {
        try {
            const data = await getPatientRecords();
            setRecords(data);
            setError(null); // Clear any previous errors on successful fetch
        } catch {
            setError("Failed to fetch patient records.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    if (loading) {
        return (
            <Stack flexGrow="1" h="xs" alignItems="center" justifyContent="center">
                <VStack>
                    <Spinner size="xl" borderWidth="4px" color="primary" />
                    <Text color="primary">Loading...</Text>
                </VStack>
            </Stack>
        );
    }

    if (error) {
        return (
            <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center" mt="12">
                <Flex justifyContent="center" alignItems="center" direction="column" gap="6" w="full">
                    <Flex p="2" bgColor="bg.warning" rounded="md" borderColor="fg.warning" borderWidth="1px">
                        <Icon as={FiAlertTriangle} size="2xl" color="fg.warning" m="2" />
                    </Flex>
                    <Flex direction="column" justifyContent="center" alignItems="center" gap="3" px={{ mdDown: "8" }}>
                        <Text fontWeight="bold" fontSize="lg" textAlign="center" lineHeight="moderate">Something went wrong...</Text>
                        <Text color="outline" textWrap="pretty" textAlign="center">{error}</Text>
                    </Flex>
                    <Flex gap="4" justifyContent="center" width="full" colorPalette="brand" direction={{ base: "row", mdDown: "column" }} px={{ mdDown: "8" }}>
                        <Button variant="outline" size="sm">
                            <Box as="span" fontSize="sm">Contact Support</Box>
                        </Button>
                        <Button variant="solid" size="sm" onClick={() => fetchRecords()}>
                            <RxReload /> <Box as="span" fontSize="sm">Retry</Box>
                        </Button>
                    </Flex>
                </Flex>
            </Stack>
        );
    }

    if (records.length === 0) {
        return (
            <EmptyState.Root>
                <EmptyState.Content>
                    <EmptyState.Indicator>
                        <Image src={colorMode === "dark" ? noRecordDark : noRecord} />
                    </EmptyState.Indicator>
                    <VStack textAlign="center">
                        <EmptyState.Title>No Recent Records</EmptyState.Title>
                        <EmptyState.Description
                            w={{ base: "full", lg: "75%" }}
                            textWrap="balance"
                            color="outline"
                        >
                            We've checked! There are no recent records to review. Once AI
                            processes new records, you'll find them here for verification.
                        </EmptyState.Description>
                    </VStack>
                    <ButtonGroup gap="4" colorPalette="brand">
                        <Button variant="outline" size="sm" disabled>
                            <IoMdAdd /> <Box as="span" fontSize="sm">Create record</Box>
                        </Button>
                        <UploadButton handleFileChange={handleFileChange} />
                    </ButtonGroup>
                </EmptyState.Content>
                <UploadDialog
                    open={open}
                    setOpen={setOpen}
                    uploadStatus={uploadStatus}
                    errorMessage={errorMessage}
                    fileSize={fileSize}
                    fileName={fileName}
                    fileType={fileType}
                    filePreview={filePreview}
                    croppedImage={croppedImage}
                    uploadProgress={uploadProgress}
                    onClose={handleCloseDialog}
                    onRetry={handleRetry}
                    handleConfirmCrop={handleConfirmCrop}
                    handleCancelCrop={handleCancelCrop}
                />
            </EmptyState.Root>
        );
    }

    return (
        <Stack gap={4} mt="4" flexDirection={{ base: "column", md: "row" }}>
            {records.slice(-2).map((record) => (
                <RecentRecordCard
                    key={record.id}
                    imageUrl={record.rawFileUrl}
                    recordID={record.id}
                    recordType={record.recordType}
                    recordGroup={record.recordTypeGroup}
                    createdAt={record.uploadedAt}
                />
            ))}
        </Stack>
    );
};

export default RecentRecordsPane;
