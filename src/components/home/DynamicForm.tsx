import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Input,
  Button,
  Field,
  Grid,
  GridItem,
  Flex,
  //useToast,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster"
import { api } from "@/api/axios";

interface DynamicFormProps {
  structuredData: string;
}

// Helper function to update nested object
const updateNested = (
  obj: Record<string, unknown>,
  path: string[],
  value: string
): Record<string, unknown> => {
  if (path.length === 0) return obj;
  const [head, ...rest] = path;
  if (rest.length === 0) {
    return { ...obj, [head]: value };
  }
  return {
    ...obj,
    [head]: updateNested(
      (obj[head] as Record<string, unknown>) || {},
      rest,
      value
    ),
  };
};

interface FormFieldProps {
  data: Record<string, unknown>;
  path: string[];
  onFieldChange: (path: string[], value: string) => void;
}

const formatLabel = (label: string): string =>
  label
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .trim()
    .replace(/^./, (str) => str.toUpperCase());

const FormField: React.FC<FormFieldProps> = ({ data, path, onFieldChange }) => {
  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
      {Object.entries(data).map(([key, value]) => {
        const currentPath = [...path, key];

        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value) &&
          Object.prototype.toString.call(value) === "[object Object]"
        ) {
          return (
            <GridItem key={currentPath.join(".")} colSpan={{ base: 1, md: 2 }}>
              <Box
                //border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                pb={8}
              >
                <Flex bg="surface" alignItems="center" mb="8" p="4">
                  <Heading size="lg" fontWeight="bold">
                    {formatLabel(key)}
                  </Heading>
                </Flex>
                <FormField
                  data={value as Record<string, unknown>}
                  path={currentPath}
                  onFieldChange={onFieldChange}
                />
              </Box>
            </GridItem>
          );
        }

        return (
          <GridItem key={currentPath.join(".")} colSpan={1}>
            <Field.Root>
              <Field.Label htmlFor={currentPath.join(".")}>
                {formatLabel(key)}
              </Field.Label>
              <Input
                id={currentPath.join(".")}
                value={
                  typeof value === "string" || typeof value === "number"
                    ? value
                    : ""
                }
                onChange={(e) => onFieldChange(currentPath, e.target.value)}
              />
            </Field.Root>
          </GridItem>
        );
      })}
    </Grid>
  );
};

const DynamicForm: React.FC<DynamicFormProps> = ({ structuredData }) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    try {
      const cleanData = structuredData
        .replace(/^```json\n/, "")
        .replace(/\n```$/, "");
      const parsed = JSON.parse(cleanData);
      setFormData(parsed);
    } catch (e) {
      console.error("Error parsing structuredData:", e);
      setError("Error parsing data. Please check the format.");
    }

    const storedId = localStorage.getItem("id");
    if (storedId) setId(storedId);
  }, [structuredData]);

  const handleFieldChange = (path: string[], value: string) => {
    setFormData((prevData) => updateNested(prevData, path, value));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await api.patch(
        `/patient-records/update/${id}`,
        formData
      );

      if (response.status === 200) {
        setSuccessMessage("Form submitted successfully!");
        toaster.create({
          title: "Success",
          description: "Form submitted successfully!",
          type: "success",
          duration: 3000,
        });
      } else {
        setError(`Submission failed: ${response.statusText}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Submission failed: ${error.message}`);
      } else {
        setError("Submission failed: An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      w="full"
      p={6}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="sm"
    >
      <VStack align="stretch" gap={6}>
        {error && (
          <Text color="red.500" fontWeight="medium">
            {error}
          </Text>
        )}
        {successMessage && (
          <Text color="green.600" fontWeight="medium">
            {successMessage}
          </Text>
        )}

        <FormField
          data={formData}
          path={[]}
          onFieldChange={handleFieldChange}
        />

        <Button
          onClick={handleSubmit}
          colorScheme="blue"
          loading={loading}
          loadingText="Updating..."
        >
          Update Record
        </Button>
      </VStack>
    </Box>
  );
};

export default DynamicForm;
