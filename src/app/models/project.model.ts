//Acara los status que puede tener el project
export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'CLOSED';

//En este caso las fechas las trabajamos de manera como string, el problema, js trabaja Date y en el
// back usamos LocalDateTime y tiene formatos distintos
export interface Project {
  id: number;
  name: string;
  startDate: string; // Formato yyyy-MM-dd
  endDate: string; // Formato yyyy-MM-dd
  status: ProjectStatus;
  description?: string;
}

export interface ProjectCreateDTO {
  name: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  description?: string;
}
