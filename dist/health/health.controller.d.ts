import { Queue } from 'bull';
export declare class HealthController {
    private readonly messageQueue;
    constructor(messageQueue: Queue);
    check(): string;
    createJob(): Promise<string>;
}
