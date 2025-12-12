import type { User } from "../Entities/User.js";

export interface IUserRepository {
    // Fonctions de base CRUD
    GenerateIdAsync(): Promise<string>;
    CreateUserAsync(user: User): Promise<void>;
    GetByIdAsync(id: string): Promise<User | null>;
    GetAllAsync(): Promise<User[]>;
    UpdateByIdAsync(id: string, updates: Partial<User>): Promise<boolean>;
    DeleteByIdAsync(id: string): Promise<boolean>;
    ExistsAsync(id: string): Promise<boolean>;

    // Recherche spécifique
    GetByEmailAsync(email: string): Promise<User | null>;
    GetByPhoneNumberAsync(phoneNumber: string): Promise<User | null>;
    GetAdminsAsync(): Promise<User[]>;
    GetActiveUsersAsync(): Promise<User[]>;
    GetInactiveUsersAsync(): Promise<User[]>;
    GetUsersWithoutAcceptedTermsAsync(): Promise<User[]>;
    SearchByNameAsync(searchTerm: string): Promise<User[]>;

    // Gestion des statuts
    ActivateUserAsync(id: string): Promise<boolean>;
    DeactivateUserAsync(id: string): Promise<boolean>;
    ToggleActiveStatusAsync(id: string): Promise<boolean>;
    PromoteToAdminAsync(id: string): Promise<boolean>;
    DemoteFromAdminAsync(id: string): Promise<boolean>;
    AcceptTermsAsync(id: string): Promise<boolean>;

    // Mise à jour sécurisée
    UpdateEmailAsync(id: string, newEmail: string): Promise<boolean>;
    UpdatePhoneNumberAsync(id: string, newPhoneNumber: string): Promise<boolean>;

    // Statistiques
    CountAsync(): Promise<number>;
    CountAdminsAsync(): Promise<number>;
    CountActiveUsersAsync(): Promise<number>;

    // Filtre générique
    GetByFilterAsync(
        field: string,
        operator: FirebaseFirestore.WhereFilterOp,
        value: any
    ): Promise<User[]>;
}