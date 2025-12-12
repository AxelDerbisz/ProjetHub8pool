import express, { type Response } from 'express';
import cors from 'cors';
import { authMiddleware } from './Infrastructure/auth.middleware.js';
import type { AuthRequest } from './Infrastructure/auth.middleware.js';
import dotenv from "dotenv";
import { UserController } from './Controllers/UserController.js';

dotenv.config();

console.log("All env vars:", process.env);
const app = express();
app.use(cors());
app.use(express.json());

const userController = new UserController();

// route publique de test
app.get('/api/public', (req, res) => {
    res.send('Ceci est une route PUBLIQUE.');
});

// route authentifiée de test
app.get('/api/me', authMiddleware, (req: AuthRequest, res: Response) => {
    res.send(`Bonjour, ${req.user?.email} (UID: ${req.user?.uid})`);
});

// USER : création d’utilisateurs
app.post('/api/users', async (req, res) => {
    await userController.create(req, res);
});

// -------------------------------------------------

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Serveur API démarré sur http://localhost:${PORT}`);
});
