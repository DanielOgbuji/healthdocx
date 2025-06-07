import { EmptyState, VStack, Icon } from "@chakra-ui/react"
import { MdAddChart } from "react-icons/md";

const CostCharts = () => {
    return (
        <EmptyState.Root>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    <Icon h="64px" w="64px" color="outlineVariant"><MdAddChart /></Icon>
                </EmptyState.Indicator>
                <VStack textAlign="center">
                    <EmptyState.Title>No Cost Comparison Yet</EmptyState.Title>
                    <EmptyState.Description textWrap="balance" color="outline">
                        Track and compare your overall cost efficiency with Healthdocx and without Healthdocx. This gives insight into how your overall cost efficiency improves.
                    </EmptyState.Description>
                </VStack>
            </EmptyState.Content>
        </EmptyState.Root>
    )
}

export default CostCharts;
