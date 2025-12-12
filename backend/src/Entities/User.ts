import type {Reservation} from "./Reservation.js";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isAdmin: boolean;
    isActive: boolean;
    hasAcceptedTerms: boolean;
    participatedReservations: Reservation[];
}
