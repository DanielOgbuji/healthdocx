import { Flex, Text, Box, Card, Icon, CloseButton, Progress, HStack, Dialog } from "@chakra-ui/react";
import { GrDocumentPdf, GrDocumentImage } from "react-icons/gr";
import uploadInProgress from "@/assets/images/Illustration.svg";
import { FormatByte, Image } from "@chakra-ui/react";

interface UploadProgressViewProps {
    fileType: string;
    fileName: string;
    uploadProgress: number;
    fileSize: number;
    onClose: () => void;
}

const UploadProgressView = ({
    fileType,
    fileName,
    uploadProgress,
    fileSize,
    onClose
}: UploadProgressViewProps) => {
    return (
        <Flex justifyContent="center" alignItems="center" direction="column" p="12" px={{ mdDown: "6" }} gap="6" w="full" h="full">
            <Image src={uploadInProgress} />
            <Flex direction="column" justifyContent="center" alignItems="center" gap="3">
                <Text fontWeight="bold" fontSize="xl" color="primary" textAlign="center" lineHeight="moderate">Hang tight! Your upload is <Box as="span" fontStyle="italic">in progress</Box></Text>
                <Text color="outline" textAlign="center">We're processing your file right now. Sit back, relax, and let the magic happen!</Text>
            </Flex>
            <Flex width={{ base: "60%", mdDown: "full" }} direction="column">
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
    );
}

export default UploadProgressView;
