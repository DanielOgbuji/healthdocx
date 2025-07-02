import { Flex, Card, Box, Icon, FileUpload } from "@chakra-ui/react";
import { FiUploadCloud } from "react-icons/fi";
import { type FileChangeDetails } from "@zag-js/file-upload";

interface FileDropZoneProps {
    handleFileChange: (details: FileChangeDetails) => Promise<void>;
}

const FileDropZone = ({ handleFileChange }: FileDropZoneProps) => {
    return (
        <FileUpload.Root unstyled flex={1} key={Math.random()} accept={["image/png", "image/jpeg", "application/pdf"]} onFileChange={handleFileChange} maxFileSize={10 * 1024 * 1024}>
            <FileUpload.HiddenInput />
            <FileUpload.Dropzone>
                <FileUpload.DropzoneContent>
                    <Card.Root cursor="pointer">
                        <Card.Body gap="3" flexDirection="row" p="3" alignItems="center">
                            <Flex h="44px" w="44px" bgColor="primary" justifyContent="center" alignItems="center" rounded="sm">
                                <Icon size="md" color="onPrimary"><FiUploadCloud /></Icon>
                            </Flex>
                            <Flex direction="column" gap="1">
                                <Card.Title fontSize="sm" lineHeight="short">Click to upload <Box as="span" fontWeight="normal">or drag and drop</Box></Card.Title>
                                <Card.Description fontSize="xs">
                                    PNG, JPG or PDF
                                </Card.Description>
                            </Flex>
                        </Card.Body>
                    </Card.Root>
                </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>
        </FileUpload.Root>
    );
}

export default FileDropZone;