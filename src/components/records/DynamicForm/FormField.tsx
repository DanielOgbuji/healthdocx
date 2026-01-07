import React, { useRef, useState, memo } from "react";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useMergeRefs } from "@chakra-ui/hooks";
import { useDrag, useDrop } from "react-dnd";
import { useSelection } from "@/hooks/useSelection";
import { PATH_SEPARATOR } from "@/utils/dynamicFormUtils";
import type { DragItem } from "@/types/dnd";
import { Collapsible } from "@chakra-ui/react";
import { useDynamicFormContext } from "@/contexts/DynamicFormContext";
import { FieldHeader } from "./FieldHeader";
import { FieldRenderer } from "./FieldRenderer";

interface FormFieldProps {
  depth?: number;
  data: Record<string, unknown>;
  path: string[];
  fieldKey: string; // Added fieldKey prop to be consistent with others
}

const FormField = memo(({
  depth = 0,
  data,
  path,
  fieldKey
}: FormFieldProps) => {
  const pathString = path.join(PATH_SEPARATOR);
  const { selectedItems } = useSelection();
  const { handleMoveItem, isCollapsed, toggleCollapse, newlyAddedPath, setNewlyAddedPath } = useDynamicFormContext();

  const boxRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null); // Passed to FieldHeader for drag handle if needed? Actually simpler: FieldHeader has handle.
  // Actually, standard drag handle is inside header.

  const gridItemRef = useRef<HTMLDivElement>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  React.useLayoutEffect(() => {
    if (newlyAddedPath && newlyAddedPath.join(PATH_SEPARATOR) === pathString && boxRef.current) {
      requestAnimationFrame(() => {
        boxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  const [{ isOverBody }, dropBody] = useDrop(() => ({
    accept: ['field', 'section'],
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      if (item.path.join(PATH_SEPARATOR) !== pathString) {
        handleMoveItem(item.path, path, "moveInto");
      }
    },
    collect: (monitor) => ({
      isOverBody: monitor.isOver({ shallow: true }),
    }),
  }));

  const [{ isOverHeader }, dropHeader] = useDrop(() => ({
    accept: 'section',
    drop: (item: DragItem) => {
      if (item.path.join(PATH_SEPARATOR) !== pathString) {
        handleMoveItem(item.path, path, 'reorder');
      }
    },
    collect: (monitor) => ({
      isOverHeader: monitor.isOver({ shallow: true }),
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
  const mergedDropRefs = useMergeRefs(gridItemRef, dropBody as unknown as React.RefCallback<Element>);
  const mergedHeaderRefs = useMergeRefs(headerRef, dropHeader as unknown as React.RefCallback<Element>);

  return (
    <GridItem
      key={pathString}
      colSpan={{ base: 1, lg: 2 }}
      ref={mergedDropRefs}
      border={isOverBody && !isOverHeader ? "2px dashed" : "none"}
      borderColor={isOverBody && !isOverHeader ? "primary" : "none"}
      colorPalette="brand"
    >
      <Collapsible.Root
        lazyMount
        unmountOnExit
        open={!isCollapsed(pathString)}
      >
        <Box
          ref={mergedDragRefs}
          borderRadius="md"
          p="1"
          opacity={isDragging ? 0.5 : 1}
          border={selectedItems.has(pathString) ? "2px dotted" : "none"}
          borderColor={selectedItems.has(pathString) ? "primary" : "none"}
          transition="box-shadow 0.3s ease-in-out"
          title={path[path.length - 1]} // Fallback if no label is confusing, but header shows label.
        >
          {/* Header Section */}
          <div ref={mergedHeaderRefs}>
            <FieldHeader
              pathString={pathString}
              fieldKey={fieldKey}
              depth={depth}
              isCollapsed={isCollapsed(pathString)}
              toggleCollapse={() => toggleCollapse(pathString)}
              isHighlighted={isHighlighted}
              type="section"
              path={path}
            />
          </div>

          <Collapsible.Content p="1" pt="0">
            <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
              <FieldRenderer data={data} path={path} depth={depth} />
            </Grid>
          </Collapsible.Content>

        </Box>
      </Collapsible.Root>
    </GridItem >
  );
});

export default FormField;
