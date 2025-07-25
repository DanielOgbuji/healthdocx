import React, { useState } from "react";
import {
    Box,
    Input,
    Flex,
    IconButton,
} from "@chakra-ui/react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { MdOutlineEdit, MdCheck, MdClose } from "react-icons/md";

interface EditableLabelProps {
    initialValue: string;
    onSave: (value: string) => void;
}

const EditableLabel: React.FC<EditableLabelProps> = ({
    initialValue,
    onSave,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const ref = React.useRef<HTMLDivElement>(null);

    useOutsideClick(ref, () => {
        if (isEditing) {
            setValue(initialValue); // Reset on outside click
            setIsEditing(false);
        }
    });

    const handleSave = () => {
        onSave(value);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setValue(initialValue);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <Flex ref={ref} alignItems="end" gap={2} my="-2px">
                <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    size="sm"
                    variant="flushed"
                    autoFocus
                    h="fit-content"
                />
                <IconButton
                    aria-label="Save"
                    onClick={handleSave}
                    size="2xs"
                    colorPalette="green"
                    variant="outline"
                    title="Save edit."
                >
                    <MdCheck title="Save edit." />
                </IconButton>
                <IconButton
                    aria-label="Cancel"
                    onClick={handleCancel}
                    size="2xs"
                    colorPalette="orange"
                    variant="outline"
                    title="Cancel edit."
                >
                    <MdClose title="Cancel edit." />
                </IconButton>
            </Flex>
        );
    }

    return (
        <Flex alignItems="center" gap={3}>
            <Box>{value}</Box>
            <IconButton
                aria-label="Edit"
                onClick={() => setIsEditing(true)}
                size="2xs"
                rounded="full"
                variant="outline"
                colorPalette="green"
                title="Edit this label."
                display="none"
                my="-2px"
                _groupHover={{ display: "flex" }}
            >
                <MdOutlineEdit title="Edit this label." />
            </IconButton>
        </Flex>
    );
};

export default EditableLabel;