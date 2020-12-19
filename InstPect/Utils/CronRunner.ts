import { CronJob } from 'cron';

export default class JobRunner {
    private isRunning: boolean;
    private job: CronJob;

    constructor(schedule: string, task: Function) {
        this.isRunning = false;
        this.Start(schedule, task);
    }

    async Start(schedule: string, task: Function) {
        this.job = new CronJob({
            cronTime: schedule,
            onTick: async () => {
                if (this.isRunning == true) { return; }
                this.isRunning = true;
                await task();
                this.isRunning = false;
            },
            start: true
        });
    }
}