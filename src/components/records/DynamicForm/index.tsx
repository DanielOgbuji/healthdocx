import React, { useState, useEffect, useRef } from "react";
import {
  AbsoluteCenter,
  ActionBar,
  Alert,
  Box,
  CloseButton,
  Flex,
  Text,
  Editable,
  Button,
  VStack,
  Icon,
  IconButton,
  Spinner,
  Grid,
  Menu,
  Popover,
  Portal,
  HStack,
  SegmentGroup,
  Select,
  createListCollection,
  //Kbd,
  Tag,
} from "@chakra-ui/react";
import { useDynamicForm } from "@/hooks/useDynamicForm";
import FormField from "./FormField";
import SingleField from "./SingleField";
import EditableTableField from "./EditableTableField"; // Import new table component
import EditableListField from "./EditableListField"; // Import new list component
import MoveMenuItems from "./MoveMenuItems";

import ImageViewer from "./ImageViewer";
import DocumentPreview from "./DocumentPreview"; // Import the new component

import { MdOutlineCloudDone, MdOutlineFileUpload, MdOutlineUndo, MdAdd, MdTextFields, MdDeleteOutline, MdOutlineMoveUp, MdOutlineRestore, MdOutlineAccountTree, MdOutlineClearAll, MdExpandMore, MdExpandLess, MdOutlineImage, MdOutlineModeEditOutline, MdOutlinePreview, MdOutlineTableChart, MdOutlineFormatListBulleted } from "react-icons/md";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu"
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SelectionProvider } from '@/contexts/SelectionProvider'; // Corrected import path
import { useSelection } from '@/hooks/useSelection'; // Corrected import path
import { useMergeRefs } from "@chakra-ui/hooks";
import { PATH_SEPARATOR } from "@/utils/dynamicFormUtils"; // Corrected import path
import { recordGroups } from "@/constants/recordOptions";

interface DynamicFormProps {
  structuredData: string;
  recordId: string | undefined;
  recordCode: string | undefined;
  ocrText: string | null;
  onRevert: () => void;
  rawFileUrl: string | null;
  institutionName?: string;
  recordTypeGroup?: string;
  recordType?: string;
}

const DynamicFormContent: React.FC<DynamicFormProps> = ({ structuredData, recordId, recordCode, ocrText, onRevert, rawFileUrl, institutionName, recordTypeGroup: initialRecordTypeGroup, recordType: initialRecordType }) => {
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
    handleAddTable,
    handleAddList,
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
    changesCount,
    handleAddArrayItem, // New prop
    handleRemoveArrayItem, // New prop
    handleReorderArrayItem, // New prop
  } = useDynamicForm(structuredData, recordId, ocrText, initialRecordTypeGroup, initialRecordType);
  const { selectedItems, clearSelection } = useSelection();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositions = useRef<{ [key: string]: number }>({});
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentView, setCurrentView] = useState("edit");
  const initialGroupValue = recordGroups.find(g => g.label === initialRecordTypeGroup)?.value || recordGroups.find(g => g.value === initialRecordTypeGroup)?.value || recordGroups[0].value;
  const [recordTypeGroup, setRecordTypeGroup] = useState(initialGroupValue);
  const [recordType, setRecordType] = useState(initialRecordType || "Loading...");

  const recordGroupCollection = createListCollection({ items: recordGroups });


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

  const handleViewChange = (details: { value: string | null }) => {
    if (scrollContainerRef.current) {
      scrollPositions.current[currentView] = scrollContainerRef.current.scrollTop;
    }
    if (details.value) {
      setCurrentView(details.value);
    }
  };

  useEffect(() => {
    if (successMessage) {
      setIsAlertOpen(true);
    }
  }, [successMessage]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollPositions.current[currentView] || 0;
        }
      });
    }
  }, [currentView]);

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
    <Flex
      mt="120px"
    >
      {currentView === 'edit' && (
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
                    onClick={() => handleSubmit(recordTypeGroup, recordType)}
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
                              onClick={() => handleAddTable([])}
                              size="sm"
                              variant="ghost"
                              title="Add a table to the root."
                            >
                              <MdOutlineTableChart title="Add a table to the root." />
                            </Button>
                            <Button
                              onClick={() => handleAddList([])}
                              size="sm"
                              variant="ghost"
                              title="Add a list to the root."
                            >
                              <MdOutlineFormatListBulleted title="Add a list to the root." />
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
      )}
      <Flex
        w="full"
        direction="column"
        px={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }}
        pt={{ xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }}
        pb={currentView === 'edit' ? "100px" : { xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" }}
        gap="6"
        ref={mergedDropRefs} // Apply the mergedDropRefs to the main scrollable container
        position="relative" // Needed for absolute positioning of scroll zones
        overflowY="auto" // Enable scrolling
        maxHeight="calc(100vh - 120px)" // Example max height, adjust as needed
      >
        <AbsoluteCenter axis="horizontal" position="fixed" top="72px" zIndex="10" w="full">
          <Flex w="full">
            <SegmentGroup.Root
              defaultValue="edit"
              size="md" w="full"
              bgColor="backface"
              borderWidth="1px"
              borderRadius="none"
              borderTop="none"
              borderLeft="none"
              borderRight="none"
              borderColor="outline/20"
              boxShadow="none"
              boxSizing="content-box"
              h="48px"
              onValueChange={handleViewChange}
            >
              <SegmentGroup.Indicator bgColor="primary/4" borderRadius="none" boxShadow="none" borderWidth="1px" borderTop="none" borderLeft="none" borderRight="none" borderColor="primary" boxSizing="content-box" />
              <SegmentGroup.Items
                w="full"
                h="48px"
                color="onBackground"
                fontWeight="medium"
                _checked={{ color: "primary" }}
                _first={{ ml: { xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" } }}
                _last={{ mr: { xl: "6vw", lg: "6vw", md: "6vw", sm: "6vw", base: "4" } }}
                items={[
                  {
                    value: "image",
                    label: (
                      <HStack>
                        <Icon size="sm" as={MdOutlineImage} />
                        Image
                      </HStack>
                    ),
                  },
                  {
                    value: "edit",
                    label: (
                      <HStack>
                        <Icon size="sm" as={MdOutlineModeEditOutline} />
                        Edit
                      </HStack>
                    ),
                  },
                  {
                    value: "preview",
                    label: (
                      <HStack>
                        <Icon size="sm" as={MdOutlinePreview} />
                        Preview
                      </HStack>
                    ),
                  },
                ]}
              />
            </SegmentGroup.Root>
          </Flex>
        </AbsoluteCenter>
        <Flex alignItems="center" justifyContent="space-between" direction={{ lgDown: "column" }} gap="6">
          <Flex justifyContent="space-between" w="full" gap="4">
            <Flex alignItems="start" mr="2">
              <Editable.Root defaultValue={recordCode} activationMode="dblclick" fontSize="xl" fontWeight="bold" colorPalette="brand" color="onBackground">
                <Editable.Preview lineHeight="normal" color="primary" />
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
        </Flex>
        <Box display={currentView === 'edit' ? 'contents' : 'none'}>
          <Flex w="full" justifyContent="space-between" alignItems="start" direction="column" colorPalette="brand" gap="2">
            <Select.Root collection={recordGroupCollection} value={recordTypeGroup ? [recordTypeGroup] : []} onValueChange={(e) => setRecordTypeGroup(e.value[0] || recordGroups[0].value)} size="sm" variant="subtle" w="300px">
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select record type group" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {recordGroupCollection.items.map((item) => (
                      <Select.Item item={item} key={item.value}>
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            <Editable.Root
              defaultValue={recordType || "Loading..."}
              onValueCommit={(details) => setRecordType(details.value)}
              activationMode="dblclick"
            >
              <Editable.Preview borderRadius="full" borderStyle="solid" borderWidth="thin" p="10px" lineHeight="1px" minH="fit-content" fontSize="xs" color="tertiary" borderColor="tertiary" fontStyle="italic" />
              <Editable.Input placeholder="Enter record type" />
              <Editable.Control>
                <Editable.EditTrigger asChild>
                  <IconButton variant="ghost" size="xs">
                    <LuPencilLine />
                  </IconButton>
                </Editable.EditTrigger>
                <Editable.CancelTrigger asChild>
                  <IconButton variant="outline" size="xs">
                    <LuX />
                  </IconButton>
                </Editable.CancelTrigger>
                <Editable.SubmitTrigger asChild>
                  <IconButton variant="outline" size="xs">
                    <LuCheck />
                  </IconButton>
                </Editable.SubmitTrigger>
              </Editable.Control>
            </Editable.Root>
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
                {Object.entries(formData).map(([key, value]) => {
                  const currentPath = [key];
                  const currentPathString = currentPath.join(PATH_SEPARATOR);

                  if (Array.isArray(value)) {
                    const isTable = value.length > 0 && typeof value[0] === 'object' && value[0] !== null;
                    if (isTable) {
                      return (
                        <EditableTableField
                          key={currentPathString}
                          fieldKey={key}
                          value={value as Array<Record<string, string>>}
                          currentPath={currentPath}
                          pathString={currentPathString}
                          onFieldChange={handleFieldChange}
                          labels={labels}
                          onLabelChange={handleLabelChange}
                          onRemoveFieldOrSection={handleRemoveFieldOrSection}
                          onMoveItem={handleMoveItem}
                          onAddArrayItem={handleAddArrayItem}
                          onRemoveArrayItem={handleRemoveArrayItem}
                          onReorderArrayItem={handleReorderArrayItem}
                          isCollapsed={isCollapsed(currentPathString)}
                          toggleCollapse={() => toggleCollapse(currentPathString)}
                          depth={0}
                          newlyAddedPath={newlyAddedPath}
                          setNewlyAddedPath={setNewlyAddedPath}
                        />
                      );
                    } else {
                      return (
                        <EditableListField
                          key={currentPathString}
                          fieldKey={key}
                          value={value as string[]}
                          currentPath={currentPath}
                          pathString={currentPathString}
                          onFieldChange={handleFieldChange}
                          labels={labels}
                          onLabelChange={handleLabelChange}
                          onRemoveFieldOrSection={handleRemoveFieldOrSection}
                          onMoveItem={handleMoveItem}
                          onAddArrayItem={handleAddArrayItem}
                          onRemoveArrayItem={handleRemoveArrayItem}
                          onReorderArrayItem={handleReorderArrayItem}
                          isCollapsed={isCollapsed(currentPathString)}
                          toggleCollapse={() => toggleCollapse(currentPathString)}
                          depth={0}
                          newlyAddedPath={newlyAddedPath}
                          setNewlyAddedPath={setNewlyAddedPath}
                        />
                      );
                    }
                  } else if (typeof value === "object" && value !== null) {
                    return (
                      <FormField
                        key={currentPathString}
                        depth={0} // Root level sections have depth 0
                        data={value as Record<string, unknown>}
                        path={currentPath}
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
                        onAddArrayItem={handleAddArrayItem}
                        onRemoveArrayItem={handleRemoveArrayItem}
                        onReorderArrayItem={handleReorderArrayItem}
                      />
                    );
                  } else {
                    return (
                      <SingleField
                        key={currentPathString}
                        fieldKey={key}
                        value={value}
                        currentPath={currentPath}
                        pathString={currentPathString}
                        onFieldChange={handleFieldChange}
                        labels={labels}
                        onLabelChange={handleLabelChange}
                        onRemoveFieldOrSection={handleRemoveFieldOrSection}
                        onMoveItem={handleMoveItem}
                        newlyAddedPath={newlyAddedPath}
                        setNewlyAddedPath={setNewlyAddedPath}
                      />
                    );
                  }
                })}
              </Grid>
            </Flex>
          </VStack>
        </Box>
        <Box display={currentView === 'image' ? 'block' : 'none'}>
          {rawFileUrl && <ImageViewer imageUrl={rawFileUrl} />}
        </Box>
        <Box display={currentView === 'preview' ? 'block' : 'none'} pt="8">
          <DocumentPreview formData={formData} labels={labels} institutionName={institutionName} />
        </Box>
      </Flex>
    </Flex >
  )
}

const DynamicForm: React.FC<DynamicFormProps> = (props) => {
  return (
    <DndProvider backend={HTML5Backend} options={{
      scrollSensitivity: 100, // Start scrolling when pointer is 100px from edge
      enableHoverOutsideTarget: true
    }}>
      <SelectionProvider>
        <DynamicFormContent {...props} />
      </SelectionProvider>
    </DndProvider>
  );
};

export default DynamicForm;
