export interface Part {
  id: number;
  reference: string;
  brand: string;
  category: string;
  description: string;
  purchasePrice: number;
  stock: number;
  shelfId: string | null;
}