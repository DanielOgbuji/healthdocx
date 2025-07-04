import React, { useState } from "react";
import {
  Flex,
  Text,
  Field,
  Button,
  VStack,
  SegmentGroup,
  NativeSelect,
  Icon,
} from "@chakra-ui/react";
import { useDynamicForm } from "@/hooks/useDynamicForm";
import FormField from "./FormField";
import { recordGroups, recordTypes } from "@/constants/recordOptions";
import { MdOutlineCloudDone } from "react-icons/md";

interface DynamicFormProps {
  structuredData: string;
  recordId: string | undefined;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ structuredData, recordId }) => {
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

  const [selectedGroup, setSelectedGroup] = useState("");
  const [availableTypes, setAvailableTypes] = useState<
    { value: string; label: string }[]
  >([]);

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const group = event.target.value;
    setSelectedGroup(group);
    setAvailableTypes(recordTypes[group as keyof typeof recordTypes] || []);
  };


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
      <Flex alignItems="center" justifyContent="space-between">
        <Flex>
          <Text fontSize="lg">{recordId}</Text>
        </Flex>
        <Flex gap="4">
          <Flex alignItems="center" gap="2">
            <Text fontSize="sm">Autosave On</Text>
            <Icon size="sm"><MdOutlineCloudDone /></Icon>
          </Flex>
          <Button
            onClick={handleSubmit}
            colorPalette="brand"
            loading={loading}
            loadingText="Updating..."
          >
            Transmit to Records
          </Button>
        </Flex>
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
        <Flex w="full" gap="4" direction={{ mdDown: "column" }} colorPalette="brand">
          <Field.Root>
            <NativeSelect.Root
              size="md"
              width="full"
              variant="subtle"
            >
              <NativeSelect.Field
                placeholder="Choose record group"
                value={selectedGroup}
                onChange={handleGroupChange}
              >
                {recordGroups.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
          <Field.Root>
            <NativeSelect.Root
              size="md"
              width="full"
              variant="subtle"
              disabled={!selectedGroup}
            >
              <NativeSelect.Field
                placeholder="Choose record type"

              >
                {availableTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
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