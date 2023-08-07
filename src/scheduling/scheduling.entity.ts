import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Professional } from '../professional/professional.entity';
import { Appointment } from './appointment.entity';

@Entity()
export class Scheduling {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  appointments: Appointment[];

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => Professional, (professional) => professional.scheduling)
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;
}
