import { createClient } from '@supabase/supabase-js';
import { db } from './index.js';
import { users } from './schema/users.js';
import { projects } from './schema/projects.js';
import { boards } from './schema/boards.js';
import { columns } from './schema/columns.js';
import { tasks } from './schema/tasks.js';
import { labels } from './schema/labels.js';
import { taskLabels } from './schema/task-labels.js';
import { subtasks } from './schema/subtasks.js';

async function seed() {
  console.log('Seeding database...');

  // Create Supabase Auth user via Admin API
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: 'admin@taskflow.local',
    password: 'taskflow',
    email_confirm: true,
    user_metadata: { name: 'Admin' },
  });

  if (authError) {
    throw new Error(`Failed to create Supabase Auth user: ${authError.message}`);
  }

  // Create app user with matching Supabase Auth ID
  const [user] = await db.insert(users).values({
    id: authUser.user.id,
    email: 'admin@taskflow.local',
    name: 'Admin',
  }).returning();
  console.log('Created user:', user.email);

  // Create project
  const [project] = await db.insert(projects).values({
    name: 'My First Project',
    description: 'A sample project to get started with Taskflow',
    slug: 'my-first-project',
    color: '#6366f1',
    icon: 'rocket',
    ownerId: user.id,
  }).returning();
  console.log('Created project:', project.name);

  // Create board
  const [board] = await db.insert(boards).values({
    name: 'Main Board',
    projectId: project.id,
    position: 0,
  }).returning();

  // Create columns
  const columnData = [
    { name: 'Backlog', position: 0, color: '#6b7280' },
    { name: 'To Do', position: 1, color: '#3b82f6' },
    { name: 'In Progress', position: 2, color: '#f59e0b', wipLimit: 3 },
    { name: 'In Review', position: 3, color: '#8b5cf6' },
    { name: 'Done', position: 4, color: '#22c55e', isDoneColumn: true },
  ];

  const createdColumns = await db.insert(columns).values(
    columnData.map(c => ({ ...c, boardId: board.id }))
  ).returning();
  console.log('Created', createdColumns.length, 'columns');

  // Create labels
  const labelData = [
    { name: 'Bug', color: '#ef4444' },
    { name: 'Feature', color: '#3b82f6' },
    { name: 'Enhancement', color: '#8b5cf6' },
    { name: 'Documentation', color: '#6b7280' },
    { name: 'Design', color: '#ec4899' },
    { name: 'Tech Debt', color: '#f59e0b' },
  ];

  const createdLabels = await db.insert(labels).values(
    labelData.map(l => ({ ...l, projectId: project.id }))
  ).returning();
  console.log('Created', createdLabels.length, 'labels');

  // Create tasks
  const backlog = createdColumns[0];
  const todo = createdColumns[1];
  const inProgress = createdColumns[2];
  const inReview = createdColumns[3];
  const done = createdColumns[4];

  const taskData = [
    { title: 'Set up project infrastructure', identifier: 'MFP-1', priority: 'high' as const, columnId: done.id, position: 0, description: 'Initialize the monorepo with Turborepo, set up Docker, and configure the database.' },
    { title: 'Design authentication flow', identifier: 'MFP-2', priority: 'high' as const, columnId: done.id, position: 1, description: 'Design and implement JWT-based authentication with login and registration.' },
    { title: 'Implement task CRUD API', identifier: 'MFP-3', priority: 'critical' as const, columnId: inReview.id, position: 0, description: 'Build the REST API endpoints for creating, reading, updating, and deleting tasks.' },
    { title: 'Build kanban board UI', identifier: 'MFP-4', priority: 'critical' as const, columnId: inProgress.id, position: 0, description: 'Create the drag-and-drop kanban board with dnd-kit.' },
    { title: 'Add drag-and-drop between columns', identifier: 'MFP-5', priority: 'high' as const, columnId: inProgress.id, position: 1, description: 'Implement cross-column drag and drop with optimistic updates.' },
    { title: 'Create task detail panel', identifier: 'MFP-6', priority: 'medium' as const, columnId: todo.id, position: 0, description: 'Build the slide-over panel for viewing and editing task details.' },
    { title: 'Add label management', identifier: 'MFP-7', priority: 'medium' as const, columnId: todo.id, position: 1, description: 'Create UI for managing project labels with color picker.' },
    { title: 'Implement search and filters', identifier: 'MFP-8', priority: 'low' as const, columnId: backlog.id, position: 0, description: 'Add full-text search and filtering by priority, labels, and due dates.' },
    { title: 'Build analytics dashboard', identifier: 'MFP-9', priority: 'low' as const, columnId: backlog.id, position: 1, description: 'Create dashboard with charts for task completion, cycle time, and distribution.' },
  ];

  const createdTasks = await db.insert(tasks).values(
    taskData.map(t => ({ ...t, projectId: project.id }))
  ).returning();
  console.log('Created', createdTasks.length, 'tasks');

  // Add labels to tasks
  await db.insert(taskLabels).values([
    { taskId: createdTasks[0].id, labelId: createdLabels[1].id }, // MFP-1: Feature
    { taskId: createdTasks[2].id, labelId: createdLabels[1].id }, // MFP-3: Feature
    { taskId: createdTasks[3].id, labelId: createdLabels[1].id }, // MFP-4: Feature
    { taskId: createdTasks[3].id, labelId: createdLabels[4].id }, // MFP-4: Design
    { taskId: createdTasks[5].id, labelId: createdLabels[1].id }, // MFP-6: Feature
    { taskId: createdTasks[7].id, labelId: createdLabels[2].id }, // MFP-8: Enhancement
    { taskId: createdTasks[8].id, labelId: createdLabels[1].id }, // MFP-9: Feature
  ]);

  // Add subtasks
  await db.insert(subtasks).values([
    { title: 'Create Express app factory', isCompleted: true, position: 0, taskId: createdTasks[2].id },
    { title: 'Add validation middleware', isCompleted: true, position: 1, taskId: createdTasks[2].id },
    { title: 'Write task endpoints', isCompleted: true, position: 2, taskId: createdTasks[2].id },
    { title: 'Add error handling', isCompleted: false, position: 3, taskId: createdTasks[2].id },
    { title: 'Set up dnd-kit context', isCompleted: true, position: 0, taskId: createdTasks[3].id },
    { title: 'Create column components', isCompleted: false, position: 1, taskId: createdTasks[3].id },
    { title: 'Create card components', isCompleted: false, position: 2, taskId: createdTasks[3].id },
  ]);

  console.log('Seed completed successfully!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
