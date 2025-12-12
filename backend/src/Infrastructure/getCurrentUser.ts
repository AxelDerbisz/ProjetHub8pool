import type { User } from "../Entities/User.js";
import type {AuthRequest} from "./auth.middleware.js";
import {firebaseAuth, firestoreDB} from "./config/firebase-admin.js";

export async function getCurrentUser(req: AuthRequest): Promise<User | null> {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            console.warn("Token manquant dans l'en-tête Authorization");
            return null;
        }

        const idToken = authHeader.split(" ")[1];

        if (idToken == null) {
            return null;
        }

        const decoded = await firebaseAuth.verifyIdToken(idToken);
        const uid = decoded.uid;

        const userDoc = await firestoreDB.collection("users").doc(uid).get();
        if (!userDoc.exists) return null;

        return userDoc.data() as User;
    } catch (error) {
        console.error("Erreur getCurrentUser:", error);
        return null;
    }
}
