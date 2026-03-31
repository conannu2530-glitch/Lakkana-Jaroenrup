export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface Status {
  id: string;
  title: string;
  order: number;
}

export type Priority = 'Low' | 'Medium' | 'High';

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  statusId: string;
  assigneeId: string;
  priority: Priority;
  dueDate: string;
  tags: string[];
  comments: Comment[];
}

export interface AppData {
  currentUser: User;
  users: User[];
  projects: Project[];
  statuses: Status[];
  tasks: Task[];
}
