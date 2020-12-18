import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany, JoinColumn, OneToOne } from "typeorm";
import User from "./User";
import InstagramStats from "./InstagramStats";

@Entity("instagram_accounts")
export default class InstagramAccount {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
        @JoinColumn({ name: "userid" })
        user: User;

        @Column({ type: "int", nullable: true })
        userid: number;

    @OneToOne(() => InstagramStats, stats => stats.account )
        stats: InstagramStats;

    @Column("varchar", { length: 30 })
    login: string;

    @Column("varchar", { length: 50 })
    password: string;

    @Column("integer")
    instagramid: number;

    @Column("boolean", { default: false })
    enabled: boolean;

    @Column("text", { default: null })
    session: string;
}
