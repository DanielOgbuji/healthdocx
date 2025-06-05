import { Flex, Box, Link as ChakraLink, List } from "@chakra-ui/react";
import { NavLink } from "react-router";

const SecondaryNavBar = () => {
    return (
        <>
            <Flex
                w="full"
                height="48px"
                bgColor="currentBg"
                borderBottom="1px solid"
                borderColor="outline/20"
                position="fixed"
                top="72px"
                px={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }}
            >
                <Box as="nav" height="full">
                    <List.Root listStyle="none" display="flex" flexDirection="row" h="full" fontSize="sm" fontWeight="medium" >
                        <List.Item h="full">
                            <ChakraLink h="full" px="4" asChild textDecoration="none" focusRing="none" borderRadius="none" _hover={{ bg: "secondary/4" }}>
                                <NavLink to="/home" style={({ isActive }) => ({
                                    borderRight: isActive ? "0px" : "initial",
                                    borderBottom: isActive ? "1px" : "initial",
                                    borderStyle: isActive ? "solid" : "initial",
                                    boxSizing: isActive ? "content-box" : "initial"
                                })} end>
                                    Overview
                                </NavLink>
                            </ChakraLink>
                        </List.Item>
                    </List.Root>
                </Box>
            </Flex>
        </>
    );
}

export default SecondaryNavBar;