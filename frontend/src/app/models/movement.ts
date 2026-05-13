import { Part } from "./part"
import { User } from "./user"

export interface Movement {
    id: number,
    quantity: number,
    purchasePrice?: number | null,
    vehiclePlate: string,
    vin: string | null,
    engineCode: string | null,
    status: "STOCK" | "USED",
    createdAt: string,
    part: Part
    user?: User | null
}