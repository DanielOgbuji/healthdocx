import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  Box,
  GridItem,
  Flex,
  IconButton,
  Input,
  Checkbox,
  Icon,
  VStack,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { useMergeRefs } from "@chakra-ui/hooks";
import {
  MdAdd,
  MdDeleteOutline,
  MdOutlineKeyboardDoubleArrowDown,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { DragHandle } from "./DragHandle";
import EditableLabel from "./EditableLabel";
import { useDrag, useDrop } from "react-dnd";
import { useSelection } from "@/hooks/useSelection";
import { PATH_SEPARATOR } from "@/utils/dynamicFormUtils";
import type { DragItem } from "@/types/dnd";
import { Collapsible } from "@chakra-ui/react";

interface DraggableListItemProps {
  item: string;
  index: number;
  itemPath: string[];
  handleItemChange: (index: number, newValue: string) => void;
  handleItemBlur: () => void;
  handleRemoveItem: (index: number) => void;
  currentArrayPath: string[];
  onReorderArrayItem: (path: string[], fromIndex: number, toIndex: number) => void;
}

const DraggableListItem: React.FC<DraggableListItemProps> = ({
  item,
  index,
  itemPath,
  handleItemChange,
  handleItemBlur,
  handleRemoveItem,
  currentArrayPath,
  onReorderArrayItem,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [, dragItem] = useDrag(() => ({
    type: 'list-item',
    item: { id: itemPath.join(PATH_SEPARATOR), path: itemPath, type: 'list-item', originalIndex: index },
  }));

  const [{ isOver, draggedItem }, dropItem] = useDrop(() => ({
    accept: 'list-item',
    drop: (dragged: DragItem) => {
      if (dragged.type === 'list-item' && dragged.originalIndex !== undefined) {
        onReorderArrayItem(currentArrayPath, dragged.originalIndex, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggedItem: monitor.getItem() as DragItem | null,
    }),
  }));

  const mergedItemRefs = useMergeRefs(itemRef, dragItem as unknown as React.RefCallback<Element>, dropItem as unknown as React.RefCallback<Element>);

  return (
    <HStack
      key={index}
      gap={2}
      className="group"
      ref={mergedItemRefs}
      cursor="grab"
      position="relative" // Needed for absolute positioning of drop indicator
    >
      <DragHandle />
      <Input
        value={item || ""}
        onChange={(e) => handleItemChange(index, e.target.value)}
        onBlur={handleItemBlur}
        size="sm"
        variant="flushed"
        title="Click to edit list item."
      />
      <IconButton
        display="none"
        _groupHover={{ display: "flex" }}
        aria-label="Remove Item"
        size="xs"
        onClick={() => handleRemoveItem(index)}
        colorPalette="red"
        variant="ghost"
        title="Remove this list item."
      >
        <MdDeleteOutline />
      </IconButton>
      {isOver && draggedItem && (
        <Box position="absolute" top="0" left="0" right="0" bottom="0" display="flex" alignItems="center" justifyContent="center" bg="primary/10" pointerEvents="none">
          <Icon as={MdOutlineKeyboardDoubleArrowDown} boxSize={8} color="primary" />
        </Box>
      )}
    </HStack>
  );
};

interface EditableListFieldProps {
  fieldKey: string;
  value: string[];
  currentPath: string[];
  pathString: string;
  onFieldChange: (path: string[], value: string[]) => void;
  labels: Record<string, string>;
  onLabelChange: (path: string, label: string) => void;
  onRemoveFieldOrSection: (path: string[]) => void;
  onMoveItem: (itemPath: string[], targetPath: string[], moveType?: "reorder" | "moveInto") => void;
  onAddArrayItem: (path: string[], item: string) => void;
  onRemoveArrayItem: (path: string[], index: number) => void;
  onReorderArrayItem: (path: string[], fromIndex: number, toIndex: number) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  depth: number;
  newlyAddedPath: string[] | null;
  setNewlyAddedPath: (path: string[] | null) => void;
}

const EditableListField: React.FC<EditableListFieldProps> = ({
  fieldKey,
  value,
  currentPath,
  pathString,
  onFieldChange,
  labels,
  onLabelChange,
  onRemoveFieldOrSection,
  onMoveItem,
  onAddArrayItem,
  onRemoveArrayItem,
  onReorderArrayItem,
  isCollapsed,
  toggleCollapse,
  depth,
  newlyAddedPath,
  setNewlyAddedPath,
}) => {
  const { selectedItems, toggleSelection } = useSelection();
  const gridItemRef = useRef<HTMLDivElement>(null);
  const [listItems, setListItems] = useState(value);
  const [isHighlighted, setIsHighlighted] = useState(false);

  React.useLayoutEffect(() => {
    if (newlyAddedPath && newlyAddedPath.join(PATH_SEPARATOR) === pathString && gridItemRef.current) {
      // Use requestAnimationFrame to ensure smooth scrolling
      requestAnimationFrame(() => {
        gridItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      setNewlyAddedPath(null); // Reset after scrolling
      setIsHighlighted(true); // Trigger highlight after scroll
    }
  }, [newlyAddedPath, pathString, setNewlyAddedPath]);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isHighlighted) {
      timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 1200); // Highlight for 1.2 seconds
    }
    return () => clearTimeout(timer);
  }, [isHighlighted]);

  useEffect(() => {
    setListItems(value);
  }, [value]);

  const [{ isDragging: isListDragging }, dragList] = useDrag(() => ({
    type: 'field', // Treat list as a field for drag-and-drop
    item: { id: pathString, path: currentPath, type: 'field' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver: isListOver, draggedItem: draggedListItem }, dropList] = useDrop(() => ({
    accept: ['field', 'section'],
    drop: (item: DragItem) => {
      onMoveItem(item.path, currentPath);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggedItem: monitor.getItem() as DragItem | null,
    }),
  }));

  // Use separate refs for the main list component's drag and drop
  const mergedListRefs = (node: HTMLDivElement | null) => {
    gridItemRef.current = node;
    // dragList(node); // Removed from here
    dropList(node);
  };

  const handleItemChange = useCallback(
    (index: number, newValue: string) => {
      const updatedItems = [...listItems];
      updatedItems[index] = newValue;
      setListItems(updatedItems);
    },
    [listItems]
  );

  const handleItemBlur = useCallback(() => {
    if (JSON.stringify(listItems) !== JSON.stringify(value)) {
      onFieldChange(currentPath, listItems);
    }
  }, [listItems, value, currentPath, onFieldChange]);

  const handleAddItemClick = useCallback(() => {
    onAddArrayItem(currentPath, "");
    setNewlyAddedPath([...currentPath, String(listItems.length)]);
  }, [currentPath, onAddArrayItem, listItems.length, setNewlyAddedPath]);

  const handleRemoveItemClick = useCallback(
    (index: number) => {
      onRemoveArrayItem(currentPath, index);
    },
    [currentPath, onRemoveArrayItem]
  );

  return (
    <GridItem
      colSpan={{ base: 1, lg: 2 }}
      ref={mergedListRefs} // Use mergedListRefs here
      opacity={isListDragging ? 0.5 : 1} // Use isListDragging
      border={selectedItems.has(pathString) ? "2px dotted" : "none"}
      borderColor={selectedItems.has(pathString) ? "secondary" : "none"}
      p="1"
      title={pathString}
      cursor={isListDragging ? "grabbing" : "default"} // Use isListDragging
      className="group"
    >
      <Collapsible.Root open={!isCollapsed} lazyMount unmountOnExit>
        <Flex
          gap="2"
          alignItems={{ base: "start", md: "center" }}
          mb={depth === 0 ? 6 : 4}
          px="4"
          p={4}
          mt={depth === 0 ? 0 : 0}
          bg={{
            _light: depth === 0 ? "primaryContainer/10" : "primaryContainer/10",
            _dark: depth === 0 ? "outlineVariant/20" : "outlineVariant/20"
          }}
          borderWidth={depth === 0 ? "1px" : "0 0 1px 0"}
          borderColor="outlineVariant/50"
          borderRadius={depth === 0 ? "md" : "none"}
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
          boxShadow={isHighlighted ? "0px 0px 20px var(--shadow-color)" : "none"}
          scale={isHighlighted ? "1.01" : "1"}
          transition="scale 0.25s ease-in-out"
          shadowColor="onBackground/20"
          className="group"
        >
          <Flex gap={{ base: "4", md: "1" }} alignItems={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} justifyContent="center">
            <Flex gap={{ base: "2", md: "3" }} alignItems="center" mr="2">
              <Collapsible.Trigger onClick={toggleCollapse} as="a">
                <IconButton
                  aria-label={isCollapsed ? "Expand list" : "Collapse list"}
                  size="xs"
                  variant="surface"
                  colorPalette="brand"
                  title={isCollapsed ? "Expand this list." : "Collapse this list."}
                >
                  {isCollapsed ? <Icon as={MdExpandMore} boxSize={5} /> : <Icon as={MdExpandLess} boxSize={5} />}
                </IconButton>
              </Collapsible.Trigger>
              <Checkbox.Root
                checked={selectedItems.has(pathString)}
                onCheckedChange={() => toggleSelection(pathString)}
                title="Select this item."
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control ml="2" />
              </Checkbox.Root>
              <Box ref={dragList} cursor="grab">
                <Flex mx="auto">
                  <DragHandle />
                </Flex>
              </Box>
            </Flex>
            <Flex>
              <Heading size="lg" fontWeight="bold">
                <EditableLabel
                  initialValue={labels[pathString] || fieldKey}
                  onSave={(newLabel) => onLabelChange(pathString, newLabel)}
                />
              </Heading>
            </Flex>
          </Flex>
          <Flex gap={2}>
            <IconButton
              aria-label="Add Item"
              size="xs"
              onClick={handleAddItemClick}
              variant="surface"
              colorPalette="green"
              title="Add a new item to this list."
            >
              <MdAdd title="Add a new item to this list." />
            </IconButton>
            <IconButton
              aria-label="Delete List"
              size="xs"
              onClick={() => onRemoveFieldOrSection(currentPath)}
              colorPalette="red"
              variant="surface"
              title="Delete this list. Warning!! Destructive action."
            >
              <MdDeleteOutline title="Delete this list. Warning!! Destructive action." />
            </IconButton>
          </Flex>
        </Flex>
        <Collapsible.Content>
          <VStack align="stretch" gap={1} mt="2">
            {listItems.map((item, index) => {
              const itemPath = [...currentPath, String(index)];
              return (
                <React.Fragment key={index}>
                  <DraggableListItem
                    item={item}
                    index={index}
                    itemPath={itemPath}
                    handleItemChange={handleItemChange}
                    handleItemBlur={handleItemBlur}
                    handleRemoveItem={handleRemoveItemClick}
                    currentArrayPath={currentPath}
                    onReorderArrayItem={onReorderArrayItem}
                  />
                </React.Fragment>
              );
            })}
            <Box h="2px" ref={(node: HTMLDivElement | null) => dropList(node)} bg={isListOver && draggedListItem ? "primary" : "transparent"} />
          </VStack>
        </Collapsible.Content>

        {isListOver && draggedListItem && ( // Use isListOver and draggedListItem
          <Box position="absolute" top="0" left="0" right="0" bottom="0" display="flex" alignItems="center" justifyContent="center" bg="primary/10" pointerEvents="none">
            <Icon as={MdOutlineKeyboardDoubleArrowDown} boxSize={8} color="primary" />
          </Box>
        )}
      </Collapsible.Root>
    </GridItem>
  );
};

export default EditableListField;
