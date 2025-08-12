import React from "react";
import { Menu, Portal } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
import { PATH_SEPARATOR } from "@/utils/dynamicFormUtils";

interface MoveMenuItemsProps {
  data: Record<string, unknown>;
  labels: Record<string, string>;
  onSelectPath: (path: string[]) => void;
  currentPath?: string[];
}

const MoveMenuItems: React.FC<MoveMenuItemsProps> = ({
  data,
  labels,
  onSelectPath,
  currentPath = [],
}) => {
  return (
    <>
      {Object.entries(data).map(([key, value]) => {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          const newPath = [...currentPath, key];
          const pathString = newPath.join(PATH_SEPARATOR);
          const hasSubsections = Object.values(value).some(
            (v) => typeof v === "object" && v !== null && !Array.isArray(v)
          );

          if (hasSubsections) {
            return (
              <Menu.Root key={pathString} positioning={{ placement: "right-start", gutter: 2 }}>
                <Menu.TriggerItem onClick={() => onSelectPath(newPath)}>
                  {labels[pathString] || key} <LuChevronRight />
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <MoveMenuItems
                        data={value as Record<string, unknown>}
                        labels={labels}
                        onSelectPath={onSelectPath}
                        currentPath={newPath}
                      />
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            );
          }

          return (
            <Menu.Item key={pathString} value={pathString} onClick={() => onSelectPath(newPath)}>
              {labels[pathString] || key}
            </Menu.Item>
          );
        }
        return null;
      })}
    </>
  );
};

export default MoveMenuItems;
