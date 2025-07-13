import {
    Button,
    ButtonGroup,
    EmptyState,
    VStack,
    Box,
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
        handleContinueDetails,
        fileDescription,
        recordGroup,
        recordType,
    } = useFileUpload();

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const data = await getPatientRecords();
                setRecords(data);
            } catch {
                setError("Failed to fetch patient records.");
            } finally {
                setLoading(false);
            }
        };

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
            <VStack>
                <Text color="red.500">{error}</Text>
            </VStack>
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
                    handleContinueDetails={handleContinueDetails}
                    fileDescription={fileDescription}
                    recordGroup={recordGroup}
                    recordType={recordType}
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