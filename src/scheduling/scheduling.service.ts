import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import {
  format,
  addDays,
  startOfDay,
  endOfDay,
  addMinutes,
  parseISO,
  isSameDay,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Professional } from '../professional/professional.entity';
import { Service } from '../service/service.entity';
import { Scheduling } from './scheduling.entity';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class SchedulingService {
  constructor(
    @InjectRepository(Professional)
    private professionalsRepository: Repository<Professional>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(Scheduling)
    private schedulingRepository: Repository<Scheduling>,
  ) {}

  async findAvailableDays(
    professionalId: number,
    serviceId: number,
  ): Promise<string[]> {
    const professional = await this.professionalsRepository.findOne({
      where: { id: professionalId },
    });
    const service = await this.servicesRepository.findOne({
      where: { id: serviceId },
    });

    if (!professional || !service) {
      throw new Error('Professional or service not found.');
    }

    const now = new Date();
    const endOfEightDays = addDays(now, 8);

    const agendaItems = await this.schedulingRepository.find({
      where: {
        professional: { id: professionalId },
        date: Between(now, endOfEightDays),
      },
    });

    const availableDates: string[] = [];
    const timeSlotDuration = service.duration_minutes;

    // Percorra os próximos oito dias
    for (let day = 0; day < 8; day++) {
      const currentDate = addDays(startOfDay(now), day);
      const dayEndTime = endOfDay(currentDate);

      let currentTime = currentDate;

      // Verifique se o dia está totalmente agendado
      let isDayFullyBooked = true;

      const agendaItem = agendaItems.find((item) => {
        return item.date === currentDate;
      });

      if (!agendaItem) {
        isDayFullyBooked = false;
      } else {
        const appointments = agendaItem.appointments;
        while (currentTime <= dayEndTime) {
          let isSlotAvailable = true;

          for (const appointment of appointments) {
            const appointmentStartTime = new Date(appointment.start_time);
            const appointmentEndTime = addMinutes(
              appointmentStartTime,
              appointment.service.duration_minutes,
            );

            if (
              (currentTime >= appointmentStartTime &&
                currentTime < appointmentEndTime) ||
              (currentTime <= appointmentStartTime &&
                dayEndTime >= appointmentEndTime)
            ) {
              isSlotAvailable = false;
              break;
            }
          }

          if (isSlotAvailable) {
            isDayFullyBooked = false;
            break;
          }

          currentTime = addMinutes(currentTime, timeSlotDuration);
        }
      }

      if (!isDayFullyBooked) {
        const formattedDate = format(currentDate, 'dd/MM/yyyy', {
          locale: ptBR,
        });
        availableDates.push(`${availableDates.length + 1} - ${formattedDate}`);
      }
    }

    return availableDates;
  }

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<any> {
    const { professionalId, serviceId, appointmentDateTime } =
      createAppointmentDto;

    const professional = await this.professionalsRepository.findOne({
      where: { id: professionalId },
    });
    const service = await this.servicesRepository.findOne({
      where: { id: serviceId },
    });

    if (!professional || !service) {
      throw new NotFoundException('Professional or service not found.');
    }

    const schedulingDate = new Date(appointmentDateTime);
    const schedulingDateStart = schedulingDate;
    const schedulingDateEnd = new Date(
      schedulingDate.getTime() + service.duration_minutes * 60000,
    );

    const scheduling = await this.schedulingRepository.findOne({
      where: {
        professional: { id: professionalId },
        date: schedulingDate,
      },
    });

    if (!scheduling) {
      throw new NotFoundException(
        'Scheduling not found for the specified date.',
      );
    }

    const appointments = scheduling.appointments;
    for (const appointment of appointments) {
      const appointmentStartTime = new Date(appointment.start_time);
      const appointmentEndTime = new Date(
        appointmentStartTime.getTime() +
          appointment.service.duration_minutes * 60000,
      );

      if (
        (schedulingDateStart >= appointmentStartTime &&
          schedulingDateStart < appointmentEndTime) ||
        (schedulingDateEnd > appointmentStartTime &&
          schedulingDateEnd <= appointmentEndTime) ||
        (schedulingDateStart <= appointmentStartTime &&
          schedulingDateEnd >= appointmentEndTime)
      ) {
        throw new HttpException(
          'Time slot is not available.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const newAppointment = new Appointment();
    newAppointment.service = service;
    newAppointment.start_time = schedulingDate.toISOString();

    scheduling.appointments.push(newAppointment);
    await this.schedulingRepository.save(scheduling);

    return {
      message: 'Appointment created successfully.',
      appointment: newAppointment,
    };
  }

  async getAvailableTimes(
    professionalId: number,
    serviceId: number,
    date: string,
  ): Promise<string[]> {
    const day = new Date(date);
    const professional = await this.professionalsRepository.findOne({
      where: { id: professionalId },
    });
    const service = await this.servicesRepository.findOne({
      where: { id: serviceId },
    });

    if (!professional || !service) {
      throw new Error('Professional or service not found.');
    }

    const workStartTime = new Date(`${date} ${professional.work_start_time}`);
    const workEndTime = new Date(`${date} ${professional.work_end_time}`);

    const scheduling = await this.schedulingRepository.findOne({
      where: {
        professional: { id: professionalId },
        date: day,
      }, // Carregue os appointments relacionados
    });

    if (!scheduling) {
      throw new NotFoundException(
        'Scheduling not found for the specified date.',
      );
    }

    const appointments = scheduling.appointments;

    const availableTimeSlots: string[] = [];
    const timeSlotDuration = service.duration_minutes;

    let currentTime = workStartTime;

    while (currentTime >= workStartTime && currentTime < workEndTime) {
      let isSlotAvailable = true;

      for (const appointment of appointments) {
        const appointmentStartTime = parseISO(appointment.start_time);
        const appointmentEndTime = addMinutes(
          appointmentStartTime,
          appointment.service.duration_minutes,
        );
        if (
          isSameDay(appointmentStartTime, day) &&
          currentTime >= appointmentStartTime &&
          currentTime < appointmentEndTime
        ) {
          isSlotAvailable = false;
          break;
        }
      }
      if (isSlotAvailable) {
        availableTimeSlots.push(
          `${availableTimeSlots.length + 1} - ${currentTime.toLocaleTimeString(
            'pt-BR',
            {
              hour: '2-digit',
              minute: '2-digit',
            },
          )}`,
        );
      }

      currentTime = addMinutes(currentTime, timeSlotDuration);
    }

    return availableTimeSlots;
  }
}
