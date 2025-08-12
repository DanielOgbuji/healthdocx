import React, { useState, useEffect, useRef } from "react";
import {
  ActionBar,
  Alert,
  CloseButton,
  Flex,
  Text,
  Editable,
  Field,
  Button,
  VStack,
  NativeSelect,
  Icon,
  IconButton,
  Spinner,
  Grid,
  Menu,
  Popover,
  Portal,
  //Kbd,
  Tag,
} from "@chakra-ui/react";
import { useDynamicForm } from "@/hooks/useDynamicForm";
import FormField from "./FormField";
import SingleField from "./SingleField";
import MoveMenuItems from "./MoveMenuItems";
import { recordGroups, recordTypes } from "@/constants/recordOptions";
import { MdOutlineCloudDone, MdOutlineFileUpload, MdOutlineUndo, MdAdd, MdTextFields, MdDeleteOutline, MdOutlineMoveUp, MdOutlineRestore, MdOutlineAccountTree, MdOutlineClearAll, MdExpandMore, MdExpandLess } from "react-icons/md";
import { TouchBackend } from 'react-dnd-touch-backend'
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SelectionProvider } from '@/contexts/SelectionProvider'; // Corrected import path
import { useSelection } from '@/hooks/useSelection'; // Corrected import path
import { useMergeRefs } from "@chakra-ui/hooks";
import { PATH_SEPARATOR } from "@/utils/dynamicFormUtils"; // Corrected import path
import { isMobile } from "@/utils/isMobile";

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
    redo,
    changesCount
  } = useDynamicForm(structuredData, recordId, ocrText);
  const { selectedItems, clearSelection } = useSelection();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [availableTypes, setAvailableTypes] = useState<
    { value: string; label: string }[]
  >([]);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [, drop] = useDrop(() => ({
    accept: ['field', 'section'],
    drop: (item: { path: string[] }, monitor) => {
      if (monitor.didDrop()) {
        return; // If a child has already handled the drop, do nothing
      }
      handleMoveItem(item.path, []); // move to root
    },
  }));

  const mergedDropRefs = useMergeRefs(scrollContainerRef, drop as unknown as React.RefCallback<Element>);

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const group = event.target.value;
    setSelectedGroup(group);
    setAvailableTypes(recordTypes[group as keyof typeof recordTypes] || []);
  };

  useEffect(() => {
    if (successMessage) {
      setIsAlertOpen(true);
    }
  }, [successMessage]);

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

      if (e.key === 'Delete' && selectedItems.size > 0) {
        e.preventDefault();
        handleBulkDelete(selectedItems);
        clearSelection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, handleBulkDelete, selectedItems, clearSelection]);


  return (
    <Flex mt="72px">
      <Flex>
        <ActionBar.Root open>
          <Portal>
            <ActionBar.Positioner>
              <ActionBar.Content>
                <ActionBar.SelectionTrigger
                  onClick={clearSelection}
                  alignItems="center"
                  title={selectedItems.size > 0 ? "Click to clear selection" : `${changesCount} Change(s)`}
                  cursor={selectedItems.size > 0 ? "pointer" : "default"}
                  _hover={{
                    "& .clear-selection-icon": {
                      visibility: "visible",
                      opacity: "1",
                      marginLeft: "0"
                    },
                    "& .selection-counter": {
                      display: selectedItems.size > 0 ? "hidden" : "block",
                    },
                  }}
                >
                  {selectedItems.size > 0 ? (
                    <Flex alignItems="center" gap={2} inert>
                      <Text className="selection-counter">{selectedItems.size} Selected</Text>
                      <Icon
                        as={MdOutlineClearAll}
                        boxSize={5}
                        visibility="hidden"
                        opacity={0}
                        cursor="pointer"
                        className="clear-selection-icon"
                        size="xs"
                        ml="-2em"
                        transition="all 0.5s ease-in-out"
                      />
                    </Flex>
                  ) : (
                    `${changesCount} Change(s)`
                  )}
                </ActionBar.SelectionTrigger>
                <ActionBar.Separator />
                <Button onClick={onRevert} variant="surface" colorPalette="red">
                  <MdOutlineRestore />
                  <Text display={{ base: "inline", md: "none", smDown: "none" }}>Revert</Text>
                  <Text display={{ base: "none", md: "inline" }}>Revert to Original</Text>
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="surface"
                  colorPalette="brand"
                  loading={loading}
                  loadingText="Updating..."
                >
                  <MdOutlineFileUpload />
                  <Text display={{ base: "inline", md: "none", smDown: "none" }}>Save</Text>
                  <Text display={{ base: "none", md: "inline" }}>Save to Records</Text>
                </Button>
                <ActionBar.Separator />
                <Popover.Root positioning={{ placement: "top-end" }} open={isActionsOpen} onOpenChange={(details) => setIsActionsOpen(details.open)}>
                  <Popover.Trigger asChild>
                    <IconButton
                      variant="outline"
                      title="Actions"
                    >
                      {isActionsOpen ? <MdExpandLess /> : <MdExpandMore />}
                    </IconButton>
                  </Popover.Trigger>
                  <Portal>
                    <Popover.Positioner>
                      <Popover.Content width="auto" mb="2" mx="-12px">
                        {/*<Popover.Arrow />*/}
                        <Popover.Body p="1" gap="1">
                          <Button
                            onClick={undo}
                            variant="ghost"
                            size="sm"
                            title="Undo (Ctrl + Z)"
                          >
                            <MdOutlineUndo />
                          </Button>
                          <Button
                            onClick={redo}
                            variant="ghost"
                            size="sm"
                            title="Redo (Ctrl + Y)"
                          >
                            <MdOutlineUndo style={{ transform: "scaleX(-1)" }} />
                          </Button>
                          <Button
                            onClick={() => handleAddSection([])}
                            size="sm"
                            variant="ghost"
                            title="Add a section to the root."
                          >
                            <MdAdd title="Add a section to the root." />
                          </Button>
                          <Button
                            onClick={() => handleAddField([])}
                            size="sm"
                            variant="ghost"
                            title="Add a text field to the root."
                          >
                            <MdTextFields title="Add a text field to the root." />
                          </Button>
                          <Button
                            onClick={() => {
                              handleBulkDelete(selectedItems);
                              clearSelection();
                            }}
                            size="sm"
                            colorPalette="red"
                            disabled={selectedItems.size === 0}
                            variant="ghost"
                            title="Delete selected item(s). Warning!! Destructive action."
                          >
                            <MdDeleteOutline title="Delete selected item(s). Warning!! Destructive action." />
                          </Button>
                          <Menu.Root>
                            <Menu.Trigger asChild>
                              <Button
                                size="sm"
                                disabled={selectedItems.size === 0}
                                variant="ghost"
                                colorPalette="brand"
                                title="Move selected item(s)."
                              >
                                <MdOutlineMoveUp title="Move selected item(s)." />
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
                        </Popover.Body>
                      </Popover.Content>
                    </Popover.Positioner>
                  </Portal>
                </Popover.Root>
              </ActionBar.Content>
            </ActionBar.Positioner>
          </Portal>
        </ActionBar.Root>
      </Flex>
      <Flex
        w="full"
        direction="column"
        //p="6"
        p={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }}
        pb="24"
        gap="6"
        boxShadow="sm"
        ref={mergedDropRefs} // Apply the mergedDropRefs to the main scrollable container
        position="relative" // Needed for absolute positioning of scroll zones
        overflowY="auto" // Enable scrolling
        maxHeight="calc(100vh - 72px)" // Example max height, adjust as needed
      >
        <Flex alignItems="center" justifyContent="space-between" direction={{ lgDown: "column" }} gap="6">
          <Flex justifyContent="space-between" w="full" gap="4">
            <Flex alignItems="start" mr="2">
              <Editable.Root defaultValue={recordId} activationMode="dblclick" fontSize="xl" fontWeight="bold" colorPalette="brand" color="onBackground">
                <Editable.Preview px="2" lineHeight="normal" color="primary" />
                <Editable.Input />
              </Editable.Root>
              {/*<Text fontSize="xl" fontWeight="bold">{recordId}</Text>*/}
            </Flex>
            <Flex gap="2" alignItems="center">
              {autoSaveStatus === "Saving..." ? (
                <>
                  <Text fontSize="sm" color="gray.500" display={{ mdDown: "none" }}>Saving...</Text>
                  <Spinner size="sm" />
                </>
              ) : (
                <>
                  <Text fontSize="sm" color="primary" display={{ mdDown: "none" }}>All changes saved</Text>
                  <Icon as={MdOutlineCloudDone} color="primary" />
                </>
              )}
            </Flex>
          </Flex>
          {/*<Flex gap="6" alignItems="center" w={{ lgDown: "full" }}>
            <Button
              onClick={undo}
              variant="outline"
              colorPalette="brand"
              size="sm"
              flex={{ lgDown: "1" }}
              title="Undo (Ctrl + Z)"
            >
              <MdOutlineUndo /> Undo <Kbd size="sm">Ctrl + Z</Kbd>
            </Button>
            <Button
              onClick={redo}
              variant="outline"
              colorPalette="brand"
              size="sm"
              flex={{ lgDown: "1" }}
              title="Redo (Ctrl + Y)"
            >
              <MdOutlineUndo style={{ transform: "scaleX(-1)" }} /> Redo <Kbd size="sm">Ctrl + Y</Kbd>
            </Button>
          </Flex>*/}
        </Flex>
        <Flex w="full" justifyContent="space-between" gap="6" alignItems="end" direction={{ mdDown: "column" }} colorPalette="brand">
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
        <VStack align="stretch" gap="6">
          {error && (
            <Text color="red.500" fontWeight="medium">
              {error}
            </Text>
          )}
          {isAlertOpen && successMessage && (
            <Alert.Root status="success" variant="surface">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Success!</Alert.Title>
                <Alert.Description>
                  {successMessage}
                </Alert.Description>
              </Alert.Content>
              <CloseButton pos="relative" top="-2" insetEnd="-2" onClick={() => setIsAlertOpen(false)} />
            </Alert.Root>
          )}
          <Flex gap="6" colorPalette="brand" px="2" direction={{ base: "column", md: "row" }} display="none">
            <Flex flex={1} gap="6">
              <Button
                onClick={() => {
                  handleBulkDelete(selectedItems);
                  clearSelection();
                }}
                size="sm"
                colorPalette="red"
                disabled={selectedItems.size === 0}
                variant="outline"
                flex={{ base: "1", md: "1" }}
                display={{ mdDown: "none" }}
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
                    display={{ mdDown: "none" }}
                    variant="outline"
                    flex={{ base: "1", md: "1" }}
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
            <Flex flex={1}>
              <Button
                onClick={() => handleAddSection([])}
                size="sm"
                variant="surface"
                flex={{ base: "1", md: "1" }}
                title="Add a section to the root."
                borderRightRadius="0px"
                width={{ mdDown: "full" }}
              >
                <MdAdd title="Add a section to the root." />
                Add Section
              </Button>
              <Button
                onClick={() => handleAddField([])}
                size="sm"
                variant="surface"
                flex={{ base: "1", md: "1" }}
                title="Add a text field to the root."
                borderLeftRadius="0px"
              >
                <MdTextFields title="Add a text field to the root." />
                Add Field
              </Button>
            </Flex>
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
            <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4} w="full" title="Root" pt="9">
              {Object.entries(formData)
                .filter(([, value]) => typeof value !== "object" || value === null || Array.isArray(value))
                .map(([key, value]) => {
                  const currentPath = [key];
                  const pathString = currentPath.join(PATH_SEPARATOR);
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
    </Flex >
  )
}

const DynamicForm: React.FC<DynamicFormProps> = (props) => {
  const backend = isMobile ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backend} options={{
      enableMouseEvents: true, scrollAngleRanges: [
        { start: 30, end: 150 },
        { start: 210, end: 330 }
      ]
    }}>
      <SelectionProvider>
        <DynamicFormContent {...props} />
      </SelectionProvider>
    </DndProvider>
  );
};

export default DynamicForm;
