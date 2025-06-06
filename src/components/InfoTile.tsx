import { useState } from "react";
import { Box, Flex, Heading, Text, Button, Menu, Portal, Icon, IconButton } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { NavLink } from "react-router";
import { FiChevronDown, FiChevronUp, FiCamera, FiUploadCloud } from "react-icons/fi";
import { GrScan } from "react-icons/gr";
import { LuScanText } from "react-icons/lu";

const InfoTile = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Flex w="full" justifyContent="space-between" direction={{ base: "row", lgDown: "column" }} gap="4">
            <Flex w="full">
                <Flex gap="4" justifyContent="flex-start" alignItems="start">
                    <Flex direction="column" gap="1" pr={{ base: "12", smDown: "4" }}>
                        <Heading size="3xl" textWrap="pretty">Me Cure Healthcare Limited, Lekki, Lagos</Heading>
                        <Text color="outline">Hospital ID: 46575932</Text>
                    </Flex>
                </Flex>
                <Menu.Root onOpenChange={(details: { open: boolean }) => setIsOpen(details.open)}>
                    <Menu.Trigger asChild colorPalette="brand">
                        <IconButton variant="ghost" size="sm" px="2" ml="auto" focusRing="none">
                            <Icon size="md"><LuScanText /></Icon>
                            <Icon as={isOpen ? FiChevronUp : FiChevronDown} size="md" />
                        </IconButton>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content bgColor="backface" borderWidth="1px" borderColor="primary/20">
                                <Menu.Item value="new-txt" asChild _hover={{ bgColor: "primary/8" }} color="primary">
                                    <NavLink to="/" end>
                                        <FiCamera />
                                        Camera
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item value="new-file" asChild _hover={{ bgColor: "primary/8" }} color="primary">
                                    <NavLink to="/" end>
                                        <GrScan />
                                        Scanner
                                    </NavLink>
                                </Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            </Flex>
            <Flex gap="4" alignSelf="flex-start" width={{ base: "fit-content", lgDown: "full" }} colorPalette="brand">
                <Button variant="outline" size="sm" flex={{ base: "none", lgDown: "1" }} disabled >
                    <IoMdAdd /> <Box as="span" fontSize="sm">Create record</Box>
                </Button>
                <Button variant="solid" size="sm" flex={{ base: "none", lgDown: "1" }}>
                    <Icon as={FiUploadCloud} size="md" /> <Box as="span" fontSize="sm">Upload record </Box>
                </Button>
            </Flex>
        </Flex>
    );
}

export default InfoTile;