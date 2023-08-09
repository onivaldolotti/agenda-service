import { Controller, Post, Body, Get, Query, HttpCode } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AvailableTimesDto } from './dto/available-times.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AvailabilityDto } from './dto/availability.dto';

@ApiTags('Scheduling')
@Controller('scheduling')
export class SchedulingController {
  constructor(private schedulingService: SchedulingService) {}

  @HttpCode(201)
  @Post('create-appointment')
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<any> {
    const result = await this.schedulingService.createAppointment(
      createAppointmentDto,
    );
    return {
      data: {
        result,
      },
    };
  }

  @Get('available-times')
  @ApiOperation({ summary: 'Get available times for a specific day' })
  @ApiResponse({
    status: 200,
    description: 'Available times retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getAvailableTimes(@Query() query: AvailableTimesDto) {
    const { professionalId, serviceId, date } = query;
    const availableTimes = await this.schedulingService.getAvailableTimes(
      +professionalId,
      +serviceId,
      date,
    );
    return {
      data: {
        result: availableTimes,
      },
    };
  }

  @Get('available-dates')
  async findAvailableDates(@Query() availabilityDto: AvailabilityDto) {
    const { professionalId, serviceId } = availabilityDto;
    const availableDates = await this.schedulingService.findAvailableDays(
      +professionalId,
      +serviceId,
    );
    return {
      data: {
        result: availableDates,
      },
    };
  }
}
