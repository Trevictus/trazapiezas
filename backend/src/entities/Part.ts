import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Movement } from "./Movement";

@Entity("parts")
export class Part {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    reference!: string;

    @Column()
    brand!: string;

    @Column()
    category!: string;

    @Column("text")
    description!: string;

    @Column("decimal", { precision: 10, scale: 2, default: 0 })
    purchasePrice!: number;

    @Column({ default: 0 })
    stock!: number;

    @OneToMany(() => Movement, (movement) => movement.part)
    movements!: Movement[];
}