import { EmptyState, VStack, Image } from "@chakra-ui/react"
//import { MdAddChart } from "react-icons/md";
import { useColorMode } from "@/components/ui/color-mode";
import cradle from "@/assets/images/cradle.svg";
import cradleDark from "@/assets/images/cradle-dark.svg";

const CostCharts = () => {
    const { colorMode } = useColorMode();
    return (
        <EmptyState.Root>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    <Image src={colorMode === "dark" ? cradleDark : cradle} />
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
