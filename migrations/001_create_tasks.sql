CREATE SCHEMA IF NOT EXISTS task_manager;

CREATE TYPE task_manager.task_status_enum AS ENUM ('pending', 'in-progress', 'completed');

CREATE TABLE IF NOT EXISTS task_manager.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status task_manager.task_status_enum NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION task_manager.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tasks_updated_at ON task_manager.tasks;
CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON task_manager.tasks
  FOR EACH ROW
  EXECUTE PROCEDURE task_manager.set_updated_at();
