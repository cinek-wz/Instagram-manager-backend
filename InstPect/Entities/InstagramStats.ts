import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany, JoinColumn, OneToOne } from "typeorm";
import User from "./User";
import InstagramAccount from "./InstagramAccount";

@Entity("instagram_stats")
export default class InstagramStats {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => InstagramAccount, { onDelete: 'CASCADE' } )
        @JoinColumn({ name: "accountid" })
        account: InstagramAccount;

        @Column({ type: "int", nullable: true })
        accountid: number;

    // Time checks
    @Column("int", { nullable: true } )
    monthcheck: number;

    @Column("int", { nullable: true } )
    daycheck: number;

    // Monthly data

    @Column("int", { default: 0 } )
    monthfollowers: number;

    // Daily data

    @Column("int", { default: 0 })
    dayfollowers: number;

    // Current data

    @Column("int", { default: 0 })
    currentfollowers: number;
}
