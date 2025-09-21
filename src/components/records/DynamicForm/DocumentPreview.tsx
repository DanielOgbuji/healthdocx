import React from "react";
import { Box, Text, VStack, Heading, Separator, List, Table, Grid } from "@chakra-ui/react";
import { MdArrowRight } from "react-icons/md";
import { PATH_SEPARATOR } from "@/utils/dynamicFormUtils";

interface DocumentPreviewProps {
  formData: Record<string, unknown>;
  labels: Record<string, string>;
  institutionName?: string;
}

interface RenderSectionProps {
  data: Record<string, unknown>;
  labels: Record<string, string>;
  path: string[];
  depth: number;
}

const RenderSection: React.FC<RenderSectionProps> = ({ data, labels, path, depth }) => {
  const pathString = path.join(PATH_SEPARATOR);
  const label = labels[pathString] || path[path.length - 1];

  if (Object.keys(data).length === 0) {
    return null; // Don't render empty sections
  }

  const HeadingComponent = depth === 0 ? Heading : Text;
  const headingSize = depth === 0 ? "lg" : depth === 1 ? "md" : "sm";
  const headingWeight = depth === 0 ? "extrabold" : depth === 1 ? "bold" : "bold";
  const headingColor = depth === 0 ? "gray.800" : depth === 1 ? "black" : "gray.700";

  return (
    <Box
      mb={depth === 0 ? 10 : 6}
      w="full"
      px={depth === 0 ? 0 : depth === 1 ? 0 : 4}
    >
      {depth > 0 && <Separator />}
      <HeadingComponent
        fontSize={headingSize}
        fontWeight={headingWeight}
        mb={depth > 1 ? 4 : 0}
        color={headingColor}
        textAlign="center"
        bgColor={depth === 0 ? "transparent" : depth === 1 ? "gray.200" : "gray.100"}
        py={depth === 0 ? 0 : depth === 1 ? 2 : 2}
      >
        {label}
      </HeadingComponent>
      {depth === 1 && <Separator mb="4" />}
      <VStack align="start" gap={6}>
        {/* Render single fields in a three-column grid */}
        <Grid templateColumns="repeat(3, 1fr)" gap={4} w="full" pl={4}>
          {Object.entries(data).map(([key, value]) => {
            const currentPath = [...path, key];
            const currentPathString = currentPath.join(PATH_SEPARATOR);
            const fieldLabel = labels[currentPathString] || key;

            if (typeof value !== "object" || value === null) {
              // This is a single field
              return (
                <Box key={currentPathString} w="full">
                  <Text fontSize="xs" color="gray.700">
                    <Text as="span" fontSize="sm" fontWeight="bold" color="gray.800" textDecoration="underline" textDecorationStyle="solid" textDecorationThickness="from-font" textUnderlineOffset="2px">{fieldLabel}</Text> <br /> {String(value)}
                  </Text>
                </Box>
              );
            }
            return null;
          })}
        </Grid>

        {/* Separate sections, lists, and tables from single fields */}
        {Object.entries(data).map(([key, value]) => {
          const currentPath = [...path, key];
          const currentPathString = currentPath.join(PATH_SEPARATOR);
          const fieldLabel = labels[currentPathString] || key;

          if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            // Nested Section
            return (
              <RenderSection
                key={currentPathString}
                data={value as Record<string, unknown>}
                labels={labels}
                path={currentPath}
                depth={depth + 1}
              />
            );
          } else if (Array.isArray(value)) {
            // List or Table
            const isTable = value.length > 0 && typeof value[0] === 'object' && value[0] !== null;

            if (isTable) {
              // Table
              const tableData = value as Array<Record<string, string>>;
              const columnHeaders = tableData.length > 0 ? Object.keys(tableData[0]) : [];
              return (
                <Box key={currentPathString} w="full">
                  <Text as="span" fontWeight="bold" fontSize="md" color="gray.800" p={2} display="block" border="1px solid" borderBottom="none" bgColor="gray.200" textAlign="center">{fieldLabel}</Text>
                  {tableData.length > 0 ? (
                    <Table.Root size="sm" mt="0" border="1px solid" showColumnBorder>
                      <Table.Header>
                        <Table.Row>
                          {columnHeaders.map((header) => (
                            <Table.ColumnHeader key={header} bg="gray.100" color="gray.700" fontWeight="bold">{header}</Table.ColumnHeader>
                          ))}
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {tableData.map((row, rowIndex) => (
                          <Table.Row key={rowIndex}>
                            {columnHeaders.map((header) => (
                              <Table.Cell bgColor="white" key={`${rowIndex}-${header}`} fontSize="xs" color="gray.700">{row[header]}</Table.Cell>
                            ))}
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  ) : (
                    <Text fontSize="sm" color="gray.500">No data in table.</Text>
                  )}
                </Box>
              );
            } else {
              // List
              const listData = value as string[];
              return (
                <Box key={currentPathString} w="full">
                  <Text as="span" fontWeight="bold" fontSize="md" color="gray.800" mb={2} pl="2" pb="1" pt="1" display="block" borderStyle="solid" borderColor="gray.200" borderBottom="1px solid" bgColor="gray.200">{fieldLabel}</Text>
                  {listData.length > 0 ? (
                    <List.Root pl="1" mt="4" gap="2" variant="plain" align="center">
                      {listData.map((item, index) => (
                        <List.Item key={index} fontSize="sm" color="gray.700">
                          <List.Indicator asChild color="gray.500" scale="1.4">
                            <MdArrowRight />
                          </List.Indicator>
                          {item}
                        </List.Item>
                      ))}
                    </List.Root>
                  ) : (
                    <Text fontSize="sm" color="gray.500">No items in list.</Text>
                  )}
                </Box>
              );
            }
          }
          return null; // Don't render single fields here yet
        })}


      </VStack>
    </Box>
  );
};

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ formData, labels, institutionName }) => {
  return (
    <Box
      p={{ base: 6, md: 10 }}
      bg="white"
      color="black"
      minH="full"
      w="full"
      maxW="8.5in" // Standard letter size width
      minW="8.5in"
      mx="auto"
      shadow="xl"
      borderRadius="lg"
      fontFamily="body" // Use Chakra's default body font
      lineHeight="base"
      border="1px solid"
      borderColor="gray.100"
    >
      {institutionName && (
        <Box mb="8" pb="4" pl="2" borderColor="gray.400" borderBottom="1px solid">
          <Heading size="4xl" fontWeight="black" w="75%" color="gray.800" lineHeight="shorter">
            {institutionName}
          </Heading>
        </Box>
      )}
      <RenderSection data={formData} labels={labels} path={[]} depth={0} />
      <Text textAlign="right" fontSize="2xs" color="gray.500" mb="-4">This is a computer generated record. No signature is necessary.</Text>
    </Box>
  );
};

export default DocumentPreview;
