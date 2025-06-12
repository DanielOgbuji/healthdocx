import { Button, ButtonGroup, EmptyState, VStack, Box, Icon, Image } from "@chakra-ui/react"
import noRecord from "@/assets/images/norecord.svg";
import noRecordDark from "@/assets/images/norecord-dark.svg";
import { useColorMode } from "@/components/ui/color-mode";
import { IoMdAdd } from "react-icons/io";
import { FiUploadCloud } from "react-icons/fi";

const RecentRecordsPane = () => {
    const { colorMode } = useColorMode();
    return (
        <EmptyState.Root>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    <Image src={colorMode === "dark" ? noRecordDark : noRecord} />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                    <EmptyState.Title>No Recent Records</EmptyState.Title>
                    <EmptyState.Description w={{ base: "full", lg: "75%" }} textWrap="balance" color="outline">
                        We've checked! There are no recent records to review. Once AI processes new records, you'll find them here for verification.
                    </EmptyState.Description>
                </VStack>
                <ButtonGroup gap="4" colorPalette="brand">
                    <Button variant="outline" size="sm" disabled >
                        <IoMdAdd /> <Box as="span" fontSize="sm">Create record</Box>
                    </Button>
                    <Button variant="solid" size="sm">
                        <Icon as={FiUploadCloud} size="md" /> <Box as="span" fontSize="sm">Upload record </Box>
                    </Button>
                </ButtonGroup>
            </EmptyState.Content>
        </EmptyState.Root>
    )
}

export default RecentRecordsPane;