import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { Flex, Spinner, Text, Stack, VStack, Box, Icon, Button } from "@chakra-ui/react";
import { FiAlertTriangle } from "react-icons/fi"
import { RxReload } from "react-icons/rx"
import DynamicForm from "@/components/records/DynamicForm";
import { getPatientRecordByID } from "@/api/patient-records";
import { getByUser as getInstitutionsByUser } from "@/api/institution";
import { toaster } from "@/components/ui/toaster";
import { type ApiError } from "@/types/api.types";
import { useSelector } from 'react-redux';
import { type RootState } from "@/store/store";

const RecordDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [structuredData, setStructuredData] = useState<string | null>(null);
    const [ocrText, setOcrText] = useState<string | null>(null);
    const [rawFileUrl, setRawFileUrl] = useState<string | null>(null);
    const [recordCode, setRecordCode] = useState<string | undefined>(undefined);
    const [institutionName, setInstitutionName] = useState<string | undefined>(undefined);
    const [recordTypeGroup, setRecordTypeGroup] = useState<string | undefined>(undefined);
    const [recordType, setRecordType] = useState<string | undefined>(undefined);

    const userId = useSelector((state: RootState) => state.auth.user?.id);

    const fetchRecord = useCallback(async (force = false) => {
        setLoading(true);
        if (!id) {
            setError("No record ID provided.");
            setLoading(false);
            return;
        }

        try {
            // Always fetch from API to get the up-to-date recordCode and other metadata
            const response = await getPatientRecordByID(id);
            const data = response.data.structuredData;
            const extractedOcrText = response.data.ocrText;
            const imageUrl = response.rawFileUrl || '';
            const recordCodeFromResponse = response.recordCode; // Only use actual recordCode from response
            console.log("image link", imageUrl);

            // Check for auto-saved data (but use API data if force is true)
            const autoSavedData = sessionStorage.getItem(`autosave_form_${id}`);
            const autoSavedOcrText = sessionStorage.getItem(`autosave_ocr_text_${id}`);

            const finalStructuredData = (!force && autoSavedData) ? autoSavedData : data;
            const finalOcrText = (!force && autoSavedOcrText) ? autoSavedOcrText : extractedOcrText;

            setStructuredData(finalStructuredData);
            setOcrText(finalOcrText);
            setRawFileUrl(imageUrl);
            setRecordCode(recordCodeFromResponse);
            setRecordTypeGroup(response.recordTypeGroup);
            setRecordType(response.recordType);

            if (force) {
                // When forcing a refresh, update the original data in sessionStorage
                sessionStorage.setItem(`original_record_${id}`, data);
                sessionStorage.setItem(`original_ocr_text_${id}`, extractedOcrText);
            }

            setError(null);
            toaster.create({
                title: "Record extracted successfully",
                description: "You can now edit your record.",
                type: "success",
                duration: 3000,
            });
        } catch (err) {
            const error = err as ApiError;
            const errorMessage = error.response?.data?.error || "An unexpected error occurred.";
            setError("Failed to fetch record details. Please try again later.");
            toaster.create({
                title: "Failed to load record",
                description: errorMessage,
                type: "error",
                duration: 3000,
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchRecord();
    }, [fetchRecord]);

    useEffect(() => {
        const fetchInstitutionName = async () => {
            if (!userId) {
                setInstitutionName(undefined);
                return;
            }

            const localStorageKey = `institutions-${userId}`;
            const storedInstitutions = localStorage.getItem(localStorageKey);

            if (storedInstitutions) {
                try {
                    const parsedInstitutions = JSON.parse(storedInstitutions);
                    if (parsedInstitutions && parsedInstitutions.length > 0) {
                        setInstitutionName(parsedInstitutions[0].institutionName);
                    }
                } catch (error) {
                    console.error("Error parsing institutions from local storage:", error);
                }
            } else {
                try {
                    const data = await getInstitutionsByUser(userId);
                    if (data && data.length > 0) {
                        setInstitutionName(data[0].institutionName);
                        localStorage.setItem(localStorageKey, JSON.stringify(data));
                    }
                } catch (error) {
                    console.error("Error fetching institutions from API:", error);
                }
            }
        };

        fetchInstitutionName();
    }, [userId]);

    const handleRevert = () => {
        if (id) {
            sessionStorage.removeItem(`autosave_form_${id}`);
            sessionStorage.removeItem(`autosave_labels_${id}`);
            sessionStorage.removeItem(`autosave_ocr_text_${id}`);
            fetchRecord(true);
        }
    };

    if (loading) {
        return (
            <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center">
                <VStack>
                    <Spinner borderWidth="4px" color="primary" size="xl" />
                    <Text color="primary" textAlign="center">Loading Record<br />({id})...</Text>
                </VStack>
            </Stack>
        );
    }

    if (error) {
        return (
            <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center">
                <Flex justifyContent="center" alignItems="center" direction="column" gap="6" w="full">
                    <Flex p="2" bgColor="bg.warning" rounded="md" borderColor="fg.warning" borderWidth="1px">
                        <Icon as={FiAlertTriangle} size="2xl" color="fg.warning" m="2" />
                    </Flex>
                    <Flex direction="column" justifyContent="center" alignItems="center" gap="3" px={{ mdDown: "8" }}>
                        <Text fontWeight="bold" fontSize="lg" textAlign="center" lineHeight="moderate">Something went wrong...</Text>
                        <Text color="outline" textWrap="pretty" textAlign="center">{error}</Text>
                    </Flex>
                    <Flex gap="4" justifyContent="center" width="full" colorPalette="brand" direction={{ base: "row", mdDown: "column" }} px={{ mdDown: "8" }}>
                        <Button variant="outline" size="sm">
                            <Box as="span" fontSize="sm">Contact Support</Box>
                        </Button>
                        <Button variant="solid" size="sm" onClick={() => fetchRecord()}>
                            <RxReload /> <Box as="span" fontSize="sm">Retry</Box>
                        </Button>
                    </Flex>
                </Flex>
            </Stack>
        );
    }

    return (
        <Flex w="full"
            //mt="72px"
            direction="column"
            //p={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }}
        >
            {structuredData && <DynamicForm structuredData={structuredData} recordId={id} recordCode={recordCode} ocrText={ocrText} onRevert={handleRevert} rawFileUrl={rawFileUrl} institutionName={institutionName} recordTypeGroup={recordTypeGroup} recordType={recordType} />}
        </Flex>
    );
};

export default RecordDetails;
