import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { Flex, Spinner, Text, Stack, VStack, Box, Icon, Button } from "@chakra-ui/react";
import { FiAlertTriangle } from "react-icons/fi"
import { RxReload } from "react-icons/rx"
import DynamicForm from "@/components/records/DynamicForm";
import { getPatientRecordByID } from "@/api/patient-records";
import { toaster } from "@/components/ui/toaster";
import { type ApiError } from "@/types/api.types";

const RecordDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [structuredData, setStructuredData] = useState<string | null>(null);

    const fetchRecord = useCallback(async (force = false) => {
        setLoading(true);
        if (!id) {
            setError("No record ID provided.");
            setLoading(false);
            return;
        }

        const autoSavedData = localStorage.getItem(`autosave_form_${id}`);
        if (autoSavedData && !force) {
            setStructuredData(autoSavedData);
            setLoading(false);
            return;
        }

        try {
            const response = await getPatientRecordByID(id);
            const data = response.data.structuredData;
            setStructuredData(data);
            localStorage.setItem(`original_record_${id}`, data);
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

    const handleRevert = () => {
        if (id) {
            localStorage.removeItem(`autosave_form_${id}`);
            localStorage.removeItem(`autosave_labels_${id}`);
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
        <Flex w="full" mt="72px" direction="column" p={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }} pb={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }}>
            {structuredData && <DynamicForm structuredData={structuredData} recordId={id} onRevert={handleRevert} />}
        </Flex>
    );
};

export default RecordDetails;
