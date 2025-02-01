import { Controller, Get } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';

@Controller()
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Get()
  test() {
    return 'Welcome To Scheduler Service!';
  }
}
