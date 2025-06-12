import { EmptyState, VStack, Image } from "@chakra-ui/react"
import noActivity from "@/assets/images/thinking.svg";
import noActivityDark from "@/assets/images/thinking-dark.svg";
import { useColorMode } from "@/components/ui/color-mode";

const RecentActivityPane = () => {
    const { colorMode } = useColorMode();
    return (
        <EmptyState.Root>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    <Image src={colorMode === "dark" ? noActivityDark : noActivity} />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                    <EmptyState.Title>No Activity Yet</EmptyState.Title>
                    <EmptyState.Description w={{ base: "full", xlDown: "75%", mdDown: "full" }} textWrap="balance" color="outline">
                        Your recent actions, file uploads, and record approvals will appear here. This keeps you updated on changes in your workspace.
                    </EmptyState.Description>
                </VStack>
            </EmptyState.Content>
        </EmptyState.Root>
    )
}

export default RecentActivityPane;