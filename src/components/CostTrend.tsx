import { Badge, FormatNumber, Flex, HStack, Stat, Box } from "@chakra-ui/react"

const CostTrend = ({ period = "Monthly" }) => {
    const getHelpText = () => {
        switch (period) {
            case "Yearly":
                return "since last year";
            case "Monthly":
                return "since last month";
            case "Weekly":
                return "since last week";
            case "Daily":
                return "since yesterday";
            default:
                return "since last month";
        }
    };

    return (
        <Flex flexGrow="1">
            <Stat.Root>
                <Stat.Label textWrap="nowrap">Physical Storage Cost Savings</Stat.Label>
                <HStack>
                    <Box as="sub" fontSize="lg">₦</Box>
                    <Stat.ValueText fontSize="3xl">
                        <FormatNumber value={0} />
                    </Stat.ValueText>
                    <Badge colorPalette="green">
                        <Stat.UpIndicator />
                        0%
                    </Badge>
                </HStack>
                <Stat.HelpText>{getHelpText()}</Stat.HelpText>
            </Stat.Root>
        </Flex>
    )
}

export default CostTrend;