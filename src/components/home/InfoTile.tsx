import { useState, useEffect } from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { getByUser as getInstitutionsByUser } from "@/api/institution";
import { useSelector } from 'react-redux';
import { type RootState } from "@/store/store";
import InstitutionInfo from "./InstitutionInfo";
import OptionsMenu from "./OptionsMenu";
import UploadButton from "./UploadButton";
import UploadDialog from "./UploadDialog";
import useFileUpload from "@/hooks/useFileUpload";

interface Institution {
    id: number;
    institutionName: string;
}

const InfoTile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const {
        open,
        setOpen,
        uploadProgress,
        uploadStatus,
        errorMessage,
        fileSize,
        fileName,
        fileType,
        filePreview,
        handleFileChange,
        handleCloseDialog,
        handleRetry,
    } = useFileUpload();

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
                        console.log("Fetching institutions from API due to local storage error", data);
                        setInstitutions(data);
                        localStorage.setItem(localStorageKey, JSON.stringify(data));
                        console.log("Institutions fetched from API and saved to local storage");
                    }
                } else {
                    const data = await getInstitutionsByUser(userId);
                    console.log("Fetching institutions from API as local storage is empty", data);
                    setInstitutions(data);
                    localStorage.setItem(localStorageKey, JSON.stringify(data));
                    console.log("Institutions fetched from API and saved to local storage");
                }
            }
        };

        fetchInstitutions();
    }, [userId]);

    return (
        <>
            <Flex w="full" justifyContent="space-between" direction={{ base: "row", lgDown: "column" }} gap="4">
                <Flex w="full">
                    <Flex gap="4" justifyContent="flex-start" alignItems="start">
                        <InstitutionInfo institution={institutions[0]} loading={institutions.length === 0} />
                    </Flex>
                    <OptionsMenu isOpen={isOpen} setIsOpen={setIsOpen} />
                </Flex>
                <Flex gap="4" alignSelf="flex-start" width={{ base: "fit-content", lgDown: "full" }} colorPalette="brand">
                    <Button variant="outline" size="sm" flex={{ base: "none", lgDown: "1" }} disabled>
                        <IoMdAdd /> <Box as="span" fontSize="sm">Create record</Box>
                    </Button>
                    <UploadButton handleFileChange={handleFileChange} />
                </Flex>
            </Flex>
            <UploadDialog
                open={open}
                setOpen={setOpen}
                uploadStatus={uploadStatus}
                errorMessage={errorMessage}
                fileSize={fileSize}
                fileName={fileName}
                fileType={fileType}
                filePreview={filePreview}
                uploadProgress={uploadProgress}
                onClose={handleCloseDialog}
                onRetry={handleRetry}
            />
        </>
    );
}

export default InfoTile;
