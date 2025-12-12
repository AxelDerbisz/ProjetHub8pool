import type { Request, Response } from "express";
import * as UserRepository from "../Repositories/UserRepository.js";
import {CreateUser} from "../UseCases/Users/CreateUser.js";

const createUserUseCase = new CreateUser(UserRepository);

export class UserController {

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const payload = req.body;

            const user = await createUserUseCase.handleAsync(payload);

            res.status(201).json({
                message: "Utilisateur créé avec succès.",
                user,
            });

        } catch (error: any) {
            console.error("Erreur création user:", error.message);

            res.status(400).json({
                error: error.message ?? "Erreur interne lors de la création de l'utilisateur.",
            });
        }
    }
}
