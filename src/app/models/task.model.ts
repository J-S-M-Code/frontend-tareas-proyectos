export interface TaskRequest {
  title: string;
  estimatedHours: number;
  assignee: string;
  status: string;
  createdAt: string;
  finishedAt: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

// NUEVA INTERFAZ AÑADIDA
export interface Task {
  id: number;
  title: string;
  estimatedHours: number;
  assignee: string;
  status: TaskStatus;
  createdAt?: string;
  finishedAt?: string;
}

export interface Project {
  id: number;
  name: string;
  status: 'PLANNED' | 'ACTIVE' | 'CLOSED';
}