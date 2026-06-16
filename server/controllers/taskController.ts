import db from '../config/db';

export const getTasks = (req: any, res: any) => {
  const tasks = db.prepare("SELECT * FROM tasks WHERE user_id = ? ORDER BY id DESC").all(req.user.id);
  res.json(tasks);
};

export const createTask = (req: any, res: any) => {
  const { title, date } = req.body;
  const result = db.prepare("INSERT INTO tasks (user_id, title, date) VALUES (?, ?, ?)").run(req.user.id, title, date);
  res.json({ id: result.lastInsertRowid, title, date, completed: 0 });
};

export const updateTask = (req: any, res: any) => {
  const { completed } = req.body;
  const task = db.prepare("SELECT completed FROM tasks WHERE id = ? AND user_id = ?").get(req.params.id, req.user.id) as any;
  
  if (task) {
    db.prepare("UPDATE tasks SET completed = ? WHERE id = ?").run(completed ? 1 : 0, req.params.id);
    if (completed && !task.completed) {
      db.prepare("UPDATE users SET xp = xp + 50 WHERE id = ?").run(req.user.id);
    }
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
};

export const deleteTask = (req: any, res: any) => {
  db.prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
  res.json({ success: true });
};
