import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import User from "./User";
import InstagramAccount from "./InstagramAccount";

@Entity("instagram_photos")
export default class InstagramPhoto {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => InstagramAccount)
        @JoinColumn({ name: "accountid" })
        account: InstagramAccount;

        @Column({ type: "int", nullable: true })
        accountid: number;

    @Column("binary")
    photo: Buffer;

    @Column("datetime")
    date: Date;

    @Column("text")
    description: string;
}
