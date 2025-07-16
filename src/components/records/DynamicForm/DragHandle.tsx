import { Icon } from "@chakra-ui/react";
import { MdOutlineDragIndicator } from "react-icons/md";

export const DragHandle = () => (
    <Icon
        cursor="grab"
        opacity={0.5}
        _hover={{ opacity: 1 }}
        boxSize={5}
    >
        <MdOutlineDragIndicator title="Click, hold and move to drag this item." />
    </Icon>
);