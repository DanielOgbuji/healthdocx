import { EmptyState, VStack, Image } from "@chakra-ui/react"
import noActivity from "@/assets/images/thinking.svg"

const RecentActivityPane = () => {
    return (
        <EmptyState.Root>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    <Image src={noActivity} />
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