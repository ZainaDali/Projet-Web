import { Job } from 'bull';
export declare class MessageProcessor {
    handleMessage(job: Job): Promise<void>;
}
