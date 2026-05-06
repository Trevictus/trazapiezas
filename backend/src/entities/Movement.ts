import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Part } from "./Part";
import { User } from "./User";

@Entity()
export class Movement {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Part, (part) => part.movements)
    part: Part;

    @ManyToOne(() => User) // relación para saber quién hizo el movimiento
    user: User;

    @Column()
    quantity: number;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    purchasePrice: number;

    @Column({ nullable: true })
    vehiclePlate: string;

    @Column() // STOCK (Entrada) o USED (Salida/Instalación)
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}