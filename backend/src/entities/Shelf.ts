import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Part } from "./Part";

@Entity("shelves")
export class Shelf {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true })
    name!: string;

    @Column("text")
    description!: string;

    @OneToMany(() => Part, (part) => part.shelf)
    parts!: Part[];
}
