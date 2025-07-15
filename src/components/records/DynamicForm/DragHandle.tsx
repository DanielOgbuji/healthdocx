import { Icon } from "@chakra-ui/react";
import { MdOutlineDragIndicator } from "react-icons/md";

export const DragHandle = () => (
    <Icon
        as={MdOutlineDragIndicator}
        cursor="grab"
        opacity={0.5}
        _hover={{ opacity: 1 }}
        boxSize={5}
    />
);