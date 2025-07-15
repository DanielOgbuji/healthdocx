import React, { useState } from "react";
import { SelectionContext } from "./SelectionContext.ts";

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleSelection = (path: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const clearSelection = () => setSelectedItems(new Set());

  return (
    <SelectionContext.Provider value={{ selectedItems, toggleSelection, clearSelection }}>
      {children}
    </SelectionContext.Provider>
  );
};
