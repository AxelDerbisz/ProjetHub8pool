// src/middleware/auth.middleware.ts

import type { Request, Response, NextFunction } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { firebaseAuth } from '../config/firebase-admin.js';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Authentification requise: Token manquant.');
  }

  const idToken = authHeader.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).send('Authentification requise: Token invalide.');
  }

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(idToken); // ici idToken est garanti string
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Erreur de validation du token:', error);
    res.status(403).send('Token invalide ou expiré.');
  }
};
