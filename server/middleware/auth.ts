import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "career-os-prod-key-999";

export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Unauthorized access" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Invalid or expired session" });
    req.user = user;
    next();
  });
};
