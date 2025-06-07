import { SegmentGroup, Flex } from "@chakra-ui/react"

const CostSegmentControl = () => {
    return (
        <Flex w="full">
            <SegmentGroup.Root defaultValue="Monthly" bgColor="backface" w="full">
                <SegmentGroup.Indicator bgColor="surface" />
                <SegmentGroup.Items items={["Yearly", "Monthly", "Weekly", "Daily"]} w="full" color="primary" />
            </SegmentGroup.Root>
        </Flex>
    )
}

export default CostSegmentControl;
