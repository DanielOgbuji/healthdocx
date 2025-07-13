import React, { useState } from "react";
import {
  Flex,
  Text,
  Field,
  Button,
  VStack,
  NativeSelect,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { useDynamicForm } from "@/hooks/useDynamicForm";
import FormField from "./FormField";
import { recordGroups, recordTypes } from "@/constants/recordOptions";
import { MdOutlineCloudDone, MdOutlineFileUpload, MdOutlineUndo, MdAdd, MdTextFields } from "react-icons/md";

interface DynamicFormProps {
  structuredData: string;
  recordId: string | undefined;
  onRevert: () => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ structuredData, recordId, onRevert }) => {
  const {
    formData,
    labels,
    loading,
    error,
    successMessage,
    autoSaveStatus,
    handleFieldChange,
    handleLabelChange,
    handleSubmit,
    handleAddSection,
    handleAddField,
    handleRemoveFieldOrSection,
  } = useDynamicForm(structuredData, recordId);

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
      <Flex alignItems="center" justifyContent="space-between" pb="2" direction={{ lgDown: "column" }} gap="4">
        <Flex justifyContent="space-between" w="full">
          <Flex>
            <Text fontSize="lg">{recordId}</Text>
          </Flex>
          <Flex alignItems="center" gap="2">
            {autoSaveStatus === "Saving..." ? (
              <>
                <Text fontSize="sm" color="gray.500">Saving...</Text>
                <Spinner size="sm" />
              </>
            ) : (
              <>
                <Text fontSize="sm" color="primary">All changes saved</Text>
                <Icon as={MdOutlineCloudDone} color="primary" />
              </>
            )}
          </Flex>
        </Flex>
        <Flex gap="4" direction={{ mdDown: "column" }} alignItems="center" w={{ lgDown: "full" }}>
          <Button onClick={onRevert} variant="outline" colorPalette="brand" w={{ mdDown: "full" }} flex={{ lgDown: "1", mdDown: "none" }} >
            <MdOutlineUndo />
            Revert to Original
          </Button>
          <Button
            onClick={handleSubmit}
            colorPalette="brand"
            loading={loading}
            loadingText="Updating..."
            w={{ mdDown: "full" }}
            flex={{ lgDown: "1", mdDown: "none" }}
          >
            <MdOutlineFileUpload />
            Transmit to Records
          </Button>
        </Flex>
      </Flex>
      <Flex w="full" justifyContent="space-between" gap="4" alignItems="end" direction={{ mdDown: "column" }} colorPalette="brand">
        <Field.Root>
          <NativeSelect.Root
            size="md"
            width="full"
            variant="outline"
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
            variant="outline"
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
        <Flex gap={2} mb={4}>
          <Button
            onClick={() => handleAddSection([])}
            size="sm"
          >
            <MdAdd />
            Add Section
          </Button>
          <Button
            onClick={() => handleAddField([])}
            size="sm"
          >
            <MdTextFields />
            Add Field
          </Button>
        </Flex>
        <FormField
          data={formData}
          path={[]}
          onFieldChange={handleFieldChange}
          labels={labels}
          onLabelChange={handleLabelChange}
          onAddSection={handleAddSection}
          onAddField={handleAddField}
          onRemoveFieldOrSection={handleRemoveFieldOrSection}
        />
      </VStack>
    </Flex>
  );
};

export default DynamicForm;