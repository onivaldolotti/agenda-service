import { Controller } from '@nestjs/common';
import { ProfessionalService } from './professional.service';

@Controller('professional')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}
}
