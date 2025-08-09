import React, { useState, useEffect, useRef } from "react";
import {
  Flex,
  Text,
  Field,
  Button,
  VStack,
  NativeSelect,
  Icon,
  Spinner,
  Grid,
  Menu,
  Portal,
  Kbd,
  Tag
} from "@chakra-ui/react";
import { useDynamicForm } from "@/hooks/useDynamicForm";
import FormField from "./FormField";
import SingleField from "./SingleField";
import MoveMenuItems from "./MoveMenuItems";
import { recordGroups, recordTypes } from "@/constants/recordOptions";
import { MdOutlineCloudDone, MdOutlineFileUpload, MdOutlineUndo, MdAdd, MdTextFields, MdDeleteOutline, MdOutlineMoveUp, MdOutlineRestore, MdOutlineAccountTree } from "react-icons/md";
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SelectionProvider } from '@/contexts/SelectionProvider';
import { useSelection } from '@/hooks/useSelection';
import { useMergeRefs } from "@chakra-ui/hooks";

interface DynamicFormProps {
  structuredData: string;
  recordId: string | undefined;
  ocrText: string | null;
  onRevert: () => void;
}

const DynamicFormContent: React.FC<DynamicFormProps> = ({ structuredData, recordId, ocrText, onRevert }) => {
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
    handleMoveItem,
    handleBulkDelete,
    handleBulkMove,
    newlyAddedPath,
    setNewlyAddedPath,
    isCollapsed,
    toggleCollapse,
    undo,
    redo
  } = useDynamicForm(structuredData, recordId, ocrText);
  const { selectedItems, clearSelection } = useSelection();
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [availableTypes, setAvailableTypes] = useState<
    { value: string; label: string }[]
  >([]);

  const [, drop] = useDrop(() => ({
    accept: ['field', 'section'],
    drop: (item: { path: string[] }, monitor) => {
      if (monitor.didDrop()) {
        return; // If a child has already handled the drop, do nothing
      }
      handleMoveItem(item.path, []); // move to root
    },
  }));

  const mergedDropRefs = useMergeRefs(gridRef, drop as unknown as React.RefCallback<Element>);

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const group = event.target.value;
    setSelectedGroup(group);
    setAvailableTypes(recordTypes[group as keyof typeof recordTypes] || []);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      if (ctrlOrCmd && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      if (ctrlOrCmd && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);


  return (
    <>
      <Flex gap="6" direction={{ mdDown: "column" }} alignItems="center" w={{ lgDown: "full" }} mb="6" justifyContent="end">
        <Button onClick={onRevert} variant="surface" colorPalette="red" w={{ mdDown: "full" }} flex={{ lgDown: "1", mdDown: "none" }} >
          <MdOutlineRestore />
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
      <Flex
        w="full"
        direction="column"
        p={6}
        gap="6"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="sm"
      >
        <Flex alignItems="center" justifyContent="space-between" p="2" direction={{ lgDown: "column" }} gap="6">
          <Flex justifyContent="space-between" w="full">
            <Flex alignItems="start">
              <Text fontSize="xl" fontWeight="bold">{recordId}</Text>
            </Flex>
            <Flex gap="2" alignItems="center">
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
          <Flex gap="6" direction={{ mdDown: "column" }} alignItems="center" w={{ lgDown: "full" }}>
            <Button
              onClick={undo}
              variant="outline"
              colorPalette="brand"
              size="sm"
              w={{ mdDown: "full" }} flex={{ lgDown: "1", mdDown: "none" }}
              title="Undo (Ctrl + Z)"
            >
              <MdOutlineUndo /> Undo <Kbd size="sm">Ctrl + Z</Kbd>
            </Button>
            <Button
              onClick={redo}
              variant="outline"
              colorPalette="brand"
              size="sm"
              w={{ mdDown: "full" }} flex={{ lgDown: "1", mdDown: "none" }}
              title="Redo (Ctrl + Y / Ctrl + Shift + Z)"
            >
              <MdOutlineUndo style={{ transform: "scaleX(-1)" }} /> Redo <Kbd size="sm">Ctrl + Y</Kbd>
            </Button>

          </Flex>
        </Flex>
        <Flex w="full" justifyContent="space-between" gap="6" px="2" alignItems="end" direction={{ mdDown: "column" }} colorPalette="brand">
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
          <Flex gap={6} colorPalette="brand" px="2" direction={{ base: "column", md: "row" }}>
            <Button
              onClick={() => handleAddSection([])}
              size="sm"
              variant="surface"
              flex={{ base: "none", md: "1" }}
              title="Add a section to the root."
            >
              <MdAdd title="Add a section to the root." />
              Add Section
            </Button>
            <Button
              onClick={() => handleAddField([])}
              size="sm"
              variant="surface"
              flex={{ base: "none", md: "1" }}
              title="Add a text field to the root."
            >
              <MdTextFields title="Add a text field to the root." />
              Add Field
            </Button>
            <Button
              onClick={() => {
                handleBulkDelete(selectedItems);
                clearSelection();
              }}
              size="sm"
              colorPalette="red"
              disabled={selectedItems.size === 0}
              variant="outline"
              flex={{ base: "none", md: "1" }}
              title="Delete selected item(s). Warning!! Destructive action."
            >
              <MdDeleteOutline title="Delete selected item(s). Warning!! Destructive action." />
              Delete
            </Button>
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  size="sm"
                  disabled={selectedItems.size === 0}
                  variant="outline"
                  flex={{ base: "none", md: "1" }}
                  title="Move selected item(s)."
                >
                  <MdOutlineMoveUp title="Move selected item(s)." />
                  Move
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content colorPalette="brand">
                    <Menu.Item value="root" onClick={() => {
                      handleBulkMove(selectedItems, []);
                      clearSelection();
                    }}>Root</Menu.Item>
                    <MoveMenuItems
                      data={formData}
                      labels={labels}
                      onSelectPath={(path) => {
                        handleBulkMove(selectedItems, path);
                        clearSelection();
                      }}
                    />
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Flex>
          <Flex direction="column">
            <Flex w="full" justifyContent="center" mb="-5">
              <Tag.Root colorPalette="green">
                <Tag.StartElement>
                  <MdOutlineAccountTree />
                </Tag.StartElement>
                <Tag.Label>Root</Tag.Label>
              </Tag.Root>
            </Flex>
            <Grid ref={mergedDropRefs} templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4} w="full" title="Root" pt="9">
              {Object.entries(formData)
                .filter(([, value]) => typeof value !== "object" || value === null || Array.isArray(value))
                .map(([key, value]) => {
                  const currentPath = [key];
                  const pathString = currentPath.join("_");
                  return (
                    <SingleField
                      key={pathString}
                      fieldKey={key}
                      value={value}
                      currentPath={currentPath}
                      pathString={pathString}
                      onFieldChange={handleFieldChange}
                      labels={labels}
                      onLabelChange={handleLabelChange}
                      onRemoveFieldOrSection={handleRemoveFieldOrSection}
                      onMoveItem={handleMoveItem}
                    />
                  );
                })}
              {Object.entries(formData)
                .filter(([, value]) => typeof value === "object" && value !== null && !Array.isArray(value))
                .map(([key, value]) => {
                  return (
                    <FormField
                      key={key}
                      data={value as Record<string, unknown>}
                      path={[key]}
                      onFieldChange={handleFieldChange}
                      labels={labels}
                      onLabelChange={handleLabelChange}
                      onAddSection={handleAddSection}
                      onAddField={handleAddField}
                      onRemoveFieldOrSection={handleRemoveFieldOrSection}
                      onMoveItem={handleMoveItem}
                      newlyAddedPath={newlyAddedPath}
                      setNewlyAddedPath={setNewlyAddedPath}
                      isCollapsed={isCollapsed}
                      toggleCollapse={toggleCollapse}
                    />

                  );
                })}
            </Grid>
          </Flex>
        </VStack>
      </Flex>
    </>
  )
}

const DynamicForm: React.FC<DynamicFormProps> = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <SelectionProvider>
        <DynamicFormContent {...props} />
      </SelectionProvider>
    </DndProvider>
  );
};

export default DynamicForm;
