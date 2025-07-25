import React, { useState, useEffect, useRef } from "react";
import { Input, GridItem, Field, Flex } from "@chakra-ui/react";
//import { useMergeRefs } from "@chakra-ui/hooks";
import EditableLabel from "./EditableLabel";
import { IconButton } from "@chakra-ui/react";
import { MdDeleteOutline } from "react-icons/md";
import { DragHandle } from "./DragHandle";
import { useDrag } from "react-dnd";
import { useSelection } from "@/hooks/useSelection";
import { Checkbox } from "@chakra-ui/react";

interface SingleFieldProps {
  fieldKey: string;
  value: unknown;
  currentPath: string[];
  pathString: string;
  onFieldChange: (path: string[], value: string) => void;
  labels: Record<string, string>;
  onLabelChange: (path: string, label: string) => void;
  onRemoveFieldOrSection: (path: string[]) => void;
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
}) => {
  const [inputValue, setInputValue] = useState(
    typeof value === "string" || typeof value === "number" ? value : ""
  );
  const { selectedItems, toggleSelection } = useSelection();
  const gridItemRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'field',
    item: { id: pathString.replace(/\./g, '_'), path: currentPath, type: 'field' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const mergedRefs = (node: HTMLDivElement | null) => {
    gridItemRef.current = node;
    drag(node);
  };

  useEffect(() => {
    setInputValue(
      typeof value === "string" || typeof value === "number" ? value : ""
    );
  }, [value]);

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
    >
      <Field.Root>
        <Field.Label htmlFor={pathString} gap="2" alignItems="center" my="2px" _groupHover={{ my: "0" }}>
          <Checkbox.Root
            checked={selectedItems.has(pathString)}
            onCheckedChange={() => toggleSelection(pathString)}
            title="Select this item."
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
          </Checkbox.Root>
          <DragHandle />
          <Flex gap="2" alignItems="center">
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
              title="Delete this field. Warning!! Destructive action."
            >
              <MdDeleteOutline title="Delete this field. Warning!! Destructive action." />
            </IconButton>
          </Flex>
        </Field.Label>
        <Input
          id={pathString}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => onFieldChange(currentPath, inputValue as string)}
          title="Click to edit value."
        />
      </Field.Root>
    </GridItem>
  );
};

export default SingleField;
