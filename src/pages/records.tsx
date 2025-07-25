"use client";

import {
  Heading,
  Stack,
  Table,
  IconButton,
  ButtonGroup,
  Pagination,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useEffect, useState } from "react";
import { getPatientRecords } from "@/api/patient-records";

interface PatientRecord {
  id: string;
  recordTypeGroup: string;
  recordType: string;
  uploadedAt: string;
  status: string;
}

const Records = () => {
  const [records, setRecords] = useState<PatientRecord[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getPatientRecords();
        setRecords(data);
      } catch (error) {
        console.error("Error fetching patient records:", error);
      }
    };

    fetchRecords();
  }, []);

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = records.slice(startIndex, endIndex);

  return (
    <Stack width="full" gap="5" alignItems="center" p={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }} pb={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }}>
      <Heading size="xl">Patient Records</Heading>
      <Table.Root size="sm" variant="outline" striped>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Record Group/Type</Table.ColumnHeader>
            <Table.ColumnHeader>Date Created/Time</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentRecords.map((record) => (
            <Table.Row key={record.id}>
              <Table.Cell>{record.id}</Table.Cell>
              <Table.Cell>
                {record.recordTypeGroup}/{record.recordType}
              </Table.Cell>
              <Table.Cell>{record.uploadedAt}</Table.Cell>
              <Table.Cell>{record.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Pagination.Root
        count={records.length}
        pageSize={itemsPerPage}
        page={currentPage}
        onPageChange={(details) => setCurrentPage(details.page as number)}
      >
        <ButtonGroup variant="ghost" size="sm" wrap="wrap">
          <Pagination.PrevTrigger asChild>
            <IconButton aria-label="Previous page">
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

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

          <Pagination.NextTrigger asChild>
            <IconButton aria-label="Next page">
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Stack>
  );
};

export default Records;
