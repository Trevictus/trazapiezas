import { Part } from "./part";

export interface Shelf {
    id: string;
    name: string;
    description: string;
    parts: Part[];
}