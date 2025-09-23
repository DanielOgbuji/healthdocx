export interface DragItem {
  id: string;
  path: string[];
  type: 'field' | 'section' | 'table-row' | 'list-item';
  originalIndex?: number;
}

export type DropResult = {
  dropEffect: 'move' | 'merge';
  path: string[]; // Target path
};
