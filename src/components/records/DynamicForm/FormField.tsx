import React, { useRef, useState } from "react";
import { Box, Grid, GridItem, Flex, Heading, Icon, IconButton, Checkbox, Collapsible } from "@chakra-ui/react";
import { useMergeRefs } from "@chakra-ui/hooks";
import EditableLabel from "./EditableLabel";
import SingleField from "./SingleField";
import { MdAdd, MdTextFields, MdDeleteOutline, MdExpandMore, MdExpandLess } from "react-icons/md";
import { DragHandle } from "./DragHandle";
import { useDrag, useDrop } from "react-dnd";
import { useSelection } from "@/hooks/useSelection";

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
  newlyAddedPath: string[] | null;
  setNewlyAddedPath: (path: string[] | null) => void;
  isCollapsed: (pathString: string) => boolean;
  toggleCollapse: (pathString: string) => void;
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
  newlyAddedPath,
  setNewlyAddedPath,
  isCollapsed,
  toggleCollapse
}) => {
  const pathString = path.join('_');
  const { selectedItems, toggleSelection } = useSelection();
  const boxRef = useRef<HTMLDivElement>(null);
  const gridItemRef = useRef<HTMLDivElement>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  React.useEffect(() => {
    if (newlyAddedPath && newlyAddedPath.join('_') === pathString && boxRef.current) {
      boxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setNewlyAddedPath(null); // Reset after scrolling
      setIsHighlighted(true); // Trigger highlight after scroll
    }
  }, [newlyAddedPath, pathString, setNewlyAddedPath]);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isHighlighted) {
      timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 1000); // Highlight for 1 second
    }
    return () => clearTimeout(timer);
  }, [isHighlighted]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['field', 'section'],
    drop: (item: { path: string[] }, monitor) => {
      if (monitor.didDrop()) {
        return; // If a child has already handled the drop, do nothing
      }
      if (item.path.join('_') !== pathString) {
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
      colSpan={{ base: 1, lg: 2 }}
      ref={mergedDropRefs}
      border={isOver ? "2px dashed" : "none"}
      borderColor={isOver ? "primary" : "none"}
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
          //pb={0}
          p="1"
          opacity={isDragging ? 0.5 : 1}
          border={selectedItems.has(pathString) ? "2px dotted" : "none"}
          borderColor={selectedItems.has(pathString) ? "primary" : "none"}
          transition="box-shadow 0.3s ease-in-out"
          title={labels[pathString] || path[path.length - 1]}
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
            boxShadow={isHighlighted ? "0px 0px 30px var(--shadow-color)" : "none"}
            scale={isHighlighted ? "1.01" : "1"}
            transition="scale 0.25s ease-in-out"
            shadowColor="onBackground/20"
            justifyContent="space-between"
            direction={{ base: "column", md: "row" }}
            className="group"
          >
            <Flex gap={{ base: "4", md: "1" }} alignItems={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} justifyContent="center">
              <Flex gap={{ base: "2", md: "3" }} alignItems="center" mr="2">
                <Collapsible.Trigger
                  onClick={() => toggleCollapse(pathString)}
                  as="a"
                >
                  <IconButton
                    aria-label="Add Section"
                    size="xs"
                    variant="surface"
                    colorPalette="brand"
                    title={isCollapsed(pathString) ? "Expand this section." : "Collapse this section."}
                  >
                    {isCollapsed(pathString) ? <Icon as={MdExpandMore} boxSize={5} /> : <Icon as={MdExpandLess} boxSize={5} />}
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
                <DragHandle />
              </Flex>
              <Flex>
                <Heading size="lg" fontWeight="bold">
                  <EditableLabel
                    initialValue={labels[pathString] || path[path.length - 1]}
                    onSave={(newLabel) => onLabelChange(pathString, newLabel)}
                  />
                </Heading>
              </Flex>
            </Flex>
            <Flex gap={2}>
              <IconButton
                aria-label="Add Section"
                size="xs"
                onClick={() => onAddSection(path)}
                variant="surface"
                colorPalette="green"
                title="Add a subsection to this section."
              >
                <MdAdd title="Add a subsection to this section." />
              </IconButton>
              <IconButton
                aria-label="Add Field"
                size="xs"
                onClick={() => onAddField(path)}
                variant="surface"
                colorPalette="green"
                title="Add a text field to this section."
              >
                <MdTextFields title="Add a text field to this section." />
              </IconButton>
              <IconButton
                aria-label="Delete Section"
                size="xs"
                onClick={() => onRemoveFieldOrSection(path)}
                colorPalette="red"
                variant="surface"
                title="Delete this section. Warning!! Destructive action."
              >
                <MdDeleteOutline title="Delete this section. Warning!! Destructive action." />
              </IconButton>
            </Flex>
          </Flex>


          <Collapsible.Content p="1" pt="0">
            <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
              {Object.entries(data)
                .filter(([, value]) => typeof value !== "object" || value === null || Array.isArray(value))
                .map(([key, value]) => {
                  const currentPath = [...path, key];
                  const currentPathString = currentPath.join('_');
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
                      onMoveItem={onMoveItem}
                    />
                  );
                })}
              {Object.entries(data)
                .filter(([, value]) => typeof value === "object" && value !== null && !Array.isArray(value))
                .map(([key, value]) => {
                  const currentPath = [...path, key];
                  const currentPathString = currentPath.join('_');
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
                      newlyAddedPath={newlyAddedPath}
                      setNewlyAddedPath={setNewlyAddedPath}
                      isCollapsed={isCollapsed}
                      toggleCollapse={toggleCollapse}
                    />
                  );
                })}
            </Grid>
          </Collapsible.Content>

        </Box>
      </Collapsible.Root>
    </GridItem >
  );
};

export default FormField;
