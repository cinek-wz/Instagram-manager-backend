import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from "typeorm";

@Entity("Users")
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

    @Column("smallint")
    role: number;

    @Column("boolean")
    banned: boolean;
}
