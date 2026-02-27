ALTER TABLE tasks ADD COLUMN requestor_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD COLUMN assignee_id UUID REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX tasks_requestor_id_idx ON tasks(requestor_id);
CREATE INDEX tasks_assignee_id_idx ON tasks(assignee_id);
