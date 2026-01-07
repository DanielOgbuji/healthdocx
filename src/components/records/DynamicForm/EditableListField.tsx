import React, { useRef, useCallback, useState, useEffect, memo } from "react";
import {
  Box,
  GridItem,
  IconButton,
  Input,
  Icon,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useMergeRefs } from "@chakra-ui/hooks";
import {
  MdDeleteOutline,
  MdOutlineKeyboardDoubleArrowDown,
} from "react-icons/md";
import { DragHandle } from "./DragHandle";
import { useDrag, useDrop } from "react-dnd";
import { PATH_SEPARATOR } from "@/utils/dynamicFormUtils";
import type { DragItem } from "@/types/dnd";
import { Collapsible } from "@chakra-ui/react";
import { useSelection } from "@/hooks/useSelection";
import { useDynamicFormContext } from "@/contexts/DynamicFormContext";
import { FieldHeader } from "./FieldHeader";

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

const DraggableListItem = memo(({
  item,
  index,
  itemPath,
  handleItemChange,
  handleItemBlur,
  handleRemoveItem,
  currentArrayPath,
  onReorderArrayItem,
}: DraggableListItemProps) => {
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
      position="relative"
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
});

interface EditableListFieldProps {
  fieldKey: string;
  value: string[];
  currentPath: string[];
  pathString: string;
  depth: number;
}

const EditableListField = memo(({
  fieldKey,
  value,
  currentPath,
  pathString,
  depth,
}: EditableListFieldProps) => {
  const { selectedItems } = useSelection();
  const {
    handleFieldChange,
    handleRemoveArrayItem,
    handleReorderArrayItem,
    handleMoveItem,
    newlyAddedPath,
    setNewlyAddedPath,
    isCollapsed,
    toggleCollapse
  } = useDynamicFormContext();

  const gridItemRef = useRef<HTMLDivElement>(null);
  const [listItems, setListItems] = useState(value);
  const [isHighlighted, setIsHighlighted] = useState(false);

  React.useLayoutEffect(() => {
    if (newlyAddedPath && newlyAddedPath.join(PATH_SEPARATOR) === pathString && gridItemRef.current) {
      requestAnimationFrame(() => {
        gridItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      setNewlyAddedPath(null);
      setIsHighlighted(true);
    }
  }, [newlyAddedPath, pathString, setNewlyAddedPath]);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isHighlighted) {
      timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 1200);
    }
    return () => clearTimeout(timer);
  }, [isHighlighted]);

  useEffect(() => {
    setListItems(value);
  }, [value]);

  const [{ isDragging: isListDragging }, dragList] = useDrag(() => ({
    type: 'field',
    item: { id: pathString, path: currentPath, type: 'field' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver: isListOver, draggedItem: draggedListItem }, dropList] = useDrop(() => ({
    accept: ['field', 'section'],
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) return;
      handleMoveItem(item.path, currentPath);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      draggedItem: monitor.getItem() as DragItem | null,
    }),
  }));

  // We need to attach drag ref to Drag Handle (in FieldHeader) and drop ref to container


  // Actually, we pass drag ref to FieldHeader.
  // And dropList to container.

  const mergedListRefs = useMergeRefs(gridItemRef, dropList as unknown as React.RefCallback<Element>);

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
      handleFieldChange(currentPath, listItems);
    }
  }, [listItems, value, currentPath, handleFieldChange]);


  const handleRemoveItemClick = useCallback(
    (index: number) => {
      handleRemoveArrayItem(currentPath, index);
    },
    [currentPath, handleRemoveArrayItem]
  );

  return (
    <GridItem
      colSpan={{ base: 1, lg: 2 }}
      ref={mergedListRefs}
      opacity={isListDragging ? 0.5 : 1}
      border={selectedItems.has(pathString) ? "2px dotted" : "none"}
      borderColor={selectedItems.has(pathString) ? "secondary" : "none"}
      p="1"
      title={pathString}
      cursor={isListDragging ? "grabbing" : "default"}
      className="group"
    >
      <Collapsible.Root open={!isCollapsed(pathString)} lazyMount unmountOnExit>

        <div ref={dragList as unknown as React.RefCallback<HTMLDivElement>}>
          <FieldHeader
            pathString={pathString}
            fieldKey={fieldKey}
            depth={depth}
            isCollapsed={isCollapsed(pathString)}
            toggleCollapse={() => toggleCollapse(pathString)}
            dragHandleRef={dragList as unknown as React.Ref<HTMLDivElement>} // Pass drag ref
            isHighlighted={isHighlighted}
            type="list"
            path={currentPath}
          />
        </div>

        <Collapsible.Content>
          <VStack align="stretch" gap={1} mt="2">
            {listItems.map((item, index) => {
              const itemPath = [...currentPath, String(index)];
              return (
                <DraggableListItem
                  key={index}
                  item={item}
                  index={index}
                  itemPath={itemPath}
                  handleItemChange={handleItemChange}
                  handleItemBlur={handleItemBlur}
                  handleRemoveItem={handleRemoveItemClick}
                  currentArrayPath={currentPath}
                  onReorderArrayItem={handleReorderArrayItem}
                />
              );
            })}
            {/* Drop zone visual feedback */}
            <Box h="2px" bg={isListOver && draggedListItem ? "primary" : "transparent"} />
          </VStack>
        </Collapsible.Content>

        {isListOver && draggedListItem && (
          <Box position="absolute" top="0" left="0" right="0" bottom="0" display="flex" alignItems="center" justifyContent="center" bg="primary/10" pointerEvents="none">
            <Icon as={MdOutlineKeyboardDoubleArrowDown} boxSize={8} color="primary" />
          </Box>
        )}
      </Collapsible.Root>
    </GridItem>
  );
});

export default EditableListField;
