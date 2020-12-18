import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany, JoinColumn, OneToOne } from "typeorm";
import User from "./User";
import InstagramAccount from "./InstagramAccount";

@Entity("instagram_stats")
export default class InstagramStats {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => InstagramAccount )
        @JoinColumn({ name: "accountid" })
        account: InstagramAccount;

        @Column({ type: "int", nullable: true })
        accountid: number;

    // Time checks
    @Column("int")
    monthcheck: number;

    @Column("int")
    daycheck: number;

    // Monthly data

    @Column("int")
    monthfollowers: number;

    // Daily data

    @Column("int")
    dayfollowers: number;

    // Current data

    @Column("int")
    currentfollowers: number;
}
