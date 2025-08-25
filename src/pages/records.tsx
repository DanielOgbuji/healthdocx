"use client";

import { formatDate, formatTime } from "@/utils/date";
import {
  Text,
  Stack,
  Table,
  IconButton,
  ButtonGroup,
  Pagination,
  Spinner,
  VStack,
  Status,
  EmptyState,
  Flex,
  Box,
  Icon,
  Image,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useEffect, useState, useCallback } from "react";
import { getPatientRecords } from "@/api/patient-records";
import { useNavigate } from "react-router";
import noRecord from "@/assets/images/norecord.svg";
import noRecordDark from "@/assets/images/norecord-dark.svg";
import { useColorMode } from "@/components/ui/color-mode";
import { IoMdAdd } from "react-icons/io";
import { FiAlertTriangle } from "react-icons/fi";
import { RxReload } from "react-icons/rx";
import UploadButton from "@/components/home/UploadButton";
import UploadDialog from "@/components/home/UploadDialog";
import useFileUpload from "@/hooks/useFileUpload";
import InfoTile from "@/components/home/InfoTile";
import { useCamera } from "@/hooks/useCamera";
import { CameraDialog } from "@/components/home/CameraDialog";

// Caching mechanism implemented for patient records
interface PatientRecord {
  id: string;
  recordTypeGroup: string;
  recordType: string;
  uploadedAt: string;
  status: string;
}

const Records = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selection, setSelection] = useState<string[]>([]);

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
    croppedImage,
    handleFileChange,
    handleCloseDialog,
    handleRetry,
    handleConfirmCrop,
    handleCancelCrop,
  } = useFileUpload();

  const {
    isCameraOpen,
    openCamera,
    closeCamera,
    devices,
    isSearching: isCameraSearching,
    stream,
    selectedDevice,
    selectDevice,
    captureImage,
    error: cameraError,
  } = useCamera(handleFileChange);

  const RECORDS_STORAGE_KEY = "healthdocx_patient_records";

  const fetchRecords = useCallback(async (signal: AbortSignal, isBackgroundFetch: boolean = false) => {
    if (!isBackgroundFetch) {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await getPatientRecords({ signal });
      const sortedData = data.sort((a: PatientRecord, b: PatientRecord) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

      const storedRecords = localStorage.getItem(RECORDS_STORAGE_KEY);
      const parsedStoredRecords: PatientRecord[] = storedRecords ? JSON.parse(storedRecords) : [];
      const sortedStoredRecords = parsedStoredRecords.sort((a: PatientRecord, b: PatientRecord) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

      if (JSON.stringify(sortedData) !== JSON.stringify(sortedStoredRecords)) {
        setRecords(sortedData);
        localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(sortedData));
      } else if (!isBackgroundFetch && sortedStoredRecords.length > 0) {
        // If it's not a background fetch and data hasn't changed, but we have stored records, use them
        setRecords(sortedStoredRecords);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }
      console.error("Error fetching patient records:", err);
      if (!isBackgroundFetch) {
        setError("Failed to fetch patient records.");
      }
    } finally {
      if (!isBackgroundFetch) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const loadAndFetch = async () => {
      const storedRecords = localStorage.getItem(RECORDS_STORAGE_KEY);
      if (storedRecords) {
        try {
          const parsedStoredRecords: PatientRecord[] = JSON.parse(storedRecords);
          const sortedStoredRecords = parsedStoredRecords.sort((a: PatientRecord, b: PatientRecord) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
          setRecords(sortedStoredRecords);
          setLoading(false);
        } catch (e) {
          console.error("Failed to parse stored records, fetching new data.", e);
          localStorage.removeItem(RECORDS_STORAGE_KEY); // Clear corrupted data
          await fetchRecords(signal);
        }
      } else {
        await fetchRecords(signal);
      }

      // Always run a background fetch to check for updates
      fetchRecords(signal, true);
    };

    loadAndFetch();

    return () => {
      controller.abort();
    };
  }, [fetchRecords]);

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = records.slice(startIndex, endIndex);

  const indeterminate = selection.length > 0 && selection.length < currentRecords.length;

  return (
    <>
      {loading ? (
        <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center">
          <VStack>
            <Spinner borderWidth="4px" color="primary" size="xl" />
            <Text color="primary">Loading records...</Text>
          </VStack>
        </Stack>
      ) : error ? (
        <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center" mt="12">
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
              <Button variant="solid" size="sm" onClick={() => fetchRecords(new AbortController().signal)}>
                <RxReload /> <Box as="span" fontSize="sm">Retry</Box>
              </Button>
            </Flex>
          </Flex>
        </Stack>
      ) : records.length === 0 ? (
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <Image src={colorMode === "dark" ? noRecordDark : noRecord} />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>No Recent Records</EmptyState.Title>
              <EmptyState.Description
                w={{ base: "full", lg: "75%" }}
                textWrap="balance"
                color="outline"
              >
                We've checked! There are no recent records to review. Once AI
                processes new records, you'll find them here for verification.
              </EmptyState.Description>
            </VStack>
            <ButtonGroup gap="4" colorPalette="brand">
              <Button variant="outline" size="sm" disabled>
                <IoMdAdd /> <Box as="span" fontSize="sm">Create record</Box>
              </Button>
              <UploadButton handleFileChange={handleFileChange} />
            </ButtonGroup>
          </EmptyState.Content>

        </EmptyState.Root>
      ) : (
        <Stack width="full" alignItems="center" px={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }} pb={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }} mt="120px" gap="0">
          <InfoTile openCamera={openCamera} />
          <Table.ScrollArea borderWidth="1px" w="full" borderTopRadius="md" colorPalette="brand" mt="8">
            <Flex w="full" p="4" pt="3">
              <Flex direction="column" gap="1">
                <Flex textStyle="md" fontWeight="semibold" gap="2" alignItems="center">
                  Your Records
                  <Flex fontSize="x-small" px="2" py="1" rounded="full" lineHeight="short" bgColor="surface" color="primary">{records.length} records</Flex>
                </Flex>
                <Flex textStyle="xs" color="fg.muted/80">Keep track of every record extracted, unextracted & created.</Flex>
              </Flex>
              <Flex></Flex>
            </Flex>
            <Table.Root size="sm" variant="outline" interactive>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader w="6">
                    <Checkbox.Root
                      pl="2"
                      size="sm"
                      mt="0.5"
                      aria-label="Select all rows"
                      checked={indeterminate ? "indeterminate" : selection.length > 0}
                      onCheckedChange={(changes) => {
                        setSelection(
                          changes.checked ? currentRecords.map((record) => record.id) : [],
                        )
                      }}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                  </Table.ColumnHeader>
                  <Table.ColumnHeader><Text fontSize="sm">Name/ID</Text></Table.ColumnHeader>
                  <Table.ColumnHeader><Text fontSize="sm">Group/Type</Text></Table.ColumnHeader>
                  <Table.ColumnHeader><Text fontSize="sm">Created</Text></Table.ColumnHeader>
                  <Table.ColumnHeader><Text fontSize="sm">Origin</Text></Table.ColumnHeader>
                  <Table.ColumnHeader><Text fontSize="sm">Status</Text></Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {currentRecords.map((record) => (
                  <Table.Row
                    key={record.id}
                    data-selected={selection.includes(record.id) ? "" : undefined}
                  >
                    <Table.Cell>
                      <Checkbox.Root
                        size="sm"
                        pl="2"
                        mt="0.5"
                        aria-label="Select row"
                        checked={selection.includes(record.id)}
                        onCheckedChange={(changes) => {
                          setSelection((prev) =>
                            changes.checked
                              ? [...prev, record.id]
                              : selection.filter((id) => id !== record.id),
                          )
                        }}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                      </Checkbox.Root>
                    </Table.Cell>
                    <Table.Cell onClick={() => navigate(`/records/details/${record.id}`)}><Text truncate lineClamp="2" fontWeight="semibold" cursor="pointer">{record.id}</Text></Table.Cell>
                    <Table.Cell>
                      <Text textTransform="capitalize" fontWeight="semibold">
                        {record.recordTypeGroup}
                      </Text>
                      <Text textTransform="capitalize" color="fg.muted/80">
                        {record.recordType}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontWeight="semibold">{formatDate(record.uploadedAt)}</Text>
                      <Text color="fg.muted/80">{formatTime(record.uploadedAt)}</Text>
                    </Table.Cell>
                    <Table.Cell>Extracted</Table.Cell>
                    <Table.Cell textTransform="capitalize">
                      <Status.Root size="sm" color="fg.warning" fontWeight="medium" rounded="full" bgColor="bg.warning" px="2" py="1">
                        <Status.Indicator boxSize="1.5" bg="border.warning" />
                        {record.status}
                      </Status.Root>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>

          <Pagination.Root
            display="flex"
            justifyContent="center"
            count={records.length}
            pageSize={itemsPerPage}
            page={currentPage}
            onPageChange={(details) => setCurrentPage(details.page as number)}
            colorPalette="brand"
            borderWidth="1px"
            borderTop="none"
            borderBottomRadius="md"
            p="4"
            w="full"
          >
            <ButtonGroup display="flex" w="full" variant="outline" size="sm" wrap="wrap" justifyContent="space-between">
              <Pagination.PrevTrigger asChild>
                <Button aria-label="Previous page">
                  <LuChevronLeft />
                  Previous
                </Button>
              </Pagination.PrevTrigger>

              <Flex gap="2">
                <Pagination.Items
                  render={(page) => (
                    <IconButton
                      variant={page.value === currentPage ? "outline" : "ghost"}
                      aria-label={`Page ${page.value}`}
                    >
                      {page.value}
                    </IconButton>
                  )}
                />
              </Flex>

              <Pagination.NextTrigger asChild>
                <Button aria-label="Next page">
                  Next
                  <LuChevronRight />
                </Button>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </Stack>
      )}
      <UploadDialog
        open={open}
        setOpen={setOpen}
        uploadStatus={uploadStatus}
        errorMessage={errorMessage}
        fileSize={fileSize}
        fileName={fileName}
        fileType={fileType}
        filePreview={filePreview}
        croppedImage={croppedImage}
        uploadProgress={uploadProgress}
        onClose={handleCloseDialog}
        onRetry={handleRetry}
        handleConfirmCrop={handleConfirmCrop}
        handleCancelCrop={handleCancelCrop}
      />
      <CameraDialog
        isCameraOpen={isCameraOpen}
        closeCamera={closeCamera}
        devices={devices}
        isSearching={isCameraSearching}
        stream={stream}
        selectedDevice={selectedDevice}
        selectDevice={selectDevice}
        captureImage={captureImage}
        error={cameraError}
      />
    </>
  );
};

export default Records;
