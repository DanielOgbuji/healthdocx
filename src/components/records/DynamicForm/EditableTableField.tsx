import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  GridItem,
  Flex,
  IconButton,
  Input,
  Checkbox,
  Icon,
  HStack,
  Heading,
  Table, // Import Table as a compound component
} from "@chakra-ui/react";
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
import { useMergeRefs } from "@chakra-ui/hooks";

interface DraggableTableRowProps {
  row: Record<string, string>;
  rowIndex: number;
  rowPath: string[];
  columnHeaders: string[];
  handleLocalCellChange: (rowIndex: number, columnKey: string, newValue: string) => void;
  handleBlur: () => void;
  handleRemoveRow: (index: number) => void;
  currentArrayPath: string[];
  onReorderArrayItem: (path: string[], fromIndex: number, toIndex: number) => void;
}

const DraggableTableRow: React.FC<DraggableTableRowProps> = ({
  row,
  rowIndex,
  rowPath,
  columnHeaders,
  handleLocalCellChange,
  handleBlur,
  handleRemoveRow,
  currentArrayPath,
  onReorderArrayItem,
}) => {
  const rowRef = useRef<HTMLTableRowElement>(null);
  const [, dragRow] = useDrag(() => ({
    type: 'table-row',
    item: { id: rowPath.join(PATH_SEPARATOR), path: rowPath, type: 'table-row', originalIndex: rowIndex },
  }));

  const [{ isOver, draggedItem }, dropRow] = useDrop(() => ({
    accept: 'table-row',
    drop: (dragged: DragItem) => {
      if (dragged.type === 'table-row' && dragged.originalIndex !== undefined) {
        onReorderArrayItem(currentArrayPath, dragged.originalIndex, rowIndex);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggedItem: monitor.getItem() as DragItem | null,
    }),
  }));

  const mergedRowRefs = useMergeRefs(rowRef, dragRow as unknown as React.RefCallback<Element>, dropRow as unknown as React.RefCallback<Element>);

  return (
    <Table.Row ref={mergedRowRefs} cursor="grab" position="relative">
      <Table.Cell>
        <DragHandle />
      </Table.Cell>
      {columnHeaders.map((header) => (
        <Table.Cell key={`${rowIndex}-${header}`}>
          <Input
            value={row[header] || ""}
            onChange={(e) => handleLocalCellChange(rowIndex, header, e.target.value)}
            onBlur={handleBlur}
            size="sm"
            variant="flushed"
            truncate
            lineClamp="2"
          />
        </Table.Cell>
      ))}
      <Table.Cell>
        <IconButton
          aria-label="Remove Row"
          size="xs"
          onClick={() => handleRemoveRow(rowIndex)}
          colorPalette="red"
          variant="ghost"
          title="Remove this row."
        >
          <MdDeleteOutline />
        </IconButton>
      </Table.Cell>
      {isOver && draggedItem && (
        <Box position="absolute" top="0" left="0" right="0" bottom="0" display="flex" alignItems="center" justifyContent="center" bg="primary/10" pointerEvents="none">
          <Icon as={MdOutlineKeyboardDoubleArrowDown} boxSize={8} color="primary" />
        </Box>
      )}
    </Table.Row>
  );
};

interface EditableTableFieldProps {
  fieldKey: string;
  value: Array<Record<string, string>>;
  currentPath: string[];
  pathString: string;
  onFieldChange: (path: string[], value: string | Array<Record<string, string>>) => void;
  labels: Record<string, string>;
  onLabelChange: (path: string, label: string) => void;
  onRemoveFieldOrSection: (path: string[]) => void;
  onMoveItem: (itemPath: string[], targetPath: string[], moveType?: "reorder" | "moveInto") => void;
  onAddArrayItem: (path: string[], item: Record<string, string> | string) => void;
  onRemoveArrayItem: (path: string[], index: number) => void;
  onReorderArrayItem: (path: string[], fromIndex: number, toIndex: number) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  depth: number;
  newlyAddedPath: string[] | null;
  setNewlyAddedPath: (path: string[] | null) => void;
}

const EditableTableField: React.FC<EditableTableFieldProps> = ({
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
  const [localValue, setLocalValue] = useState(value);
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
    type: 'field', // Treat table as a field for drag-and-drop
    item: { id: pathString, path: currentPath, type: 'field' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver, draggedItem }, drop] = useDrop(() => ({
    accept: ['field', 'section'],
    drop: (item: DragItem) => {
      onMoveItem(item.path, currentPath);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggedItem: monitor.getItem() as DragItem | null,
    }),
  }));

  // Removed useMergeRefs as it's not used after removing the import
  const mergedRefs = (node: HTMLDivElement | null) => {
    gridItemRef.current = node;
    // drag(node); // Removed from here
    drop(node);
  };

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const columnHeaders = React.useMemo(
    () => (localValue.length > 0 ? Object.keys(localValue[0]) : []),
    [localValue]
  );

  const handleLocalCellChange = (rowIndex: number, columnKey: string, newValue: string) => {
    const updatedValue = [...localValue];
    updatedValue[rowIndex] = { ...updatedValue[rowIndex], [columnKey]: newValue };
    setLocalValue(updatedValue);
  };

  const handleBlur = () => {
    if (JSON.stringify(localValue) !== JSON.stringify(value)) {
      onFieldChange(currentPath, localValue);
    }
  };

  const handleAddRow = useCallback(() => {
    const newRow: Record<string, string> = {};
    columnHeaders.forEach(header => (newRow[header] = ""));
    onAddArrayItem(currentPath, newRow);
    setNewlyAddedPath([...currentPath, String(localValue.length)]);
  }, [currentPath, onAddArrayItem, columnHeaders, localValue.length, setNewlyAddedPath]);

  const handleRemoveRow = useCallback(
    (index: number) => {
      onRemoveArrayItem(currentPath, index);
    },
    [currentPath, onRemoveArrayItem]
  );

  const handleColumnHeaderChange = useCallback(
    (oldHeader: string, newHeader: string) => {
      if (oldHeader === newHeader) return;

      const updatedValue = localValue.map((row) => {
        const newRow: Record<string, string> = {};
        Object.entries(row).forEach(([key, val]) => {
          if (key === oldHeader) {
            newRow[newHeader] = val;
          } else {
            newRow[key] = val;
          }
        });
        return newRow;
      });
      onFieldChange(currentPath, updatedValue);
    },
    [localValue, currentPath, onFieldChange]
  );

  const handleAddColumn = useCallback(() => {
    const newColumnName = `New Column ${Date.now()}`;
    const updatedValue = localValue.map(row => ({ ...row, [newColumnName]: "" }));
    onFieldChange(currentPath, updatedValue);
  }, [localValue, currentPath, onFieldChange]);

  const handleRemoveColumn = useCallback((columnToRemove: string) => {
    const updatedValue = localValue.map(row => {
      const newRow = { ...row };
      delete newRow[columnToRemove];
      return newRow;
    });
    onFieldChange(currentPath, updatedValue);
  }, [localValue, currentPath, onFieldChange]);


  return (
    <GridItem
      colSpan={{ base: 1, lg: 2 }}
      ref={mergedRefs}
      opacity={isDragging ? 0.5 : 1}
      border={selectedItems.has(pathString) ? "2px dotted" : "none"}
      borderColor={selectedItems.has(pathString) ? "primary" : "none"}
      borderRadius="md"
      p="1"
      title={pathString}
      cursor={isDragging ? "grabbing" : "default"}
      className="group"
      colorPalette="brand"
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
                  aria-label={isCollapsed ? "Expand table" : "Collapse table"}
                  size="xs"
                  variant="surface"
                  colorPalette="brand"
                  title={isCollapsed ? "Expand this table." : "Collapse this table."}
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
              <Box ref={drag} cursor="grab">
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
              aria-label="Add Row"
              size="xs"
              onClick={handleAddRow}
              variant="surface"
              colorPalette="green"
              title="Add a new row to this table."
            >
              <MdAdd title="Add a new row to this table." />
            </IconButton>
            <IconButton
              aria-label="Delete Table"
              size="xs"
              onClick={() => onRemoveFieldOrSection(currentPath)}
              colorPalette="red"
              variant="surface"
              title="Delete this table. Warning!! Destructive action."
            >
              <MdDeleteOutline title="Delete this table. Warning!! Destructive action." />
            </IconButton>
          </Flex>
        </Flex>
        <Collapsible.Content>
          <Box position="relative" width="full" overflowX="auto">
            <Table.ScrollArea borderWidth="1px" w="full" colorPalette="brand">
              <Table.Root size="sm" variant="outline" interactive showColumnBorder>
                <Table.Header> {/* Corrected from Table.Thead */}
                  <Table.Row> {/* Corrected from Table.Tr */}
                    <Table.ColumnHeader w="6"></Table.ColumnHeader> {/* Corrected from Table.Th */}
                    {columnHeaders.map((header) => (
                      <Table.ColumnHeader key={header} className="group"> {/* Corrected from Table.Th */}
                        <HStack justifyContent="space-between">
                          <EditableLabel
                            initialValue={header}
                            onSave={(newLabel) => handleColumnHeaderChange(header, newLabel)}
                          />
                          <IconButton
                            display="none"
                            _groupHover={{ display: "flex" }}
                            aria-label="Remove Column"
                            size="2xs"
                            onClick={() => handleRemoveColumn(header)}
                            colorPalette="red"
                            rounded="full"
                            variant="outline"
                            title="Remove this column."
                          >
                            <MdDeleteOutline />
                          </IconButton>
                        </HStack>
                      </Table.ColumnHeader>
                    ))}
                    <Table.ColumnHeader> {/* Corrected from Table.Th */}
                      <IconButton
                        aria-label="Add Column"
                        size="xs"
                        onClick={handleAddColumn}
                        variant="ghost"
                        colorPalette="green"
                        title="Add a new column."
                      >
                        <MdAdd />
                      </IconButton>
                    </Table.ColumnHeader>
                  </Table.Row> {/* Corrected from Table.Tr */}
                </Table.Header> {/* Corrected from Table.Thead */}
                <Table.Body> {/* Corrected from Table.Tbody */}
                  {localValue.map((row, rowIndex) => {
                    const rowPath = [...currentPath, String(rowIndex)];
                    return (
                      <React.Fragment key={rowIndex}>
                        <DraggableTableRow
                          row={row}
                          rowIndex={rowIndex}
                          rowPath={rowPath}
                          columnHeaders={columnHeaders}
                          handleLocalCellChange={handleLocalCellChange}
                          handleBlur={handleBlur}
                          handleRemoveRow={handleRemoveRow}
                          currentArrayPath={currentPath}
                          onReorderArrayItem={onReorderArrayItem}
                        />
                      </React.Fragment>
                    );
                  })}
                  <Box h="2px" ref={(node: HTMLDivElement | null) => drop(node)} bg={isOver && draggedItem ? "primary" : "transparent"} />
                </Table.Body> {/* Corrected from Table.Tbody */}
              </Table.Root>
            </Table.ScrollArea>
            {isOver && draggedItem && (
              <Box position="absolute" top="0" left="0" right="0" bottom="0" display="flex" alignItems="center" justifyContent="center" bg="primary/10" pointerEvents="none">
                <Icon as={MdOutlineKeyboardDoubleArrowDown} boxSize={8} color="primary" />
              </Box>
            )}
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </GridItem>
  );
};

export default EditableTableField;
