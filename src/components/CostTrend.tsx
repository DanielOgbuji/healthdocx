import { Badge, FormatNumber, Flex, HStack, Stat, Box } from "@chakra-ui/react"

const CostTrend = () => {
    return (
        <Flex flexGrow="1">
            <Stat.Root>
                <Stat.Label textWrap="nowrap">Physical Storage Cost Savings</Stat.Label>
                <HStack>
                    <Box as="sub" fontSize="lg">₦</Box>
                    <Stat.ValueText fontSize="3xl">
                        <FormatNumber value={0} />
                    </Stat.ValueText>
                    <Badge colorPalette="green" gap="0">
                        <Stat.UpIndicator />
                        0%
                    </Badge>
                </HStack>
                <Stat.HelpText>since last month</Stat.HelpText>
            </Stat.Root>
        </Flex>
    )
}

export default CostTrend;
