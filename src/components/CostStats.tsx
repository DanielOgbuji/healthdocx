import { Badge, Stat, Flex } from "@chakra-ui/react"

interface CostStatsProps {
    label: string;
    value: string;
    percentage: number;
    isIncrease?: boolean;
}

const CostStats = ({ label, value, percentage, isIncrease = false }: CostStatsProps) => {
    return (
        <Flex flexGrow="1">
            <Stat.Root>
                <Stat.Label textWrap="nowrap">{label}</Stat.Label>
                <Flex gap="2">
                    <Stat.ValueText>{value}</Stat.ValueText>
                    <Badge colorPalette={isIncrease ? "green" : "red"} variant="plain" px="0" gap="0">
                        {isIncrease ? <Stat.UpIndicator /> : <Stat.DownIndicator />}
                        {Math.abs(percentage)}%
                    </Badge>
                </Flex>
            </Stat.Root>
        </Flex>
    )
}

export default CostStats;