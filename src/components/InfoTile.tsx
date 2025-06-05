import { Box, Flex, Heading, Text, Button } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { FiUploadCloud } from "react-icons/fi";

const InfoTile = () => {
    return (
            <Flex w="full" justifyContent="space-between" direction={{ base: "row", lgDown: "column" }} gap="4">
                <Flex gap="4" justifyContent="flex-start" alignItems="start">
                    <Flex direction="column" gap="1" pr="12">
                        <Heading size="3xl" textWrap="pretty">Me Cure Healthcare Limited, Lekki, Lagos</Heading>
                        <Text color="outline">Hospital ID: 46575932</Text>
                    </Flex>
                </Flex>
                <Flex gap="4" alignSelf="flex-start" width={{ base: "fit-content", lgDown: "full" }}>
                    <Button variant="outline" size="sm" flex={{ base: "none", lgDown: "1" }} disabled >
                        <IoMdAdd /> <Box as="span" fontSize="sm">Create record</Box>
                    </Button>
                    <Button variant="solid" size="sm" flex={{ base: "none", lgDown: "1" }} colorPalette="brand">
                        <FiUploadCloud /> <Box as="span" fontSize="sm">Upload record</Box>
                    </Button>
                </Flex>
        </Flex>
    );
}

export default InfoTile;