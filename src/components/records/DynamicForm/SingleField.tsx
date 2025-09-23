import React, { useState, useEffect, useRef } from "react";
import { Input, GridItem, Field, Flex, Float, Circle } from "@chakra-ui/react";
import EditableLabel from "./EditableLabel";
import { IconButton, Icon } from "@chakra-ui/react";
import { MdDeleteOutline, MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import { DragHandle } from "./DragHandle";
import { useDrag, useDrop } from "react-dnd";
import { useSelection } from "@/hooks/useSelection";
import { Checkbox } from "@chakra-ui/react";
import { PATH_SEPARATOR } from "@/utils/dynamicFormUtils";

interface SingleFieldProps {
  fieldKey: string;
  value: unknown;
  currentPath: string[];
  pathString: string;
  onFieldChange: (path: string[], value: string) => void;
  labels: Record<string, string>;
  onLabelChange: (path: string, label: string) => void;
  onRemoveFieldOrSection: (path: string[]) => void;
  onMoveItem: (itemPath: string[], targetPath: string[]) => void;
  newlyAddedPath: string[] | null;
  setNewlyAddedPath: (path: string[] | null) => void;
}

const SingleField: React.FC<SingleFieldProps> = ({
  fieldKey,
  value,
  currentPath,
  pathString,
  onFieldChange,
  labels,
  onLabelChange,
  onRemoveFieldOrSection,
  onMoveItem,
  newlyAddedPath,
  setNewlyAddedPath,
}) => {
  const [inputValue, setInputValue] = useState(
    typeof value === "string" || typeof value === "number" ? value : ""
  );
  const { selectedItems, toggleSelection } = useSelection();
  const gridItemRef = useRef<HTMLDivElement>(null);
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

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'field',
    item: { id: pathString, path: currentPath, type: 'field' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver, draggedItem }, drop] = useDrop(() => ({
    accept: ['field', 'section'],
    drop: (item: { path: string[] }) => {
      onMoveItem(item.path, currentPath);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggedItem: monitor.getItem() as { path: string[] } | null,
    }),
  }));

  const mergedRefs = (node: HTMLDivElement | null) => {
    gridItemRef.current = node;
    drag(node);
    drop(node);
  };

  useEffect(() => {
    setInputValue(
      typeof value === "string" || typeof value === "number" ? value : ""
    );
  }, [value]);

  const handleBlur = () => {
    if (inputValue !== value) {
      onFieldChange(currentPath, inputValue as string);
    }
  };

  return (
    <GridItem
      colSpan={1}
      ref={mergedRefs}
      opacity={isDragging ? 0.5 : 1}
      border={selectedItems.has(pathString) ? "2px dotted" : "none"}
      borderColor={selectedItems.has(pathString) ? "secondary" : "none"}
      p="1"
      title={pathString}
      cursor={isDragging ? "grabbing" : "grab"}
      className="group"
      //boxShadow={isHighlighted ? "0px 0px 20px var(--shadow-color)" : "none"}
      //scale={isHighlighted ? "1.01" : "1"}
      transition="scale 0.25s ease-in-out"
      shadowColor="onBackground/20"
    >
      <Field.Root>
        <Field.Label htmlFor={pathString} gap="2" alignItems="center">
          <Checkbox.Root
            checked={selectedItems.has(pathString)}
            onCheckedChange={() => toggleSelection(pathString)}
            title="Select this item."
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
          </Checkbox.Root>
          <DragHandle />
          <Flex gap="2" alignItems="center" scale={isHighlighted ? "1.05" : "1"} textShadow={isHighlighted ? "0 0 10px var(--shadow-color)" : "none"} shadowColor="onBackground/50" color={isHighlighted ? "primary" : "inherit"} transition="all 0.3s ease-in-out">
            <EditableLabel
              initialValue={labels[pathString] || fieldKey}
              onSave={(newLabel) => onLabelChange(pathString, newLabel)}
            />
            <IconButton
              display="none"
              _groupHover={{ display: "flex" }}
              aria-label="Delete Field"
              size="2xs"
              onClick={() => onRemoveFieldOrSection(currentPath)}
              colorPalette="red"
              rounded="full"
              variant="outline"
              ml="auto"
              my="-2px"
              title="Delete this field. Warning!! Destructive action."
            >
              <MdDeleteOutline title="Delete this field. Warning!! Destructive action." />
            </IconButton>
          </Flex>
        </Field.Label>
        <Flex position="relative" width="full">
          <Input
            id={pathString}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            title="Click to edit value."
            mt="2px"
          />
          {isOver && draggedItem && (
            <Float offset="1">
              <Circle size="6" bg="primary/40" color="white" borderStyle="solid" borderColor="primary" borderWidth="1px">
                <Icon as={MdOutlineKeyboardDoubleArrowDown} size="sm" />
              </Circle>
            </Float>
          )}
        </Flex>
      </Field.Root>
    </GridItem>
  );
};

export default SingleField;
