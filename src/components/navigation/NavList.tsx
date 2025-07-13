import { memo, useState } from "react";
import { Box, List, Link as ChakraLink, Menu, Portal, Button, Icon } from "@chakra-ui/react";
import { MdMenu, MdMenuOpen } from "react-icons/md";
import { NavLink } from "react-router";

const NavList = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Box as="nav" height="full" display={{ mdDown: "none" }}>
                <List.Root listStyle="none" display="flex" flexDirection="row" h="full" fontSize="sm" fontWeight="medium" >
                    <List.Item h="full">
                        <ChakraLink h="full" px="4" asChild textDecoration="none" focusRing="none" borderRadius="none" _hover={{ bg: "secondary/6" }}>
                            <NavLink to="/home" end>
                                Home
                            </NavLink>
                        </ChakraLink>
                    </List.Item>
                    <List.Item h="full">
                        <ChakraLink h="full" px="4" asChild textDecoration="none" focusRing="none" borderRadius="none" _hover={{ bg: "secondary/6" }}>
<NavLink to="/records">
                                Records
                            </NavLink>
                        </ChakraLink>
                    </List.Item>
                    <List.Item h="full">
                        <ChakraLink h="full" px="4" asChild textDecoration="none" focusRing="none" borderRadius="none" _hover={{ bg: "secondary/6" }}>
                            <NavLink to="/analytics" end>
                                Analytics
                            </NavLink>
                        </ChakraLink>
                    </List.Item>
                    <List.Item h="full">
                        <ChakraLink h="full" px="4" asChild textDecoration="none" focusRing="none" borderRadius="none" _hover={{ bg: "secondary/6" }}>
                            <NavLink to="/settings" end>
                                Settings
                            </NavLink>
                        </ChakraLink>
                    </List.Item>
                </List.Root>
            </Box>
            <Box my="auto" colorPalette="brand" display={{ base: "none", mdDown: "flex" }}>
                <Menu.Root onOpenChange={(details: { open: boolean }) => setIsOpen(details.open)}>
                    <Menu.Trigger asChild>
                        <Button variant="outline" size="sm">
                            <Icon as={isOpen ? MdMenuOpen : MdMenu} size="md" /> <Box as="span" fontSize="sm" display={{ base: "none", sm: "inline" }}>Menu</Box>
                        </Button>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content display={{ mdTo2xl: "none" }}>
                                <Menu.Item value="new-txt" asChild _hover={{ bg: "secondary/4"}}>
                                    <NavLink to="/home" end>
                                        Home
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item value="new-file" asChild _hover={{ bg: "secondary/4"}}>
                                    <NavLink to="/records">
                                        Records
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item value="new-win" asChild _hover={{ bg: "secondary/4"}}>
                                    <NavLink to="/analytics" end>
                                        Analytics
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item value="open-file" asChild _hover={{ bg: "secondary/4"}}>
                                    <NavLink to="/settings" end>
                                        Settings
                                    </NavLink>
                                </Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            </Box>
        </>
    );
}

export default memo(NavList);
