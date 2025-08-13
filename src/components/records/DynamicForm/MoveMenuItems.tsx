import React, { useState } from "react";
import { Menu, Portal } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
import { PATH_SEPARATOR } from "@/utils/dynamicFormUtils";
import { isMobile } from "@/utils/isMobile";

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
  const [openSubmenuPath, setOpenSubmenuPath] = useState<string | null>(null);

  const handleTriggerClick = (newPath: string[], pathString: string) => {
    if (isMobile) {
      if (openSubmenuPath === pathString) {
        // Second click on the same item, select it
        onSelectPath(newPath);
        setOpenSubmenuPath(null); // Close submenu after selection
      } else {
        // First click on mobile, open submenu
        setOpenSubmenuPath(pathString);
      }
    } else {
      // On desktop, always select on click
      onSelectPath(newPath);
    }
  };

  const handleMenuItemClick = (newPath: string[]) => {
    onSelectPath(newPath);
    if (isMobile) {
      setOpenSubmenuPath(null); // Close submenu after selection on mobile
    }
  };

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
              <Menu.Root
                key={pathString}
                positioning={{ placement: "right-start", gutter: 2 }}
                open={isMobile ? openSubmenuPath === pathString : undefined}
                onOpenChange={(details) => {
                  if (!isMobile) {
                    // Only manage open state for desktop via Chakra's internal mechanism
                    // On mobile, we control it with openSubmenuPath state
                    if (!details.open) {
                      setOpenSubmenuPath(null);
                    }
                  }
                }}
              >
                <Menu.TriggerItem onClick={() => handleTriggerClick(newPath, pathString)}>
                  {labels[pathString] || key} <LuChevronRight />
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <MoveMenuItems
                        data={value as Record<string, unknown>}
                        labels={labels}
                        onSelectPath={handleMenuItemClick} // Pass the new handler for child items
                        currentPath={newPath}
                      />
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            );
          }

          return (
            <Menu.Item key={pathString} value={pathString} onClick={() => handleMenuItemClick(newPath)}>
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
