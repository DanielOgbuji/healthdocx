import { Menu, Portal, Icon, IconButton } from "@chakra-ui/react";
import { NavLink } from "react-router";
import { FiChevronDown, FiChevronUp, FiCamera, } from "react-icons/fi";
import { GrScan } from "react-icons/gr";
import { LuScanText } from "react-icons/lu";
import { MdOutlinePhonelink } from "react-icons/md";

interface OptionsMenuProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    openCamera: () => void;
}

const OptionsMenu = ({ isOpen, setIsOpen, openCamera }: OptionsMenuProps) => {
    return (
        <Menu.Root onOpenChange={(details: { open: boolean }) => setIsOpen(details.open)}>
            <Menu.Trigger asChild colorPalette="brand">
                <IconButton variant="ghost" size="sm" px="2" ml="auto" focusRing="none">
                    <Icon size="md"><LuScanText /></Icon>
                    <Icon as={isOpen ? FiChevronUp : FiChevronDown} size="md" />
                </IconButton>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content borderWidth="1px" borderColor="primary/20">
                        <Menu.Item value="camera" _hover={{ bgColor: "brand.subtle" }} color="brand.fg" onClick={openCamera}>
                            <FiCamera />
                            Camera
                        </Menu.Item>
                        <Menu.Item value="scanner" asChild _hover={{ bgColor: "brand.subtle" }} color="brand.fg">
                            <NavLink to="/scanner" end>
                                <GrScan />
                                Scanner
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item value="phone" asChild _hover={{ bgColor: "brand.subtle" }} color="brand.fg">
                            <NavLink to="/link-phone" end>
                                <MdOutlinePhonelink />
                                Phone Link
                            </NavLink>
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

export default OptionsMenu;
