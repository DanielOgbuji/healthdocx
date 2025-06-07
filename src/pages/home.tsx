import { Flex } from "@chakra-ui/react";
import InfoTile from "@/components/InfoTile";
import { Banner } from "@/components/Banner";
import SecondaryNavBar from "@/components/SecondaryNavBar";
import CostSegmentControl from "@/components/CostSegmentControl";
import CostTrend from "@/components/CostTrend";
import CostCharts from "@/components/CostCharts";
import CostStats from "@/components/CostStats";

const Home = () => {
    return (
        <>
            <SecondaryNavBar />
            <Flex mt="120px" direction="column" gap="4">
                <Banner />
                <Flex w="full" direction="column" pt="8" px={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }} gap="8">
                    <InfoTile />
                    <Flex direction="column" gap="8">
                        <CostSegmentControl />
                        <Flex direction={{ base: "row", lgDown: "column" }}>
                            <CostTrend />
                            <CostCharts />
                            <Flex direction="column" display={{ base: "flex", lgDown: "none" }} gap="2">
                                <CostStats label="Total Records Digitized" value="0" percentage={0} />
                                <CostStats label="Pending Review Count" value="0" percentage={0} />
                                <CostStats label="Extraction Accuracy Rate" value="0%" percentage={0} />
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    );
}

export default Home;