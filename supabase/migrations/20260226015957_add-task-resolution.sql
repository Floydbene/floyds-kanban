-- Create the task_resolution enum type
CREATE TYPE task_resolution AS ENUM (
  'done',
  'wont_do',
  'duplicate',
  'cannot_reproduce',
  'obsolete'
);

-- Add the resolution column to tasks
ALTER TABLE tasks
  ADD COLUMN resolution task_resolution;
