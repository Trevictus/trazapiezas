import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Part } from "./Part";

@Entity("movements")
export class Movement {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    quantity!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    purchasePrice!: number; // Precio neto real del albarán

    @Column({ nullable: true })
    vehiclePlate!: string; // Matrícula del coche

    @Column({
        type: "enum",
        enum: ["PENDING", "USED", "STOCK", "RETURNED"],
        default: "STOCK"
    })
    status!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => Part, (part) => part.movements)
    part!: Part;
}