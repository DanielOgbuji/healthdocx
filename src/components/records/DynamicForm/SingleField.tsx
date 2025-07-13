import React, { useState, useEffect } from "react";
import { Input, GridItem, Field } from "@chakra-ui/react";
import EditableLabel from "./EditableLabel";
import { IconButton } from "@chakra-ui/react";
import { MdDeleteOutline } from "react-icons/md";

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

  useEffect(() => {
    setInputValue(
      typeof value === "string" || typeof value === "number" ? value : ""
    );
  }, [value]);

  return (
    <GridItem colSpan={1} colorPalette="brand">
      <Field.Root>
        <Field.Label htmlFor={pathString} gap="2">
          <EditableLabel
            initialValue={labels[pathString] || fieldKey}
            onSave={(newLabel) => onLabelChange(pathString, newLabel)}
          />
          <IconButton
            aria-label="Delete Field"
            size="2xs"
            onClick={() => onRemoveFieldOrSection(currentPath)}
            colorPalette="red"
            rounded="full"
            variant="outline"
          >
            <MdDeleteOutline />
          </IconButton>
        </Field.Label>
        <Input
          id={pathString}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => onFieldChange(currentPath, inputValue as string)}
        />
      </Field.Root>
    </GridItem>
  );
};

export default SingleField;