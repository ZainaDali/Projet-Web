import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('message')
export class MessageProcessor {
  @Process()
  async handleMessage(job: Job) {
    console.log('Processing job:', job.data);
  }
}
