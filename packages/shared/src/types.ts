export type ProjectStatus = 'active' | 'archived';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskType = 'task' | 'bug' | 'spike' | 'subtask';
export type TaskResolution = 'done' | 'wont_do' | 'duplicate' | 'cannot_reproduce' | 'obsolete';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  color: string;
  icon: string | null;
  status: ProjectStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  name: string;
  projectId: string;
  position: number;
}

export interface Column {
  id: string;
  name: string;
  boardId: string;
  position: number;
  color: string | null;
  wipLimit: number | null;
  isCollapsed: boolean;
  isDoneColumn: boolean;
  isBlockedColumn: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  identifier: string;
  priority: TaskPriority;
  type: TaskType;
  parentId: string | null;
  columnId: string;
  projectId: string;
  position: number;
  dueDate: string | null;
  completedAt: string | null;
  resolution: TaskResolution | null;
  estimatePoints: number | null;
  isBlocked: boolean;
  blockedReason: string | null;
  requestorId: string | null;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  projectId: string;
}

export interface ProjectTag {
  id: string;
  name: string;
  color: string;
}

export interface ProjectWithTags extends Project {
  tags: ProjectTag[];
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
  position: number;
  taskId: string;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: Pick<User, 'id' | 'name' | 'avatarUrl'>;
}

export interface TaskResource {
  id: string;
  title: string;
  url: string;
  resourceType: string;
  taskId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  description: string | null;
  startedAt: string;
  stoppedAt: string | null;
  durationSeconds: number | null;
}

// Extended types for API responses
export interface TaskWithRelations extends Task {
  labels: Label[];
  subtasks: Subtask[];
  requestor: Pick<User, 'id' | 'name' | 'avatarUrl'> | null;
  assignee: Pick<User, 'id' | 'name' | 'avatarUrl'> | null;
  _count?: {
    comments: number;
    subtasks: number;
    completedSubtasks: number;
  };
}

export interface ColumnWithTasks extends Column {
  tasks: TaskWithRelations[];
}

export interface BoardWithColumns extends Board {
  columns: ColumnWithTasks[];
}

// API envelope types
export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Dashboard types
export interface DashboardSummary {
  totalTasks: number;
  completedThisWeek: number;
  inProgress: number;
  overdue: number;
}

export interface ThroughputDataPoint {
  date: string;
  completed: number;
}

export interface CycleTimeDataPoint {
  date: string;
  avgDays: number;
}

export interface DistributionItem {
  name: string;
  value: number;
  color: string;
}
