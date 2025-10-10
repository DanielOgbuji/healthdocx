import { Box, Float } from "@chakra-ui/react"
import HospitalImage from "@/assets/images/hospital_placeholder.png"

export const Banner = () => (
    <Box position="relative" w="full" h="84px" className="banner-background">
        <Float placement="bottom-start" offsetX={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }}>
            <Box w="64px" h="64px" ml="64px" borderColor="outlineVariant" borderWidth="1px" backgroundImage={`url(${HospitalImage})`} rounded="md" backgroundSize="60%" backgroundRepeat="no-repeat" backgroundPosition="center"></Box>
        </Float>
    </Box>
)
