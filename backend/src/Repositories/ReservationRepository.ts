import { db } from "../Infrastructure/config/firebase-admin.js";
import type { Reservation } from "../Entities/Reservation.js";
import { ReservationStatus } from "../Entities/Reservation.js";

export async function CreateReservationAsync(reservation: Reservation): Promise<void> {
    if (!reservation || typeof reservation.id === "undefined") {
        throw new Error("La réservation doit avoir un id valide.");
    }

    const reservationObj = JSON.parse(JSON.stringify(reservation));
    const reservationRef = db.collection("reservations").doc(String(reservation.id));

    await reservationRef.set(reservationObj);

    console.log(`Reservation ${reservation.id} créée en DB.`);
}

export async function GetByIdAsync(id: string | number): Promise<Reservation | null> {
    const reservationRef = db.collection("reservations").doc(String(id));
    const doc = await reservationRef.get();

    if (!doc.exists) {
        console.log(`Reservation ${id} introuvable.`);
        return null;
    }

    return doc.data() as Reservation;
}

export async function GetAllAsync(): Promise<Reservation[]> {
    const reservationsSnapshot = await db.collection("reservations").get();
    const reservations: Reservation[] = [];

    reservationsSnapshot.forEach((doc) => {
        reservations.push(doc.data() as Reservation);
    });

    console.log(`${reservations.length} réservation(s) récupérée(s).`);
    return reservations;
}

export async function UpdateByIdAsync(id: string | number, updates: Partial<Reservation>): Promise<boolean> {
    const reservationRef = db.collection("reservations").doc(String(id));
    const doc = await reservationRef.get();

    if (!doc.exists) {
        console.log(`Reservation ${id} introuvable pour mise à jour.`);
        return false;
    }

    const updateObj = JSON.parse(JSON.stringify(updates));
    await reservationRef.update(updateObj);

    console.log(`Reservation ${id} mise à jour.`);
    return true;
}

export async function DeleteByIdAsync(id: string | number): Promise<boolean> {
    const reservationRef = db.collection("reservations").doc(String(id));
    const doc = await reservationRef.get();

    if (!doc.exists) {
        console.log(`Reservation ${id} introuvable pour suppression.`);
        return false;
    }

    await reservationRef.delete();

    console.log(`Reservation ${id} supprimée.`);
    return true;
}

export async function ExistsAsync(id: string | number): Promise<boolean> {
    const reservationRef = db.collection("reservations").doc(String(id));
    const doc = await reservationRef.get();

    return doc.exists;
}

export async function GetByOwnerIdAsync(ownerId: number): Promise<Reservation[]> {
    const reservationsSnapshot = await db.collection("reservations")
        .where("ownerId", "==", ownerId)
        .get();

    const reservations: Reservation[] = [];

    reservationsSnapshot.forEach((doc) => {
        reservations.push(doc.data() as Reservation);
    });

    console.log(`${reservations.length} réservation(s) trouvée(s) pour l'utilisateur ${ownerId}.`);
    return reservations;
}

export async function GetByPoolIdAsync(poolId: number): Promise<Reservation[]> {
    const reservationsSnapshot = await db.collection("reservations")
        .where("poolId", "==", poolId)
        .get();

    const reservations: Reservation[] = [];

    reservationsSnapshot.forEach((doc) => {
        reservations.push(doc.data() as Reservation);
    });

    console.log(`${reservations.length} réservation(s) trouvée(s) pour le pool ${poolId}.`);
    return reservations;
}

export async function GetByStatusAsync(status: ReservationStatus): Promise<Reservation[]> {
    const reservationsSnapshot = await db.collection("reservations")
        .where("status", "==", status)
        .get();

    const reservations: Reservation[] = [];

    reservationsSnapshot.forEach((doc) => {
        reservations.push(doc.data() as Reservation);
    });

    const statusName = ReservationStatus[status];
    console.log(`${reservations.length} réservation(s) avec le statut ${statusName} trouvée(s).`);
    return reservations;
}

export async function GetByDateRangeAsync(startDate: string, endDate: string): Promise<Reservation[]> {
    const reservationsSnapshot = await db.collection("reservations")
        .where("startOn", ">=", startDate)
        .where("startOn", "<=", endDate)
        .get();

    const reservations: Reservation[] = [];

    reservationsSnapshot.forEach((doc) => {
        reservations.push(doc.data() as Reservation);
    });

    console.log(`${reservations.length} réservation(s) trouvée(s) entre ${startDate} et ${endDate}.`);
    return reservations;
}

export async function UpdateStatusAsync(id: number, status: ReservationStatus): Promise<boolean> {
    const result = await UpdateByIdAsync(id, { status });

    if (result) {
        console.log(`Statut de la réservation ${id} changé à ${ReservationStatus[status]}.`);
    }

    return result;
}

export async function ConfirmReservationAsync(id: number): Promise<boolean> {
    return await UpdateStatusAsync(id, ReservationStatus.Confirmed);
}

export async function CancelReservationAsync(id: number): Promise<boolean> {
    return await UpdateStatusAsync(id, ReservationStatus.Cancelled);
}

export async function AcceptSettlementAsync(id: number): Promise<boolean> {
    return await UpdateByIdAsync(id, { hasAcceptedSettlement: true });
}

export async function GetUnsettledReservationsAsync(): Promise<Reservation[]> {
    const reservationsSnapshot = await db.collection("reservations")
        .where("hasAcceptedSettlement", "==", false)
        .get();

    const reservations: Reservation[] = [];

    reservationsSnapshot.forEach((doc) => {
        reservations.push(doc.data() as Reservation);
    });

    console.log(`${reservations.length} réservation(s) non réglée(s) trouvée(s).`);
    return reservations;
}

export async function AddOwnerCommentAsync(id: number, comment: string): Promise<boolean> {
    return await UpdateByIdAsync(id, { ownerComment: comment });
}

export async function AddAdminCommentAsync(id: number, comment: string): Promise<boolean> {
    return await UpdateByIdAsync(id, { adminComment: comment });
}

export async function CountAsync(): Promise<number> {
    const reservationsSnapshot = await db.collection("reservations").get();
    return reservationsSnapshot.size;
}

export async function CountByStatusAsync(status: ReservationStatus): Promise<number> {
    const reservationsSnapshot = await db.collection("reservations")
        .where("status", "==", status)
        .get();
    return reservationsSnapshot.size;
}

export async function GetByFilterAsync(field: string, operator: FirebaseFirestore.WhereFilterOp, value: any): Promise<Reservation[]> {
    const reservationsSnapshot = await db.collection("reservations")
        .where(field, operator, value)
        .get();

    const reservations: Reservation[] = [];

    reservationsSnapshot.forEach((doc) => {
        reservations.push(doc.data() as Reservation);
    });

    console.log(`${reservations.length} réservation(s) trouvée(s) avec le filtre ${field} ${operator} ${value}.`);
    return reservations;
}