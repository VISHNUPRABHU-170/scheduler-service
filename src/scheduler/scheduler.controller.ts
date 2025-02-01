import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
} from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { JobNameDto, ScheduleJobDto } from './dto/scheduler.dto';

@Controller('jobs')
export class SchedulerController {
  constructor (private readonly schedulerService: SchedulerService) { }

  @Get('trigger')
  async triggerJob(@Query() jobNameDto: JobNameDto): Promise<string> {
    const { name } = jobNameDto;
    await this.schedulerService.triggerCronJob(name);
    return `Job "${name}" triggered manually`;
  }

  @Get('list')
  listJobs(): string[] {
    const jobs = this.schedulerService.listCronJobs();
    return jobs;
  }

  @Post('schedule')
  addJob(@Body() scheduleJobDto: ScheduleJobDto): string {
    const { name, cronExpression, body } = scheduleJobDto;
    this.schedulerService.scheduleJob(name, cronExpression, body);
    return `Job "${name}" added with cron expression "${cronExpression}"`;
  }

  @Put('update')
  updateJob(@Body() updateJobDto: ScheduleJobDto): string {
    const { name, cronExpression, body } = updateJobDto;
    this.schedulerService.updateJob(name, cronExpression, body);
    return `Job "${name}" updated with new cron expression "${cronExpression}"`;
  }

  @Delete('delete')
  deleteJob(@Query() jobNameDto: JobNameDto): string {
    const { name } = jobNameDto;
    this.schedulerService.deleteCronJob(name);
    return `Job "${name}" deleted`;
  }
}
