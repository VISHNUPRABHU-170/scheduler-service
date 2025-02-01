import * as dayjs from 'dayjs';
import { BadRequestException } from '@nestjs/common';

/**
 * Resolve the cron expression based on the input format.
 * @param schedule - Cron expression or ISO 8601 date string.
 * @returns Cron expression string.
 */
export function resolveCronExpression(schedule: string): string {
  const date = dayjs(schedule);
  if (date.isValid()) {
    if (isPastDate(date)) {
      throw new BadRequestException('Cannot schedule a job in the past');
    }
    return convertDateToCron(date);
  }
  return schedule;
}

/**
 * Convert a specific date/time to a cron expression.
 * @param date - Day.js object.
 * @returns Cron expression string.
 */
function convertDateToCron(date: dayjs.Dayjs): string {
  return `${date.second()} ${date.minute()} ${date.hour()} ${date.date()} ${date.month() + 1} *`;
}

/**
 * Checks if a given date is in the past.
 * @param date - Date to check.
 * @returns boolean indicating whether the date is in the past.
 */
function isPastDate(date: dayjs.Dayjs): boolean {
  return date.isBefore(dayjs());
}
