export interface CategoryNode {
    id: number;
    name: string;
    isActive: boolean;
    children?: CategoryNode[];
  }
  