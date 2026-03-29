import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { ProjectStatus } from '../../../models/project.model';
import { HttpErrorResponse } from '@angular/common/http';

// Módulos actualizados de PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

// Validador personalizado para el cruce de fechas
function dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;

  if (!start || !end) return null; // Si faltan datos, dejamos que los validadores 'required' actúen

  const startDate = new Date(start);
  const endDate = new Date(end);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignoramos la hora para comparar solo fechas

  const errors: any = {};

  if (endDate < today) {
    errors.endDatePast = true;
  }
  if (endDate < startDate) {
    errors.endDateBeforeStart = true;
  }

  return Object.keys(errors).length ? errors : null;
}

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    SelectModule,
    ButtonModule,
    MessageModule,
  ],
  templateUrl: './create-project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProjectComponent {
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);

  // Signals para manejar el estado de la vista
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Opciones para el Dropdown de PrimeNG
  statusOptions = [
    { label: 'Planeado', value: 'PLANNED' },
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Cerrado', value: 'CLOSED' },
  ];

  // Configuración del formulario reactivo
  projectForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.maxLength(100)]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      status: [null, Validators.required],
      description: [''],
    },
    { validators: dateRangeValidator },
  ); // Asignamos el validador cruzado al grupo

  onSubmit(): void {
    // Limpiamos mensajes previos
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched(); // Muestra los errores en la vista
      return;
    }

    this.isSubmitting.set(true);

    const formValues = this.projectForm.value;

    // Formateamos las fechas a yyyy-MM-dd para el backend
    const projectData = {
      ...formValues,
      startDate: formatDate(formValues.startDate, 'yyyy-MM-dd', 'en-US'),
      endDate: formatDate(formValues.endDate, 'yyyy-MM-dd', 'en-US'),
      status: formValues.status.value || formValues.status, // Depende de cómo PrimeNG emita el valor
    };

    this.projectService.createProject(projectData).subscribe({
      next: (project) => {
        this.successMessage.set(`¡Proyecto '${project.name}' creado con éxito!`);
        this.projectForm.reset();
        this.isSubmitting.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        // Manejo específico del código 409 dictado en la SPEC
        if (error.status === 409) {
          this.errorMessage.set(
            error.error?.error ||
              'Ya existe un proyecto con el mismo nombre o hay un conflicto de reglas.',
          );
        } else {
          this.errorMessage.set('Ocurrió un error inesperado al comunicarse con el servidor.');
        }
      },
    });
  }

  // Helpers para la vista (Template)
  isFieldInvalid(fieldName: string): boolean {
    const control = this.projectForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
