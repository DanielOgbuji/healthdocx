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
                defaultValue="30 days" 
                bgColor="backface" 
                borderColor="outline/24" 
                borderWidth="1px" 
                w="full"
                onValueChange={handleValueChange}
            >
                <SegmentGroup.Indicator bgColor="surface" />
                <SegmentGroup.Items fontSize="xs" lineHeight="shorter" items={["12 months", "30 days", "7 days", "24 hours"]} w="full" color="secondary" />
            </SegmentGroup.Root>
        </Flex>
    )
}

export default CostSegmentControl;