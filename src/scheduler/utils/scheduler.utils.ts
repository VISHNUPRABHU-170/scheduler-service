import { Injectable, BadRequestException } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class SchedulerUtils {
  /**
   * Resolve the cron expression based on the input format.
   * @param schedule - Cron expression or ISO 8601 date string.
   * @returns Cron expression string.
   */
  resolveCronExpression(schedule: string): string {
    const date = DateTime.fromISO(schedule);
    if (date.isValid) {
      if (this.isPastDate(date)) {
        throw new BadRequestException('Cannot schedule a job in the past');
      }
      return this.convertDateToCron(date);
    }
    return schedule;
  }

  /**
   * Convert a specific date/time to a cron expression.
   * @param date - Luxon DateTime object.
   * @returns Cron expression string.
   */
  private convertDateToCron(date: DateTime): string {
    return `${date.second} ${date.minute} ${date.hour} ${date.day} ${date.month} *`;
  }

  /**
   * Checks if a given date is in the past.
   * @param date - Date to check.
   * @returns boolean indicating whether the date is in the past.
   */
  private isPastDate(date: DateTime): boolean {
    return date < DateTime.now();
  }
}
