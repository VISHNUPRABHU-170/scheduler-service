import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [SchedulerController],
  providers: [SchedulerService],
})
export class SchedulerModule {}
