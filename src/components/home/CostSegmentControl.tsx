import { SegmentGroup, Flex } from "@chakra-ui/react"

interface CostSegmentControlProps {
    onPeriodChange: (value: string) => void;
}

const CostSegmentControl: React.FC<CostSegmentControlProps> = ({ onPeriodChange }) => {
    const handleValueChange = (details: { value: string | null }) => {
        if (details.value !== null) {
            onPeriodChange(details.value);
        }
    };

    return (
        <Flex w="full">
            <SegmentGroup.Root 
                defaultValue="Monthly" 
                bgColor="backface" 
                w="full"
                onValueChange={handleValueChange}
            >
                <SegmentGroup.Indicator bgColor="surface" />
                <SegmentGroup.Items items={["Yearly", "Monthly", "Weekly", "Daily"]} w="full" color="primary" />
            </SegmentGroup.Root>
        </Flex>
    )
}

export default CostSegmentControl;