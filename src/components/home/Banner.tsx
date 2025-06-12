import { Box, Float } from "@chakra-ui/react"

export const Banner = () => (
    <Box position="relative" w="full" h="84px" className="banner-background">
        <Float placement="bottom-start" offsetX={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }}>
            <Box w="64px" h="64px" ml="64px" borderColor="outlineVariant" borderWidth="1px" backgroundImage="url(https://cdn-images-1.medium.com/max/1200/1*kEtJGblSy5rQd6fgLGDsHA.jpeg)" bgSize="cover" rounded="md"></Box>
        </Float>
    </Box>
)
