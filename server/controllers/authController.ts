import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || "career-os-prod-key-999";

export const register = async (req: any, res: any) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields are required" });
  }
  
  try {
    const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existingUser) return res.status(400).json({ error: "This email is already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare("INSERT INTO users (email, password, name, streaks, xp) VALUES (?, ?, ?, ?, ?)").run(email, hashedPassword, name, 0, 0);
    
    const userId = result.lastInsertRowid;
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });

    // Seed initial tasks
    const initTasks = [
      { title: "Complete your basic profile", date: new Date().toISOString() },
      { title: "Define your first career goal", date: new Date().toISOString() }
    ];
    const taskStmt = db.prepare("INSERT INTO tasks (user_id, title, date) VALUES (?, ?, ?)");
    initTasks.forEach(t => taskStmt.run(userId, t.title, t.date));

    res.json({ token, user: { id: userId, email, name, xp: 0, streaks: 0 } });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Registration failed. Please try again later." });
  }
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;

    if (user && await bcrypt.compare(password, user.password)) {
      const today = new Date().toISOString().split('T')[0];
      let newStreak = user.streaks;

      if (user.last_login_date) {
        const last = new Date(user.last_login_date);
        const lastLogin = new Date(last.getFullYear(), last.getMonth(), last.getDate());
        const currentLogin = new Date();
        currentLogin.setHours(0,0,0,0);
        
        const diff = Math.floor((currentLogin.getTime() - lastLogin.getTime()) / (1000 * 3600 * 24));
        if (diff === 1) newStreak += 1;
        else if (diff > 1) newStreak = 1;
      } else {
        newStreak = 1;
      }

      db.prepare("UPDATE users SET last_login_date = ?, streaks = ? WHERE id = ?").run(today, newStreak, user.id);
      
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      const { password: _, ...userData } = user;
      res.json({ token, user: { ...userData, streaks: newStreak } });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login service temporarily unavailable" });
  }
};
