import React from "react";
import {
  Flex,
  Text,
  Field,
  Button,
  VStack,
  SegmentGroup,
  NativeSelect
} from "@chakra-ui/react";
import { useDynamicForm } from "@/hooks/useDynamicForm";
import FormField from "./FormField";

interface DynamicFormProps {
  structuredData: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ structuredData }) => {
  const {
    formData,
    labels,
    loading,
    error,
    successMessage,
    handleFieldChange,
    handleLabelChange,
    handleSubmit,
  } = useDynamicForm(structuredData);

  return (
    <Flex
      w="full"
      direction="column"
      p={6}
      gap="4"
      borderWidth="1px"
      borderRadius="md"
      boxShadow="sm"
    >
      <Flex>
        <Button
          onClick={handleSubmit}
          colorScheme="blue"
          loading={loading}
          loadingText="Updating..."
        >
          Update Record
        </Button>
      </Flex>
      <Flex w="full" justifyContent="space-between" gap="4" pb="4" alignItems="end" direction={{ lgDown: "column" }}>
        <SegmentGroup.Root defaultValue="Plain" w="full">
          <SegmentGroup.Indicator />
          <SegmentGroup.Items
            w="full"
            items={[
              { label: "Plain", value: "Plain" },
              { label: "Table", value: "Table", disabled: true },
              { label: "Flowchart", value: "Flowchart", disabled: true },
            ]}
          />
        </SegmentGroup.Root>
        <Flex w="full" gap="4" direction={{ mdDown: "column" }}>
          <Field.Root>
            <Field.Label>Record Group</Field.Label>
            <NativeSelect.Root size="md" width="full" variant="subtle">
              <NativeSelect.Field placeholder="Choose record group">
                <option value="react">React</option>
                <option value="vue">Vue</option>
                <option value="angular">Angular</option>
                <option value="svelte">Svelte</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
          <Field.Root>
            <Field.Label>Record Type</Field.Label>
            <NativeSelect.Root size="md" width="full" variant="subtle">
              <NativeSelect.Field placeholder="Choose record type">
                <option value="react">React</option>
                <option value="vue">Vue</option>
                <option value="angular">Angular</option>
                <option value="svelte">Svelte</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        </Flex>
      </Flex>
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
          labels={labels}
          onLabelChange={handleLabelChange}
        />
      </VStack>
    </Flex>
  );
};

export default DynamicForm;