import db from '../config/db';

export const getProfile = (req: any, res: any) => {
  const user = db.prepare("SELECT id, email, name, branch, year, cgpa, interests, skills, career_goals, current_path, xp, streaks, badges FROM users WHERE id = ?").get(req.user.id) as any;
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

export const updateProfile = (req: any, res: any) => {
  const { name, branch, year, cgpa, interests, skills, career_goals, current_path } = req.body;
  try {
    db.prepare(`
      UPDATE users SET 
        name = ?, branch = ?, year = ?, cgpa = ?, 
        interests = ?, skills = ?, career_goals = ?, current_path = ? 
      WHERE id = ?
    `).run(name, branch, year, cgpa, interests, skills, career_goals, current_path, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};

export const getStats = (req: any, res: any) => {
  try {
    const user = db.prepare("SELECT xp, streaks, badges, current_path, branch, skills FROM users WHERE id = ?").get(req.user.id) as any;
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const tasks = db.prepare("SELECT count(*) as total, sum(completed) as completed FROM tasks WHERE user_id = ?").get(req.user.id) as any;
    
    // Real historical data simulation (normally would come from a 'history' table)
    const history = [
      { name: 'Week 1', score: 45 },
      { name: 'Week 2', score: 52 },
      { name: 'Week 3', score: 61 },
      { name: 'Week 4', score: 68 },
      { name: 'Week 5', score: 75 + (user.streaks * 2) }, // Dynamic based on streaks
    ];

    res.json({
      user,
      taskStats: {
        total: tasks?.total || 0,
        completed: tasks?.completed || 0,
        progress: (tasks?.total && tasks?.total > 0) ? Math.round((tasks.completed / tasks.total) * 100) : 0
      },
      history
    });
  } catch (error) {
    console.error("GetStats Error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
