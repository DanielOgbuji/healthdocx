import { Flex, Image, HStack, Card, FormatByte, Text, Icon, Progress, Box } from "@chakra-ui/react";
//import { FiChevronDown, FiChevronUp, FiCamera, FiUploadCloud } from "react-icons/fi";
import uploadInProgress from "@/assets/images/Illustration.svg"
import { GrDocumentPdf } from "react-icons/gr";

const fileSize = 1000000; // 1 MB
const uploadProgress = 75; // Example progress percentage

const Records = () => {
    return (
        <Flex justifyContent="center" alignItems="center" direction="column" gap="6" w="full" h="full" py="32" >
            <Image src={uploadInProgress} />
            <Flex direction="column" justifyContent="center" alignItems="center" gap="2">
                <Text fontWeight="bold" fontSize="xl" color="primary">Hang tight! Your upload is <Box as="span" fontStyle="italic">in progress</Box></Text>
                <Text color="outline" textAlign="center" px="8">We're processing your file right now. Sit back, relax, and let the magic happen!</Text>
            </Flex>
            <Flex width={{ base: "60%", mdDown: "full" }} px={{ mdDown: "8" }} direction="column">
                <Card.Root flex={1}>
                    <Card.Body gap="4" flexDirection="column" p="4">
                        <Flex gap="4">
                            <Flex h="44px" w="44px" bgColor="outline/10" justifyContent="center" alignItems="center" rounded="sm">
                                <Icon size="md" color="onSurface">
                                    <GrDocumentPdf />
                                </Icon>
                            </Flex>
                            <Flex direction="column" gap="2">
                                <Card.Title fontSize="sm" lineHeight="short">Hospital File.pdf</Card.Title>
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

export default Records;