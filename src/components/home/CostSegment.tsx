import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import CostSegmentControl from "@/components/home/CostSegmentControl";
import CostTrend from "@/components/home/CostTrend";
import CostCharts from "@/components/home/CostCharts";
import CostStats from "@/components/home/CostStats";

const CostSegment = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("Monthly");
    return (
        <Flex direction="column" gap="8">
            <CostSegmentControl onPeriodChange={setSelectedPeriod} />
            <Flex direction={{ base: "row", lgDown: "column" }}>
                <CostTrend period={selectedPeriod} />
                <CostCharts />
                <Flex direction={{ base: "column", lgDown: "row" }} display={{ base: "flex", mdDown: "none" }} gap="2">
                    <CostStats label="Total Records Digitized" value="0" percentage={0} />
                    <CostStats label="Pending Review Count" value="0" percentage={0} />
                    <CostStats label="Extraction Accuracy Rate" value="0%" percentage={0} />
                </Flex>
            </Flex>
        </Flex>
    );
}

export default CostSegment;