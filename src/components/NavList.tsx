import { memo } from "react";
import { Box, List, Link as ChakraLink } from "@chakra-ui/react";
import { NavLink } from "react-router";

const NavList = () => {
    return (
        <Box as="nav" height="full">
            <List.Root listStyle="none" display="flex" flexDirection="row" h="full" fontSize="sm" fontWeight="medium" >
                <List.Item h="full">
                    <ChakraLink h="full" px="4" asChild textDecoration="none" focusRing="none" borderRadius="none" _hover={{ bg: "surface" }}>
                        <NavLink to="/home" end>
                            Home
                        </NavLink>
                    </ChakraLink>
                </List.Item>
                <List.Item h="full">
                    <ChakraLink h="full" px="4" asChild textDecoration="none" focusRing="none" borderRadius="none" _hover={{ bg: "surface" }}>
                        <NavLink to="/records" end>
                            Records
                        </NavLink>
                    </ChakraLink>
                </List.Item>
                <List.Item h="full">
                    <ChakraLink h="full" px="4" asChild textDecoration="none" focusRing="none" borderRadius="none" _hover={{ bg: "surface" }}>
                        <NavLink to="/analytics" end>
                            Analytics
                        </NavLink>
                    </ChakraLink>
                </List.Item>
                <List.Item h="full">
                    <ChakraLink h="full" px="4" asChild textDecoration="none" focusRing="none" borderRadius="none" _hover={{ bg: "surface" }}>
                        <NavLink to="/settings" end>
                            Settings
                        </NavLink>
                    </ChakraLink>
                </List.Item>
            </List.Root>
        </Box>
    );
}

export default memo(NavList);