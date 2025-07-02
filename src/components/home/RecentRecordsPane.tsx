import { Button, ButtonGroup, EmptyState, VStack, Box, Image } from "@chakra-ui/react"
import noRecord from "@/assets/images/norecord.svg";
import noRecordDark from "@/assets/images/norecord-dark.svg";
import { useColorMode } from "@/components/ui/color-mode";
import { IoMdAdd } from "react-icons/io";
import UploadButton from "@/components/home/UploadButton";
import useFileUpload from "@/hooks/useFileUpload";
import UploadDialog from "@/components/home/UploadDialog";

const RecentRecordsPane = () => {
    const { colorMode } = useColorMode();
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
    return (
        <EmptyState.Root>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    <Image src={colorMode === "dark" ? noRecordDark : noRecord} />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                    <EmptyState.Title>No Recent Records</EmptyState.Title>
                    <EmptyState.Description w={{ base: "full", lg: "75%" }} textWrap="balance" color="outline">
                        We've checked! There are no recent records to review. Once AI processes new records, you'll find them here for verification.
                    </EmptyState.Description>
                </VStack>
                <ButtonGroup gap="4" colorPalette="brand">
                    <Button variant="outline" size="sm" disabled >
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
    )
}

export default RecentRecordsPane;