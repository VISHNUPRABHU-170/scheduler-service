import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class ScheduleJobDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cronExpression: string;

  @IsObject()
  @IsNotEmpty()
  body: any;
}

export class JobNameDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
