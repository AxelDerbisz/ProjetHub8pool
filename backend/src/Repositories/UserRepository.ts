import { db } from "../Infrastructure/config/firebase-admin.js";
import type { User } from "../Entities/User.js";

/**
 * Génère un ID unique pour un nouvel utilisateur
 */
export async function GenerateIdAsync(): Promise<string> {
    const newDocRef = db.collection("users").doc();
    return newDocRef.id;
}

/**
 * Crée un nouvel utilisateur dans la base de données
 */
export async function CreateUserAsync(user: User): Promise<void> {
    if (!user || !user.id || user.id.trim() === "") {
        throw new Error("L'utilisateur doit avoir un id valide.");
    }

    const userObj = JSON.parse(JSON.stringify(user));
    const userRef = db.collection("users").doc(user.id);

    await userRef.set(userObj);

    console.log(`User ${user.id} créé en DB.`);
}

/**
 * Récupère un utilisateur par son ID
 */
export async function GetByIdAsync(id: string): Promise<User | null> {
    const userRef = db.collection("users").doc(id);
    const doc = await userRef.get();

    if (!doc.exists) {
        console.log(`User ${id} introuvable.`);
        return null;
    }

    return doc.data() as User;
}

/**
 * Récupère tous les utilisateurs
 */
export async function GetAllAsync(): Promise<User[]> {
    const usersSnapshot = await db.collection("users").get();
    const users: User[] = [];

    usersSnapshot.forEach((doc) => {
        users.push(doc.data() as User);
    });

    console.log(`${users.length} utilisateur(s) récupéré(s).`);
    return users;
}

/**
 * Met à jour un utilisateur par son ID
 */
export async function UpdateByIdAsync(id: string, updates: Partial<User>): Promise<boolean> {
    const userRef = db.collection("users").doc(id);
    const doc = await userRef.get();

    if (!doc.exists) {
        console.log(`User ${id} introuvable pour mise à jour.`);
        return false;
    }

    const updateObj = JSON.parse(JSON.stringify(updates));
    await userRef.update(updateObj);

    console.log(`User ${id} mis à jour.`);
    return true;
}

/**
 * Supprime un utilisateur par son ID
 */
export async function DeleteByIdAsync(id: string): Promise<boolean> {
    const userRef = db.collection("users").doc(id);
    const doc = await userRef.get();

    if (!doc.exists) {
        console.log(`User ${id} introuvable pour suppression.`);
        return false;
    }

    await userRef.delete();

    console.log(`User ${id} supprimé.`);
    return true;
}

/**
 * Vérifie si un utilisateur existe
 */
export async function ExistsAsync(id: string): Promise<boolean> {
    const userRef = db.collection("users").doc(id);
    const doc = await userRef.get();

    return doc.exists;
}

/**
 * Récupère un utilisateur par son email
 */
export async function GetByEmailAsync(email: string): Promise<User | null> {
    const usersSnapshot = await db.collection("users")
        .where("email", "==", email)
        .limit(1)
        .get();

    if (usersSnapshot.empty) {
        console.log(`Aucun utilisateur avec l'email ${email}.`);
        return null;
    }

    return usersSnapshot.docs[0]?.data() as User;
}

/**
 * Récupère un utilisateur par son numéro de téléphone
 */
export async function GetByPhoneNumberAsync(phoneNumber: string): Promise<User | null> {
    const usersSnapshot = await db.collection("users")
        .where("phoneNumber", "==", phoneNumber)
        .limit(1)
        .get();

    if (usersSnapshot.empty) {
        console.log(`Aucun utilisateur avec le numéro ${phoneNumber}.`);
        return null;
    }

    return usersSnapshot.docs[0]?.data() as User;
}

/**
 * Récupère tous les administrateurs
 */
export async function GetAdminsAsync(): Promise<User[]> {
    const usersSnapshot = await db.collection("users")
        .where("isAdmin", "==", true)
        .get();

    const users: User[] = [];

    usersSnapshot.forEach((doc) => {
        users.push(doc.data() as User);
    });

    console.log(`${users.length} administrateur(s) trouvé(s).`);
    return users;
}

/**
 * Récupère tous les utilisateurs actifs
 */
export async function GetActiveUsersAsync(): Promise<User[]> {
    const usersSnapshot = await db.collection("users")
        .where("isActive", "==", true)
        .get();

    const users: User[] = [];

    usersSnapshot.forEach((doc) => {
        users.push(doc.data() as User);
    });

    console.log(`${users.length} utilisateur(s) actif(s) trouvé(s).`);
    return users;
}

/**
 * Récupère tous les utilisateurs inactifs
 */
export async function GetInactiveUsersAsync(): Promise<User[]> {
    const usersSnapshot = await db.collection("users")
        .where("isActive", "==", false)
        .get();

    const users: User[] = [];

    usersSnapshot.forEach((doc) => {
        users.push(doc.data() as User);
    });

    console.log(`${users.length} utilisateur(s) inactif(s) trouvé(s).`);
    return users;
}

/**
 * Récupère les utilisateurs qui n'ont pas accepté les conditions
 */
export async function GetUsersWithoutAcceptedTermsAsync(): Promise<User[]> {
    const usersSnapshot = await db.collection("users")
        .where("hasAcceptedTerms", "==", false)
        .get();

    const users: User[] = [];

    usersSnapshot.forEach((doc) => {
        users.push(doc.data() as User);
    });

    console.log(`${users.length} utilisateur(s) n'ayant pas accepté les conditions trouvé(s).`);
    return users;
}

/**
 * Active un utilisateur
 */
export async function ActivateUserAsync(id: string): Promise<boolean> {
    const result = await UpdateByIdAsync(id, { isActive: true });

    if (result) {
        console.log(`Utilisateur ${id} activé.`);
    }

    return result;
}

/**
 * Désactive un utilisateur
 */
export async function DeactivateUserAsync(id: string): Promise<boolean> {
    const result = await UpdateByIdAsync(id, { isActive: false });

    if (result) {
        console.log(`Utilisateur ${id} désactivé.`);
    }

    return result;
}

/**
 * Bascule le statut actif/inactif d'un utilisateur
 */
export async function ToggleActiveStatusAsync(id: string): Promise<boolean> {
    const user = await GetByIdAsync(id);

    if (!user) {
        console.log(`User ${id} introuvable pour changer le statut.`);
        return false;
    }

    return await UpdateByIdAsync(id, { isActive: !user.isActive });
}

/**
 * Promouvoir un utilisateur en administrateur
 */
export async function PromoteToAdminAsync(id: string): Promise<boolean> {
    const result = await UpdateByIdAsync(id, { isAdmin: true });

    if (result) {
        console.log(`Utilisateur ${id} promu administrateur.`);
    }

    return result;
}

/**
 * Rétrograder un administrateur en utilisateur normal
 */
export async function DemoteFromAdminAsync(id: string): Promise<boolean> {
    const result = await UpdateByIdAsync(id, { isAdmin: false });

    if (result) {
        console.log(`Utilisateur ${id} rétrogradé en utilisateur normal.`);
    }

    return result;
}

/**
 * Marque qu'un utilisateur a accepté les conditions
 */
export async function AcceptTermsAsync(id: string): Promise<boolean> {
    const result = await UpdateByIdAsync(id, { hasAcceptedTerms: true });

    if (result) {
        console.log(`Utilisateur ${id} a accepté les conditions.`);
    }

    return result;
}

/**
 * Met à jour l'email d'un utilisateur
 */
export async function UpdateEmailAsync(id: string, newEmail: string): Promise<boolean> {
    // Vérifier si l'email n'est pas déjà utilisé
    const existingUser = await GetByEmailAsync(newEmail);

    if (existingUser && existingUser.id !== id) {
        console.log(`L'email ${newEmail} est déjà utilisé par un autre utilisateur.`);
        return false;
    }

    return await UpdateByIdAsync(id, { email: newEmail });
}

/**
 * Met à jour le numéro de téléphone d'un utilisateur
 */
export async function UpdatePhoneNumberAsync(id: string, newPhoneNumber: string): Promise<boolean> {
    return await UpdateByIdAsync(id, { phoneNumber: newPhoneNumber });
}

/**
 * Recherche des utilisateurs par nom ou prénom (recherche partielle)
 */
export async function SearchByNameAsync(searchTerm: string): Promise<User[]> {
    const allUsers = await GetAllAsync();
    const searchLower = searchTerm.toLowerCase();

    const filteredUsers = allUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower)
    );

    console.log(`${filteredUsers.length} utilisateur(s) trouvé(s) pour la recherche "${searchTerm}".`);
    return filteredUsers;
}

/**
 * Compte le nombre total d'utilisateurs
 */
export async function CountAsync(): Promise<number> {
    const usersSnapshot = await db.collection("users").get();
    return usersSnapshot.size;
}

/**
 * Compte le nombre d'administrateurs
 */
export async function CountAdminsAsync(): Promise<number> {
    const usersSnapshot = await db.collection("users")
        .where("isAdmin", "==", true)
        .get();
    return usersSnapshot.size;
}

/**
 * Compte le nombre d'utilisateurs actifs
 */
export async function CountActiveUsersAsync(): Promise<number> {
    const usersSnapshot = await db.collection("users")
        .where("isActive", "==", true)
        .get();
    return usersSnapshot.size;
}

/**
 * Récupère des utilisateurs avec un filtre personnalisé
 */
export async function GetByFilterAsync(field: string, operator: FirebaseFirestore.WhereFilterOp, value: any): Promise<User[]> {
    const usersSnapshot = await db.collection("users")
        .where(field, operator, value)
        .get();

    const users: User[] = [];

    usersSnapshot.forEach((doc) => {
        users.push(doc.data() as User);
    });

    console.log(`${users.length} utilisateur(s) trouvé(s) avec le filtre ${field} ${operator} ${value}.`);
    return users;
}