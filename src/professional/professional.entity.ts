import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Scheduling } from '../scheduling/scheduling.entity';

@Entity()
export class Professional {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone_number: string;

  @Column({ type: 'time' }) // Use o tipo 'time' para representar a hora
  work_start_time: Date; // Hora de início do trabalho

  @Column({ type: 'time' }) // Use o tipo 'time' para representar a hora
  work_end_time: Date; // Hora de término do trabalho

  @OneToMany(() => Scheduling, (scheduling) => scheduling.professional) // Relação com a entidade Agenda
  scheduling: Scheduling[];
}
