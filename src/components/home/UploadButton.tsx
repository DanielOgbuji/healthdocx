import { Icon, Button, Box, FileUpload } from "@chakra-ui/react";
import { FiUploadCloud } from "react-icons/fi";
import { type FileChangeDetails } from "@zag-js/file-upload";

interface UploadButtonProps {
    handleFileChange: (details: FileChangeDetails) => Promise<void>;
}

const UploadButton = ({ handleFileChange }: UploadButtonProps) => {
    return (
        <FileUpload.Root key={Math.random()} accept={["image/png", "image/jpeg", "application/pdf"]} onFileChange={handleFileChange} maxFileSize={10 * 1024 * 1024} maxFiles={1} unstyled flex={{ base: "none", lgDown: "1" }}>
            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild w="full">
                <Button variant="solid" size="sm">
                    <Icon as={FiUploadCloud} size="md" /> <Box as="span" fontSize="sm">Upload record </Box>
                </Button>
            </FileUpload.Trigger>
        </FileUpload.Root>
    );
};

export default UploadButton;
