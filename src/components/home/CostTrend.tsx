import { Badge, FormatNumber, Flex, HStack, Stat, Box } from "@chakra-ui/react"

const CostTrend = ({ period = "Monthly" }) => {
    const getHelpText = () => {
        switch (period) {
            case "12 months":
                return "since last year";
            case "30 days":
                return "since last month";
            case "7 days":
                return "since last week";
            case "24 hours":
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