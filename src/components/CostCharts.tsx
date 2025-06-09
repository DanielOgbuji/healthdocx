import { EmptyState, VStack, Image } from "@chakra-ui/react"
//import { MdAddChart } from "react-icons/md";
import cradle from "@/assets/images/cradle.svg"

const CostCharts = () => {
    return (
        <EmptyState.Root>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    <Image src={cradle} />
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
