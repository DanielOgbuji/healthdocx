import { createContext } from "react";

interface SelectionContextType {
  selectedItems: Set<string>;
  toggleSelection: (path: string) => void;
  clearSelection: () => void;
}

export const SelectionContext = createContext<SelectionContextType>({
  selectedItems: new Set(),
  toggleSelection: () => {},
  clearSelection: () => {},
});
