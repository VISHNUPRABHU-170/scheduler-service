import {
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import axios from 'axios';
import { SchedulerUtils } from './utils/scheduler.utils';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor (
    private schedulerRegistry: SchedulerRegistry,
    private schedulerUtils: SchedulerUtils
  ) { }

  /**
   * Add a new cron job dynamically.
   * @param name - Unique name for the cron job.
   * @param schedule - Cron expression or ISO 8601 date string.
   * @param body - Payload to be passed to the job.
   */
  scheduleJob(name: string, schedule: string, body: any): void {
    const cronExpression = this.schedulerUtils.resolveCronExpression(schedule);
    const job = new CronJob(cronExpression, () => this.onJobTick(name, body));
    this.addCronJob(name, job);
    this.logger.log(`Job "${name}" scheduled with expression "${cronExpression}"`);
  }

  /**
   * Update an existing cron job dynamically.
   * @param name - Unique name for the cron job.
   * @param newCronExpression - New cron expression or ISO 8601 date string.
   * @param newBody - New payload to be passed to the job.
   */
  updateJob(name: string, cronExpression: string, body: any): void {
    const existingJob = this.getCronJob(name);
    existingJob.stop();
    this.schedulerRegistry.deleteCronJob(name);
    this.scheduleJob(name, cronExpression, body);
    this.logger.log(`Job "${name}" updated with new expression "${cronExpression}"`);
  }

  /**
   * Trigger a cron job manually.
   * @param name - Unique name for the cron job.
   */
  async triggerCronJob(name: string): Promise<void> {
    const job = this.getCronJob(name);
    await job.fireOnTick();
    this.logger.log(`Job "${name}" triggered manually`);
  }

  /**
   * Delete a cron job by its name.
   * @param name - Name of the cron job to delete.
   */
  deleteCronJob(name: string): void {
    const job = this.getCronJob(name);
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.log(`Job "${name}" deleted`);
  }

  /**
   * List all registered cron jobs.
   */
  listCronJobs(): string[] {
    const jobs = this.schedulerRegistry.getCronJobs();
    if (!jobs.size) throw new NotFoundException('No cron jobs found');
    const result: string[] = [];
    jobs.forEach((value, key) => {
      result.push(key);
      this.logger.log(`Job "${key}" -> Next execution: ${value.cronTime.source.toString()}`);
    });
    return result;
  }

  /**
   * Helper function to fetch a cron job by name, throws error if not found.
   * @param name - Job name.
   * @returns CronJob.
   */
  private getCronJob(name: string): CronJob {
    const job = this.schedulerRegistry.getCronJob(name);
    if (!job) throw new NotFoundException(`Cron job with name "${name}" not found`);
    return job;
  }

  /**
   * Helper function to add a cron job to the registry.
   * @param name - Job name.
   * @param job - CronJob instance.
   */
  private addCronJob(name: string, job: CronJob): void {
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  /**
   * Log job execution.
   * @param name - Job name.
   * @param body - Job payload.
   */
  private async onJobTick(name: string, body: any): Promise<void> {
    await axios(body);
    this.logger.log(`Job "${name}" executed with payload: ${JSON.stringify(body)}`);
  }
}
