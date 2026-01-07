import { useState, memo } from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { getByUser as getInstitutionsByUser } from "@/api/institution";
import { useSelector } from 'react-redux';
import { type RootState } from "@/store/store";
import InstitutionInfo from "./InstitutionInfo";
import OptionsMenu from "./OptionsMenu";
import UploadButton from "./UploadButton";
import { useQuery } from "@tanstack/react-query";
import { StorageKeys } from "@/constants/upload";
import { type FileChangeDetails } from "@zag-js/file-upload";

interface InfoTileProps {
    openCamera: () => void;
    handleFileChange: (details: FileChangeDetails) => Promise<void>;
}

const InfoTile = ({ openCamera, handleFileChange }: InfoTileProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const userId = useSelector((state: RootState) => state.auth.user?.id);

    const { data: institutions = [], isLoading } = useQuery({
        queryKey: [StorageKeys.InstitutionsPrefix, userId],
        queryFn: async () => {
            if (!userId) return [];
            const data = await getInstitutionsByUser(userId);
            return data;
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    return (
        <>
            <Flex w="full" justifyContent="space-between" direction={{ base: "row", lgDown: "column" }} gap="4">
                <Flex w="full">
                    <Flex gap="4" justifyContent="flex-start" alignItems="start">
                        <InstitutionInfo institution={institutions[0]} loading={isLoading} /> {/* Use new isLoading state */}
                    </Flex>
                    <OptionsMenu isOpen={isOpen} setIsOpen={setIsOpen} openCamera={openCamera} />
                </Flex>
                <Flex gap="4" alignSelf="flex-start" width={{ base: "fit-content", lgDown: "full" }} colorPalette="brand">
                    <Button variant="outline" size="sm" flex={{ base: "none", lgDown: "1" }} disabled>
                        <IoMdAdd /> <Box as="span" fontSize="sm">Create record</Box>
                    </Button>
                    <UploadButton handleFileChange={handleFileChange} />
                </Flex>
            </Flex>
        </>
    );
}

export default memo(InfoTile);
