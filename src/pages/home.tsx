import { Flex } from "@chakra-ui/react";
import InfoTile from "@/components/InfoTile";
import { Banner } from "@/components/Banner";
import SecondaryNavBar from "@/components/SecondaryNavBar";

const Home = () => {
    return (
        <>
            <SecondaryNavBar />
            <Flex mt="120px" direction="column" gap="4">
                <Banner />
                <Flex w="full" pt="8" px={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }}>
                    <InfoTile />
                </Flex>
            </Flex>
        </>
    );
}

export default Home;