import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  @ApiProperty()
  professionalId: number;

  @ApiProperty()
  @IsInt()
  serviceId: number;

  @IsDateString()
  @ApiProperty()
  appointmentDateTime: string;
}
