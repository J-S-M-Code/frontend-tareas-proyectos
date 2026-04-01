export interface TaskRequest {
  title: string;
  estimatedHours: number;
  assignee: string;
  status: string;
  createdAt: string;
  finishedAt: string;
}

export interface Project {
  id: number;
  name: string;
  status: 'PLANNED' | 'ACTIVE' | 'CLOSED';
}