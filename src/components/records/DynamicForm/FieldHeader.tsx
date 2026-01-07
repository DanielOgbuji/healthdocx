import React, { memo } from "react";
import { Flex, Heading, IconButton, Checkbox, Box, Icon } from "@chakra-ui/react";
import { MdAdd, MdTextFields, MdDeleteOutline, MdExpandMore, MdExpandLess } from "react-icons/md";
import { DragHandle } from "./DragHandle";
import EditableLabel from "./EditableLabel";
import { Collapsible } from "@chakra-ui/react";
import { useSelection } from "@/hooks/useSelection";
import { useDynamicFormContext } from "@/contexts/DynamicFormContext";

interface FieldHeaderProps {
    pathString: string;
    fieldKey: string;
    depth: number;
    isCollapsed: boolean;
    toggleCollapse: () => void;
    dragHandleRef?: React.Ref<HTMLDivElement>;
    isHighlighted?: boolean;
    type: "section" | "list" | "table";
    path: string[];
}

export const FieldHeader = memo(({
    pathString,
    fieldKey,
    depth,
    isCollapsed,
    toggleCollapse,
    dragHandleRef,
    isHighlighted,
    type,
    path
}: FieldHeaderProps) => {
    const { selectedItems, toggleSelection } = useSelection();
    const {
        handleLabelChange,
        handleAddSection,
        handleAddField,
        handleRemoveFieldOrSection,
        labels,
        handleAddArrayItem
    } = useDynamicFormContext();

    const label = labels[pathString] || fieldKey;

    return (
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
                            aria-label={isCollapsed ? "Expand" : "Collapse"}
                            size="xs"
                            variant="surface"
                            colorPalette="brand"
                            title={isCollapsed ? "Expand" : "Collapse"}
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
                    <Box ref={dragHandleRef} cursor="grab">
                        {/* Only render drag handle if ref is provided, consistent with previous implementation */}
                        {dragHandleRef && (
                            <Flex mx="auto">
                                <DragHandle />
                            </Flex>
                        )}
                    </Box>
                </Flex>
                <Flex>
                    <Heading size="lg" fontWeight="bold">
                        <EditableLabel
                            initialValue={label}
                            onSave={(newLabel) => handleLabelChange(pathString, newLabel)}
                        />
                    </Heading>
                </Flex>
            </Flex>

            <Flex gap={2}>
                {type === "section" && (
                    <>
                        <IconButton
                            aria-label="Add Section"
                            size="xs"
                            onClick={() => handleAddSection(path)}
                            variant="surface"
                            colorPalette="green"
                            title="Add a subsection."
                        >
                            <MdAdd />
                        </IconButton>
                        <IconButton
                            aria-label="Add Field"
                            size="xs"
                            onClick={() => handleAddField(path)}
                            variant="surface"
                            colorPalette="green"
                            title="Add a text field."
                        >
                            <MdTextFields />
                        </IconButton>
                    </>
                )}

                {type === "list" && (
                    <IconButton
                        aria-label="Add Item"
                        size="xs"
                        onClick={() => handleAddArrayItem(path, "")} // Add empty string for list
                        variant="surface"
                        colorPalette="green"
                        title="Add item."
                    >
                        <MdAdd />
                    </IconButton>
                )}

                {type === "table" && (
                    <IconButton
                        aria-label="Add Row"
                        size="xs"
                        onClick={() => {
                            // This logic needs to be passed down or handled here. 
                            // Ideally handleAddArrayItem handles object creation too, but table needs schema.
                            // For now we will rely on the parent or handle generic object addition?
                            // Correction: The hook expects an object. We'll need a wrapper or assume default.
                            // Actually, let's keep it simple. The caller might need to handle specific 'Add Row' logic
                            // OR we pass an onAdd prop.
                            // REVISIT: To be fully generic, we might need a specific onAdd handler prop if the logic is complex
                            // BUT, for now, let's just expose the button and let the specific Table component handle the logic?
                            // No, the goal is to centralize. 
                            // Let's defer the "Add Row" click handler to a prop 'onAddItem' if provided, else generic.
                        }}
                        variant="surface"
                        colorPalette="green"
                        title="Add row."
                        // Logic for table addition is specific (needs column headers). 
                        // So we might NOT render the Add button here for Table if logic differs too much, 
                        // OR pass a specific handler 'onAddAction' prop.
                        display="none" // Hiding for table for now, will handle in Table component or via custom action
                    >
                        <MdAdd />
                    </IconButton>
                )}


                <IconButton
                    aria-label="Delete"
                    size="xs"
                    onClick={() => handleRemoveFieldOrSection(path)}
                    colorPalette="red"
                    variant="surface"
                    title="Delete. Warning!! Destructive action."
                >
                    <MdDeleteOutline />
                </IconButton>
            </Flex>
        </Flex>
    );
});

// We need to re-export for the specific Table usage where logic is unique (add row)
// Or better: Pass 'onAdd' override.
export default FieldHeader;
