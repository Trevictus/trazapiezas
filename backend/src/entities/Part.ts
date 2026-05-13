import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Movement } from "./Movement";
import { Shelf } from "./Shelf";

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

    @Column({ nullable: true })
    shelfId?: string | null;

    @ManyToOne(() => Shelf, shelf => shelf.parts)
    shelf?: Shelf;

    @OneToMany(() => Movement, (movement) => movement.part)
    movements!: Movement[];
}