import React, { useState, useEffect } from "react";
import { Input, GridItem, Field } from "@chakra-ui/react";
import EditableLabel from "./EditableLabel";
import { formatLabel } from "@/utils/dynamicFormUtils";

interface SingleFieldProps {
  fieldKey: string;
  value: unknown;
  currentPath: string[];
  pathString: string;
  onFieldChange: (path: string[], value: string) => void;
  labels: Record<string, string>;
  onLabelChange: (path: string, label: string) => void;
}

const SingleField: React.FC<SingleFieldProps> = ({
  fieldKey,
  value,
  currentPath,
  pathString,
  onFieldChange,
  labels,
  onLabelChange,
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
        <Field.Label htmlFor={pathString}>
          <EditableLabel
            initialValue={labels[pathString] || formatLabel(fieldKey)}
            onSave={(newLabel) => onLabelChange(pathString, newLabel)}
          />
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