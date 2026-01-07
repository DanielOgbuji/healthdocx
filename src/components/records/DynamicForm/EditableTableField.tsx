import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  Flex,
  Box,
  GridItem,
  IconButton,
  Input,
  Icon,
  HStack,
  Table,
} from "@chakra-ui/react";
import {
  MdAdd,
  MdDeleteOutline,
  MdOutlineKeyboardDoubleArrowDown,
} from "react-icons/md";
import { DragHandle } from "./DragHandle";
import EditableLabel from "./EditableLabel";
import { useDrag, useDrop } from "react-dnd";
import { useSelection } from "@/hooks/useSelection";
import { PATH_SEPARATOR } from "@/utils/dynamicFormUtils";
import type { DragItem } from "@/types/dnd";
import { Collapsible } from "@chakra-ui/react";
import { useMergeRefs } from "@chakra-ui/hooks";
import { useDynamicFormContext } from "@/contexts/DynamicFormContext";
import { FieldHeader } from "./FieldHeader";

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

const DraggableTableRow = memo(({
  row,
  rowIndex,
  rowPath,
  columnHeaders,
  handleLocalCellChange,
  handleBlur,
  handleRemoveRow,
  currentArrayPath,
  onReorderArrayItem,
}: DraggableTableRowProps) => {
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
});

interface EditableTableFieldProps {
  fieldKey: string;
  value: Array<Record<string, string>>;
  currentPath: string[];
  pathString: string;
  depth: number;
}

const EditableTableField = memo(({
  fieldKey,
  value,
  currentPath,
  pathString,
  depth,
}: EditableTableFieldProps) => {
  const [localValue, setLocalValue] = useState(value);
  const { selectedItems } = useSelection();
  const {
    handleFieldChange,
    handleRemoveArrayItem,
    handleReorderArrayItem,
    handleMoveItem,
    handleAddArrayItem,
    newlyAddedPath,
    setNewlyAddedPath,
    isCollapsed,
    toggleCollapse,
  } = useDynamicFormContext();

  const gridItemRef = useRef<HTMLDivElement>(null);
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

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'field', // Treat table as a field for drag-and-drop
    item: { id: pathString, path: currentPath, type: 'field' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver, draggedItem }, drop] = useDrop(() => ({
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

  const mergedRefs = useMergeRefs(gridItemRef, drop as unknown as React.RefCallback<Element>);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const columnHeaders = React.useMemo(
    () => (localValue.length > 0 ? Object.keys(localValue[0]) : []),
    [localValue]
  );

  const handleLocalCellChange = useCallback((rowIndex: number, columnKey: string, newValue: string) => {
    setLocalValue(prev => {
      const updatedValue = [...prev];
      updatedValue[rowIndex] = { ...updatedValue[rowIndex], [columnKey]: newValue };
      return updatedValue;
    });
  }, []);

  const handleBlur = useCallback(() => {
    if (JSON.stringify(localValue) !== JSON.stringify(value)) {
      handleFieldChange(currentPath, localValue);
    }
  }, [localValue, value, currentPath, handleFieldChange]);

  const handleAddRow = useCallback(() => {
    const newRow: Record<string, string> = {};
    columnHeaders.forEach(header => (newRow[header] = ""));
    handleAddArrayItem(currentPath, newRow);
    setNewlyAddedPath([...currentPath, String(localValue.length)]);
  }, [currentPath, handleAddArrayItem, columnHeaders, localValue.length, setNewlyAddedPath]);

  const handleRemoveRow = useCallback(
    (index: number) => {
      handleRemoveArrayItem(currentPath, index);
    },
    [currentPath, handleRemoveArrayItem]
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
      handleFieldChange(currentPath, updatedValue);
    },
    [localValue, currentPath, handleFieldChange]
  );

  const handleAddColumn = useCallback(() => {
    const newColumnName = `New Column ${Date.now()}`;
    const updatedValue = localValue.map(row => ({ ...row, [newColumnName]: "" }));
    handleFieldChange(currentPath, updatedValue);
  }, [localValue, currentPath, handleFieldChange]);

  const handleRemoveColumn = useCallback((columnToRemove: string) => {
    const updatedValue = localValue.map(row => {
      const newRow = { ...row };
      delete newRow[columnToRemove];
      return newRow;
    });
    handleFieldChange(currentPath, updatedValue);
  }, [localValue, currentPath, handleFieldChange]);


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
      <Collapsible.Root open={!isCollapsed(pathString)} lazyMount unmountOnExit>

        <div ref={drag as unknown as React.RefCallback<HTMLDivElement>}>
          <FieldHeader
            pathString={pathString}
            fieldKey={fieldKey}
            depth={depth}
            isCollapsed={isCollapsed(pathString)}
            toggleCollapse={() => toggleCollapse(pathString)}
            dragHandleRef={drag as unknown as React.Ref<HTMLDivElement>}
            isHighlighted={isHighlighted}
            type="table"
            path={currentPath}
          />
        </div>

        <Collapsible.Content>
          <Box position="relative" width="full" overflowX="auto">
            {/* Custom Add Row Button here as Table is unique */}
            <Flex justifyContent="flex-end" mb="0" mr="1px" mt="1">
              <IconButton
                aria-label="Add Row"
                size="xs"
                onClick={handleAddRow}
                variant="surface"
                colorPalette="green"
                title="Add a new row."
                borderBottomRadius="0px"
              >
                <MdAdd />
              </IconButton>
            </Flex>

            <Table.ScrollArea borderWidth="1px" w="full" colorPalette="brand">
              <Table.Root size="sm" variant="outline" interactive showColumnBorder>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader w="6"></Table.ColumnHeader>
                    {columnHeaders.map((header) => (
                      <Table.ColumnHeader key={header} className="group">
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
                    <Table.ColumnHeader>
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
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {localValue.map((row, rowIndex) => {
                    const rowPath = [...currentPath, String(rowIndex)];
                    return (
                      <DraggableTableRow
                        key={rowIndex}
                        row={row}
                        rowIndex={rowIndex}
                        rowPath={rowPath}
                        columnHeaders={columnHeaders}
                        handleLocalCellChange={handleLocalCellChange}
                        handleBlur={handleBlur}
                        handleRemoveRow={handleRemoveRow}
                        currentArrayPath={currentPath}
                        onReorderArrayItem={handleReorderArrayItem}
                      />
                    );
                  })}
                  <Box h="2px" ref={(node: HTMLDivElement | null) => drop(node)} bg={isOver && draggedItem ? "primary" : "transparent"} />
                </Table.Body>
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
});

export default EditableTableField;
