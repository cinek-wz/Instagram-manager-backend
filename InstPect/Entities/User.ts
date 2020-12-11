import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from "typeorm";

@Entity("users")
export default class User
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 30 })
    login: string;

    @Column("binary", { length: 20 })
    password: Buffer;

    @Column("varchar", { length: 30 })
    email: string;

    @Column("smallint", { default: 0 })
    role: number;

    @Column("boolean", { default: false })
    banned: boolean;
}
