export interface Box {
  id: string;
  x: number;
  y: number;
  name: string;
  catalog: string;
  linkedTo: string;
  color: string;
}

export interface BoxListItem {
  id: string;
  name: string;
  catalog: string;
  linkedTo: string;
}
