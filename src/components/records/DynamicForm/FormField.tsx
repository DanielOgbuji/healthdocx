import React, { useRef } from "react";
import { Box, Grid, GridItem, Flex, Heading, IconButton } from "@chakra-ui/react";
import { useMergeRefs } from "@chakra-ui/hooks";
import EditableLabel from "./EditableLabel";
import SingleField from "./SingleField";
import { MdAdd, MdTextFields, MdDeleteOutline } from "react-icons/md";
import { DragHandle } from "./DragHandle";
import { useDrag, useDrop } from "react-dnd";
import { useSelection } from "@/hooks/useSelection";
import { Checkbox } from "@chakra-ui/react";

interface FormFieldProps {
  depth?: number;
  data: Record<string, unknown>;
  path: string[];
  onFieldChange: (path: string[], value: string) => void;
  labels: Record<string, string>;
  onLabelChange: (path: string, label: string) => void;
  onAddSection: (path: string[]) => void;
  onAddField: (path: string[]) => void;
  onRemoveFieldOrSection: (path: string[]) => void;
  onMoveItem: (fromPath: string[], toPath: string[]) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  depth = 0,
  data,
  path,
  onFieldChange,
  labels,
  onLabelChange,
  onAddSection,
  onAddField,
  onRemoveFieldOrSection,
  onMoveItem,
}) => {
  const pathString = path.join('.');
  const { selectedItems, toggleSelection } = useSelection();
  const boxRef = useRef<HTMLDivElement>(null);
  const gridItemRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['field', 'section'],
    drop: (item: { path: string[] }) => {
      if (item.path.join('.') !== pathString) {
        onMoveItem(item.path, path);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'section',
    item: { id: pathString, path, type: 'section' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const mergedDragRefs = useMergeRefs(boxRef, drag as unknown as React.RefCallback<Element>);
  const mergedDropRefs = useMergeRefs(gridItemRef, drop as unknown as React.RefCallback<Element>);

  return (
    <GridItem
      key={pathString}
      colSpan={{ base: 1, md: 2 }}
      ref={mergedDropRefs}
      border={isOver ? "2px dashed" : "none"}
      borderColor={isOver ? "primary" : "none"}
      colorPalette="brand"
    >
      <Box
        ref={mergedDragRefs}
        borderRadius="md"
        pb={0}
        p="2"
        opacity={isDragging ? 0.5 : 1}
        border={selectedItems.has(pathString) ? "2px dotted" : "none"}
        borderColor={selectedItems.has(pathString) ? "primary" : "none"}
      >
        <Flex
          bg={{
            _light: depth === 0 ? "primaryContainer/10" : "primaryContainer/10",
            _dark: depth === 0 ? "outlineVariant/20" : "outlineVariant/20"
          }}
          borderWidth={depth === 0 ? "1px" : "0 0 1px 0"}
          borderColor="outlineVariant"
          borderRadius={depth === 0 ? "md" : "none"}
          p={4}
          mt={depth === 0 ? 0 : 0}
          alignItems={{ base: "start", md: "center" }}
          mb={depth === 0 ? 6 : 4}
          px="4"
          gap="4"
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
        >
          <Flex gap="3" alignItems="center">
            <Checkbox.Root
              checked={selectedItems.has(pathString)}
              onCheckedChange={() => toggleSelection(pathString)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control ml="2" />
            </Checkbox.Root>
            <DragHandle />
            <Heading size="lg" fontWeight="bold">
              <EditableLabel
                initialValue={labels[pathString] || path[path.length - 1]}
                onSave={(newLabel) => onLabelChange(pathString, newLabel)}
              />
            </Heading>
          </Flex>
          <Flex gap={2}>
            <IconButton
              aria-label="Add Section"
              size="xs"
              onClick={() => onAddSection(path)}
              variant="surface"
              colorPalette="green"
            >
              <MdAdd />
            </IconButton>
            <IconButton
              aria-label="Add Field"
              size="xs"
              onClick={() => onAddField(path)}
              variant="surface"
              colorPalette="green"
            >
              <MdTextFields />
            </IconButton>
            <IconButton
              aria-label="Delete Section"
              size="xs"
              onClick={() => onRemoveFieldOrSection(path)}
              colorPalette="red"
              variant="surface"
            >
              <MdDeleteOutline />
            </IconButton>
          </Flex>
        </Flex>
        <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
          {Object.entries(data)
            .filter(([, value]) => typeof value !== "object" || value === null || Array.isArray(value))
            .map(([key, value]) => {
              const currentPath = [...path, key];
              const currentPathString = currentPath.join('.');
              return (
                <SingleField
                  key={currentPathString}
                  fieldKey={key}
                  value={value}
                  currentPath={currentPath}
                  pathString={currentPathString}
                  onFieldChange={onFieldChange}
                  labels={labels}
                  onLabelChange={onLabelChange}
                  onRemoveFieldOrSection={onRemoveFieldOrSection}
                />
              );
            })}
          {Object.entries(data)
            .filter(([, value]) => typeof value === "object" && value !== null && !Array.isArray(value))
            .map(([key, value]) => {
              const currentPath = [...path, key];
              const currentPathString = currentPath.join('.');
              return (
                <FormField
                  key={currentPathString}
                  depth={depth + 1}
                  data={value as Record<string, unknown>}
                  path={currentPath}
                  onFieldChange={onFieldChange}
                  labels={labels}
                  onLabelChange={onLabelChange}
                  onAddSection={onAddSection}
                  onAddField={onAddField}
                  onRemoveFieldOrSection={onRemoveFieldOrSection}
                  onMoveItem={onMoveItem}
                />
              );
            })}
        </Grid>
      </Box>
    </GridItem>
  );
};

export default FormField;
