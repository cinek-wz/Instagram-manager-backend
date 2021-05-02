import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import User from "../User";
import InstagramAccount from "../InstagramAccount";

@Entity("instagram_followed")
export default class InstagramFollowed {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => InstagramAccount, { onDelete: 'CASCADE' })
        @JoinColumn({ name: "accountid" })
        account: InstagramAccount;

        @Column({ type: "int", nullable: true })
        accountid: number;

    @Column({ type: "int", nullable: false })
    instagramid: number;

    @Column({ type: "datetime", nullable: false })
    date: Date;

    @Column({ type: "boolean", default: false })
    unfollowed: Date;
}
