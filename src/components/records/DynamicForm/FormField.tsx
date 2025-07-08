import React from "react";
import { Box, Grid, GridItem, Flex, Heading } from "@chakra-ui/react";
import EditableLabel from "./EditableLabel";
import SingleField from "./SingleField";
import { formatLabel } from "@/utils/dynamicFormUtils";

interface FormFieldProps {
  data: Record<string, unknown>;
  path: string[];
  onFieldChange: (path: string[], value: string) => void;
  labels: Record<string, string>;
  onLabelChange: (path: string, label: string) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  data,
  path,
  onFieldChange,
  labels,
  onLabelChange,
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
                  bg="outlineVariant/20"
                  alignItems="center"
                  mt="2"
                  mb="4"
                  p="2"
                  pl="4"
                >
                  <Heading size="lg" fontWeight="bold">
                    <EditableLabel
                      initialValue={labels[pathString] || formatLabel(key)}
                      onSave={(newLabel) => onLabelChange(pathString, newLabel)}
                    />
                  </Heading>
                </Flex>
                <FormField
                  data={value as Record<string, unknown>}
                  path={currentPath}
                  onFieldChange={onFieldChange}
                  labels={labels}
                  onLabelChange={onLabelChange}
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
          />
        );
      })}
    </Grid>
  );
};

export default FormField;