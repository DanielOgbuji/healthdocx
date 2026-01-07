import { Box, Button, Drawer, Flex, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import type { ReactNode } from "react";
import Backdrop from "@/assets/images/jeay-backdrop-dotted.svg";
import BackdropDark from "@/assets/images/jeay-backdrop-dotted-dark.svg";
import ContactInfo from "./ContactInfo";
import { MdInfoOutline, MdClose } from "react-icons/md";

interface ContactLayoutProps {
    children: ReactNode;
}

const ContactLayout = ({ children }: ContactLayoutProps) => {
    // Chakra v3 Drawer state management
    const [open, setOpen] = useState(false);

    return (
        <Flex minH="100vh">
            {/* Desktop Fixed Sidebar */}
            <Flex
                position="fixed"
                display={{ base: "none", lg: "flex" }}
                height="calc(100vh - 2rem)"
                margin="4" mr="0"
                width="360px"
                bgImage={{
                    base: `url("${Backdrop}")`,
                    _dark: `url("${BackdropDark}")`,
                }}
                bgRepeat="no-repeat"
                bgAttachment="fixed"
                bgPos="0% 124%"
                bgSize="360px"
                zIndex="sticky"
            >
                <Flex
                    bgGradient="to-b"
                    gradientFrom="surface"
                    gradientTo="transparent"
                    borderWidth="thin"
                    borderRadius="lg"
                    direction="column"
                    justifyContent="space-between"
                    boxSizing="border-box"
                    height="100%"
                    width="100%"
                    p="8"
                    overflowY="auto"
                >
                    <ContactInfo />
                </Flex>
            </Flex>

            {/* Spacer for Desktop */}
            <Box width={{ base: "0", lg: "calc(360px + 2rem)" }} flexShrink="0" />

            {/* Main Content Area */}
            <Box flex="1" p={{ base: "4", md: "8" }} width="100%">
                <Flex justifyContent={{ base: "flex-end", lg: "none" }} mb={{ base: "4", lg: "0" }}>
                    <Button
                        variant="ghost"
                        colorPalette="brand"
                        onClick={() => setOpen(true)}
                        display={{ base: "flex", lg: "none" }}
                        gap="2"
                    >
                        <MdInfoOutline size="20px" />
                        Contact Info
                    </Button>
                </Flex>
                {children}
            </Box>

            {/* Mobile Drawer */}
            <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            {/* Empty header or close button only */}
                            <Drawer.CloseTrigger asChild>
                                <IconButton aria-label="Close contact info" variant="ghost" size="sm" position="absolute" top="4" right="4">
                                    <MdClose />
                                </IconButton>
                            </Drawer.CloseTrigger>
                        </Drawer.Header>
                        <Drawer.Body pt="8">
                            <ContactInfo />
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>
        </Flex>
    );
};

export default ContactLayout;
