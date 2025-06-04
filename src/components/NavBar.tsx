import { memo } from "react";
import { Button, Box, Flex, Image, Separator, Text, HStack, IconButton, Icon, Avatar } from "@chakra-ui/react";
import { MdOutlineNotifications, MdAdd } from "react-icons/md";
import { RxLightningBolt } from "react-icons/rx";
import NavList from "@/components/NavList";
import Logo from "@/assets/images/Off-Jeay.svg";
import LogoDark from "@/assets/images/Off-Jeay-Dark.svg";
import { useColorMode } from "@/components/ui/color-mode";

const NavBar = () => {
    const { colorMode } = useColorMode();

    return (
        <Flex
            position="fixed"
            bgColor="currentBg"
            width="full"
            px={{ xl: "6vw", lg: "6vw", md: "6vw", sm:"6vw", base: "4" }}
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
                    <Button variant="outline" size="sm" p={{ xlDown: "0" }} >
                        <RxLightningBolt /> <Box as="span" fontSize="sm" display={{ xlDown: "none" }}>Upgrade now</Box>
                    </Button>
                    <Button variant="solid" size="sm" p={{ lgDown: "0" }}>
                        <Icon size="md"><MdAdd /></Icon> <Box as="span" fontSize="sm" display={{ lgDown: "none" }}>Invite team</Box>
                    </Button>
                </HStack>
                <IconButton variant="ghost" size="sm" aria-label="Notifications" borderRadius="full">
                    <Icon size="lg"><MdOutlineNotifications /></Icon>
                </IconButton>
                <Avatar.Root size="sm">
                    <Avatar.Fallback name="Peace Amarachi" />
                    <Avatar.Image src="#" />
                </Avatar.Root>
            </Flex>
        </Flex>
    );
}

export default memo(NavBar);