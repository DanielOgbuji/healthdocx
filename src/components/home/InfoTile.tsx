import { useState, useEffect } from "react";
import { Box, Flex, Heading, Text, Button, Menu, Portal, Icon, IconButton, Skeleton } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { NavLink } from "react-router";
import { FiChevronDown, FiChevronUp, FiCamera, FiUploadCloud } from "react-icons/fi";
import { GrScan } from "react-icons/gr";
import { LuScanText } from "react-icons/lu";
import { getByUser as getInstitutionsByUser } from "@/api/institution";
import { useSelector } from 'react-redux';
import { type RootState } from "@/store/store";

interface Institution {
    id: number;
    institutionName: string;
    // add others if you need
}

const InfoTile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const userId = useSelector((state: RootState) => state.auth.user?.id);

    const [institutions, setInstitutions] = useState<Institution[]>([]);

    useEffect(() => {
        const fetchInstitutions = async () => {
            if (userId) {
                const localStorageKey = `institutions-${userId}`;
                const storedInstitutions = localStorage.getItem(localStorageKey);

                if (storedInstitutions) {
                    try {
                        const parsedInstitutions = JSON.parse(storedInstitutions) as Institution[];
                        setInstitutions(parsedInstitutions);
                        console.log("Institutions loaded from local storage");
                    } catch (error) {
                        console.error("Error parsing institutions from local storage:", error);
                        // If parsing fails, fetch from API and overwrite local storage
                        const data = await getInstitutionsByUser(userId);
                        setInstitutions(data);
                        localStorage.setItem(localStorageKey, JSON.stringify(data));
                        console.log("Institutions fetched from API and saved to local storage");
                    }
                } else {
                    const data = await getInstitutionsByUser(userId);
                    setInstitutions(data);
                    localStorage.setItem(localStorageKey, JSON.stringify(data));
                    console.log("Institutions fetched from API and saved to local storage");
                }
            }
        };

        fetchInstitutions();
    }, [userId]);

    return (
        <Flex w="full" justifyContent="space-between" direction={{ base: "row", lgDown: "column" }} gap="4">
            <Flex w="full">
                <Flex gap="4" justifyContent="flex-start" alignItems="start">
                    <Flex direction="column" gap="1" pr={{ base: "12", smDown: "4" }}>
                        <Skeleton loading={!institutions[0]?.institutionName}>
                            <Heading size="3xl" textWrap="pretty">
                                {institutions[0]?.institutionName}
                            </Heading>
                        </Skeleton>
                        <Skeleton loading={!institutions[0]?.id}>
                            <Text color="outline">Hospital ID: {institutions[0]?.id}</Text>
                        </Skeleton>
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
                            <Menu.Content borderWidth="1px" borderColor="primary/20">
                                <Menu.Item value="new-txt" asChild _hover={{ bgColor: "brand.subtle" }} color="brand.fg">
                                    <NavLink to="/" end>
                                        <FiCamera />
                                        Camera
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item value="new-file" asChild _hover={{ bgColor: "brand.subtle" }} color="brand.fg">
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
