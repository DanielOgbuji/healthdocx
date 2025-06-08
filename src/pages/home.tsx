import { Flex, Text, Separator, Card, Box, Icon } from "@chakra-ui/react";
import InfoTile from "@/components/InfoTile";
import { FiUploadCloud, FiEdit3 } from "react-icons/fi";
import { Banner } from "@/components/Banner";
import SecondaryNavBar from "@/components/SecondaryNavBar";
import CostSegment from "@/components/CostSegment";

const Home = () => {
    return (
        <>
            <SecondaryNavBar />
            <Flex mt="120px" direction="column" gap="4">
                <Banner />
                <Flex w="full" direction="column" pt="8" px={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }} gap="8">
                    <InfoTile />
                    <CostSegment />
                    <Flex direction="column">
                        <Text>Digitize your records</Text>
                        <Separator my="2" />
                        <Flex my="2" gap="4" direction={{ base: "row", mdDown: "column" }} >
                            <Card.Root flex={1}>
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
                            <Card.Root flex={1}>
                                <Card.Body gap="3" flexDirection="row" p="3" alignItems="center">
                                    <Flex h="44px" w="44px" bgColor="primary" justifyContent="center" alignItems="center" rounded="sm">
                                        <Icon size="md" color="onPrimary"><FiEdit3 /></Icon>
                                    </Flex>
                                    <Flex direction="column" gap="1">
                                        <Card.Title fontSize="sm" lineHeight="short">Create a record</Card.Title>
                                        <Card.Description fontSize="xs">
                                            Open the editor to start or use a template
                                        </Card.Description>
                                    </Flex>
                                </Card.Body>
                            </Card.Root>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    );
}

export default Home;