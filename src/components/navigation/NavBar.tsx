import { memo, useState } from "react";
import { Button, Box, Flex, Image, Separator, Text, HStack, IconButton, Icon, Avatar, Menu, Portal, Circle, Float, Dialog } from "@chakra-ui/react";
import { MdOutlineNotifications, MdPersonOutline, MdOutlineSupport, MdOutlineLogout } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { RxLightningBolt } from "react-icons/rx";
import NavList from "@/components/navigation/NavList";
import Logo from "@/assets/images/off-jeay.svg";
import LogoDark from "@/assets/images/off-jeay-dark.svg";
import { useColorMode } from "@/components/ui/color-mode";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router";
import { logout } from "@/features/authSlice";
import type { RootState } from '@/store/store';

const NavBar = () => {
    const { colorMode } = useColorMode();
    const userName = useSelector((state: RootState) => state.auth.user?.fullName || "User");
    const userEmail = useSelector((state: RootState) => state.auth.user?.email || "user@example.com");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const handleMenuItemSelect = ({ value }: { value: string }) => {
        if (value === "logout") {
            setIsLogoutDialogOpen(true);
        } else if (value === "support") {
            navigate("/contact-form");
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/sign-in");
    };

    const handleCloseDialog = () => {
        setIsLogoutDialogOpen(false);
    };

    return (
        <>
            <Flex
                position="fixed"
                zIndex="docked"
                bgColor="currentBg"
                width="full"
                px={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }}
                height="72px"
                borderBottom="1px solid"
                borderColor="outline/20"
            >
                <Flex gap="4" alignItems="center" height="full" pr={{ mdDown: "4", base: "12" }}>
                    <Image
                        src={colorMode === "dark" ? LogoDark : Logo}
                        width="36px"
                        height="36px"
                        alt="Company Logo"
                        loading="lazy"
                    />
                    <Separator orientation="vertical" height="24px" color="green" display={{ lgDown: "none" }} />
                    <Text
                        display={{ lgDown: "none" }}
                        fontSize="xl"
                        fontFamily="Figtree"
                        fontWeight="black"
                        fontStyle="italic"
                        color="primary"
                    >
                        HealthDocX
                    </Text>
                </Flex>
                <NavList />
                <Flex
                    ml="auto"
                    alignItems="center"
                    height="full"
                    colorPalette="brand"
                    gap="4"
                >
                    <HStack gap="4">
                        <Button variant="ghost" size="sm" p={{ xlDown: "0" }} disabled>
                            <RxLightningBolt /> <Box as="span" fontSize="sm" display={{ xlDown: "none" }}>Upgrade now</Box>
                        </Button>
                        <Button variant="surface" size="sm" p={{ lgDown: "0" }} disabled>
                            <Icon size="md"><IoMdAdd /></Icon> <Box as="span" fontSize="sm" display={{ lgDown: "none" }}>Invite team</Box>
                        </Button>
                    </HStack>
                    <IconButton variant="ghost" size="sm" aria-label="Notifications" borderRadius="full">
                        <Icon size="lg"><MdOutlineNotifications /></Icon>
                    </IconButton>
                    <Menu.Root positioning={{ placement: "bottom-end" }} onSelect={handleMenuItemSelect}>
                        <Menu.Trigger rounded="full" focusRing="outside">
                            <Avatar.Root size="sm">
                                <Avatar.Fallback name={userName} />
                                <Avatar.Image src={undefined} />
                            </Avatar.Root>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content>
                                    <Flex p="2" direction="column">
                                        <Flex gap="4">
                                            <Box display="inline-block" pos="relative">
                                                <Avatar.Root size="md" position="relative">
                                                    <Avatar.Fallback name={userName} />
                                                    <Avatar.Image src={undefined} />
                                                </Avatar.Root>
                                                <Float placement="bottom-end" offset="1">
                                                    <Circle size="3" bg="primary" borderWidth="2px" borderColor="surface" />
                                                </Float>
                                            </Box>
                                            <Flex direction="column">
                                                <Text fontWeight="bold" fontSize="sm" lineHeight="short">{userName}</Text>
                                                <Text color="outline" fontSize="sm" lineHeight="short">{userEmail}</Text>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                    <Menu.Separator />
                                    <Menu.Item value="account" disabled><Icon size="md" color="outline"><MdPersonOutline /></Icon> View profile</Menu.Item>
                                    <Menu.Item value="support"><Icon size="md" color="outline"><MdOutlineSupport /></Icon> Support</Menu.Item>
                                    <Menu.Separator />
                                    <Menu.Item value="logout" color="error"
                                        _hover={{ bg: "bg.error", color: "error" }}><Icon size="md" color="error"><MdOutlineLogout /></Icon> Sign out</Menu.Item>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>
                </Flex>
            </Flex>
            <Dialog.Root open={isLogoutDialogOpen} onOpenChange={(details) => setIsLogoutDialogOpen(details.open)}>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Sign out</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>Are you sure you want to sign out?</Dialog.Body>
                            <Dialog.Footer>
                                <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                                <Button bgColor="error" color="onError" onClick={handleLogout}>Sign out</Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    );
}

export default memo(NavBar);
