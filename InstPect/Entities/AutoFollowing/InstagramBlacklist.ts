import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import User from "../User";
import InstagramAccount from "../InstagramAccount";

@Entity("instagram_blacklist")
export default class InstagramBlacklist {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => InstagramAccount, { onDelete: 'CASCADE' })
        @JoinColumn({ name: "accountid" })
        account: InstagramAccount;

        @Column({ type: "int", nullable: true })
        accountid: number;

    @Column({ type: "int", nullable: false })
    instagramid: number;
}
