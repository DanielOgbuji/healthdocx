import { useContext } from "react";
import { SelectionContext } from "@/contexts/SelectionContext.ts";

export const useSelection = () => useContext(SelectionContext);
