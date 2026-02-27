import { pgTable, uuid, varchar, integer, boolean, index } from 'drizzle-orm/pg-core';
import { boards } from './boards';

export const columns = pgTable('columns', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  boardId: uuid('board_id').notNull().references(() => boards.id, { onDelete: 'cascade' }),
  position: integer('position').notNull().default(0),
  color: varchar('color', { length: 7 }),
  wipLimit: integer('wip_limit'),
  isCollapsed: boolean('is_collapsed').notNull().default(false),
  isDoneColumn: boolean('is_done_column').notNull().default(false),
  isBlockedColumn: boolean('is_blocked_column').notNull().default(false),
}, (table) => [
  index('columns_board_id_idx').on(table.boardId),
]);
