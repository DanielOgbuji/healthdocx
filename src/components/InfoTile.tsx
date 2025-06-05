import { useState } from "react";
import { Box, Flex, Heading, Text, Button, Menu, Portal, Icon } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { NavLink } from "react-router";
import { RiQrScan2Line } from "react-icons/ri";
import { FiChevronDown, FiChevronUp, FiCamera, FiUploadCloud } from "react-icons/fi";

const InfoTile = () => {
    const [isOpen, setIsOpen] = useState(false);
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
                <Menu.Root onOpenChange={(details: { open: boolean }) => setIsOpen(details.open)} positioning={{ placement: "bottom-end" }}>
                    <Menu.Trigger asChild colorPalette="brand">
                        <Button variant="solid" size="sm" flex={{ base: "none", lgDown: "1" }}>
                            <Icon as={FiUploadCloud} size="md" /> <Box as="span" fontSize="sm">Upload record </Box> <Icon as={isOpen ? FiChevronUp : FiChevronDown} size="md" />
                        </Button>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content bgColor="backface" borderWidth="1px" borderColor="primary/20">
                                <Menu.Item value="new-txt" asChild _hover={{ bg: "primary/10" }} color="primary">
                                    <NavLink to="/" end>
                                        <FiCamera />
                                        Camera
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item value="new-file" asChild _hover={{ bg: "primary/10" }} color="primary">
                                    <NavLink to="/" end>
                                        <RiQrScan2Line />
                                        Scanner
                                    </NavLink>
                                </Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            </Flex>
        </Flex>
    );
}

export default InfoTile;