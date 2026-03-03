import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";
import * as bcrypt from "bcrypt";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @Column({
        type: "enum",
        enum: ["ADMIN", "MECHANIC"],
        default: "MECHANIC"
    })
    role!: string;

    // Esto se ejecuta justo antes de guardar en la DB
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}