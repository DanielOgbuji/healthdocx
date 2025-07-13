import React from "react";
import { Box, Grid, GridItem, Flex, Heading, IconButton } from "@chakra-ui/react";
import EditableLabel from "./EditableLabel";
import SingleField from "./SingleField";
import { MdAdd, MdTextFields, MdDeleteOutline } from "react-icons/md";

interface FormFieldProps {
  depth?: number;
  data: Record<string, unknown>;
  path: string[];
  onFieldChange: (path: string[], value: string) => void;
  labels: Record<string, string>;
  onLabelChange: (path: string, label: string) => void;
  onAddSection: (path: string[]) => void;
  onAddField: (path: string[]) => void;
  onRemoveFieldOrSection: (path: string[]) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  depth = 0,
  data,
  path,
  onFieldChange,
  labels,
  onLabelChange,
  onAddSection,
  onAddField,
  onRemoveFieldOrSection,
}) => {
  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
      {Object.entries(data).map(([key, value]) => {
        const currentPath = [...path, key];
        const pathString = currentPath.join(".");

        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value) &&
          Object.prototype.toString.call(value) === "[object Object]"
        ) {
          return (
            <GridItem
              key={pathString}
              colSpan={{ base: 1, md: 2 }}
              colorPalette="brand"
            >
              <Box borderColor="gray.200" borderRadius="md" pb={0}>
                <Flex
                  bg={{
                    _light: depth === 0 ? "primaryContainer/10" : "primaryContainer/5",
                    _dark: depth === 0 ? "outlineVariant/20" : "outlineVariant/10"
                  }}
                  borderWidth={depth === 0 ? "1px" : "0 0 1px 0"}
                  borderColor="gray.200"
                  borderRadius={depth === 0 ? "md" : "none"}
                  p={4}
                  mt={depth === 0 ? 0 : 2}
                  alignItems="center"
                  mb="4"
                  //p="2"
                  px="4"
                  gap="4"
                  justifyContent="space-between"
                >
                  <Heading size="lg" fontWeight="bold">
                    <EditableLabel
                      initialValue={labels[pathString] || key}
                      onSave={(newLabel) => onLabelChange(pathString, newLabel)}
                    />
                  </Heading>
                  <Flex gap={2}>
                    <IconButton
                      aria-label="Add Section"
                      size="xs"
                      onClick={() => onAddSection(currentPath)}
                      variant="outline"
                    >
                      <MdAdd />
                    </IconButton>
                    <IconButton
                      aria-label="Add Field"
                      size="xs"
                      onClick={() => onAddField(currentPath)}
                      variant="outline"
                    >
                      <MdTextFields />
                    </IconButton>
                    <IconButton
                      aria-label="Delete Section"
                      size="xs"
                      onClick={() => onRemoveFieldOrSection(currentPath)}
                      colorPalette="red"
                      variant="surface"
                    >
                      <MdDeleteOutline />
                    </IconButton>
                  </Flex>
                </Flex>
                <FormField
                  depth={depth + 1}
                  data={value as Record<string, unknown>}
                  path={currentPath}
                  onFieldChange={onFieldChange}
                  labels={labels}
                  onLabelChange={onLabelChange}
                  onAddSection={onAddSection}
                  onAddField={onAddField}
                  onRemoveFieldOrSection={onRemoveFieldOrSection}
                />
              </Box>
            </GridItem>
          );
        }

        return (
          <SingleField
            key={pathString}
            fieldKey={key}
            value={value}
            currentPath={currentPath}
            pathString={pathString}
            onFieldChange={onFieldChange}
            labels={labels}
            onLabelChange={onLabelChange}
            onRemoveFieldOrSection={onRemoveFieldOrSection}
          />
        );
      })}
    </Grid>
  );
};

export default FormField;