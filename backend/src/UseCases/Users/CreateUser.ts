import type {IUserRepository} from "../../Interfaces/IUserRepository.js";
import type {UserCreatedPayload} from "../../Entities/Payload/UserCreatedPayload.js";
import type {User} from "../../Entities/User.js";

export class CreateUser {
    constructor(private userRepo: IUserRepository) {}

    async handleAsync(payload: UserCreatedPayload): Promise<User> {
        if (!payload.firstName?.trim()) {
            throw new Error("Le prénom est obligatoire.");
        }

        if (!payload.lastName?.trim()) {
            throw new Error("Le nom est obligatoire.");
        }

        if (!payload.email?.trim()) {
            throw new Error("L'email est obligatoire.");
        }

        if (!payload.phoneNumber?.trim()) {
            throw new Error("Le numéro de téléphone est obligatoire.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.email)) {
            throw new Error("L'email fourni n'est pas valide.");
        }

        const phoneRegex = /^[0-9]{7,15}$/;
        if (!phoneRegex.test(payload.phoneNumber)) {
            throw new Error("Le numéro de téléphone doit contenir entre 7 et 15 chiffres.");
        }

        if (!payload.hasAcceptedTerms) {
            throw new Error("L'utilisateur doit accepter les conditions d'utilisation.");
        }

        const existingUser = await this.userRepo.GetByEmailAsync(payload.email);
        if (existingUser) {
            throw new Error("Un utilisateur existe déjà avec cet email.");
        }

        const generatedId = await this.userRepo.GenerateIdAsync();

        const newUser: User = {
            id: generatedId,
            firstName: payload.firstName.trim(),
            lastName: payload.lastName.trim(),
            email: payload.email.toLowerCase(),
            phoneNumber: payload.phoneNumber,
            isAdmin: false,
            isActive: true,
            hasAcceptedTerms: payload.hasAcceptedTerms ?? false,
            participatedReservations: [],
        };

        await this.userRepo.CreateUserAsync(newUser);

        return newUser;
    }
}