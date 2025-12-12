import { db } from "../Infrastructure/config/firebase-admin.js";
import type { Pool } from "../Entities/Pool.js";
import { PoolType } from "../Entities/Pool.js";

export async function CreatePoolAsync(pool: Pool): Promise<void> {
    const poolObj = JSON.parse(JSON.stringify(pool));
    const poolRef = db.collection("pools").doc(String(pool.id));

    await poolRef.set(poolObj);

    console.log(`Pool ${pool.id} créé en DB.`);
}

export async function GetByIdAsync(id: string | number): Promise<Pool | null> {
    const poolRef = db.collection("pools").doc(String(id));
    const doc = await poolRef.get();

    if (!doc.exists) {
        console.log(`Pool ${id} introuvable.`);
        return null;
    }

    return doc.data() as Pool;
}

export async function GetAllAsync(): Promise<Pool[]> {
    const poolsSnapshot = await db.collection("pools").get();
    const pools: Pool[] = [];

    poolsSnapshot.forEach((doc) => {
        pools.push(doc.data() as Pool);
    });

    console.log(`${pools.length} pool(s) récupéré(s).`);
    return pools;
}

export async function UpdateByIdAsync(id: string | number, updates: Partial<Pool>): Promise<boolean> {
    const poolRef = db.collection("pools").doc(String(id));
    const doc = await poolRef.get();

    if (!doc.exists) {
        console.log(`Pool ${id} introuvable pour mise à jour.`);
        return false;
    }

    const updateObj = JSON.parse(JSON.stringify(updates));
    await poolRef.update(updateObj);

    console.log(`Pool ${id} mis à jour.`);
    return true;
}

export async function DeleteByIdAsync(id: string | number): Promise<boolean> {
    const poolRef = db.collection("pools").doc(String(id));
    const doc = await poolRef.get();

    if (!doc.exists) {
        console.log(`Pool ${id} introuvable pour suppression.`);
        return false;
    }

    await poolRef.delete();

    console.log(`Pool ${id} supprimé.`);
    return true;
}

export async function ExistsAsync(id: string | number): Promise<boolean> {
    const poolRef = db.collection("pools").doc(String(id));
    const doc = await poolRef.get();

    return doc.exists;
}

export async function GetByFilterAsync(field: string, operator: FirebaseFirestore.WhereFilterOp, value: any): Promise<Pool[]> {
    const poolsSnapshot = await db.collection("pools")
        .where(field, operator, value)
        .get();

    const pools: Pool[] = [];

    poolsSnapshot.forEach((doc) => {
        pools.push(doc.data() as Pool);
    });

    console.log(`${pools.length} pool(s) trouvé(s) avec le filtre ${field} ${operator} ${value}.`);
    return pools;
}

export async function GetByTypeAsync(type: PoolType): Promise<Pool[]> {
    const poolsSnapshot = await db.collection("pools")
        .where("type", "==", type)
        .get();

    const pools: Pool[] = [];

    poolsSnapshot.forEach((doc) => {
        pools.push(doc.data() as Pool);
    });

    console.log(`${pools.length} pool(s) de type ${PoolType[type]} trouvé(s).`);
    return pools;
}

export async function GetByStatusAsync(status: boolean): Promise<Pool[]> {
    const poolsSnapshot = await db.collection("pools")
        .where("status", "==", status)
        .get();

    const pools: Pool[] = [];

    poolsSnapshot.forEach((doc) => {
        pools.push(doc.data() as Pool);
    });

    console.log(`${pools.length} pool(s) ${status ? 'actifs' : 'inactifs'} trouvé(s).`);
    return pools;
}

export async function CountAsync(): Promise<number> {
    const poolsSnapshot = await db.collection("pools").get();
    return poolsSnapshot.size;
}

export async function CountByTypeAsync(type: PoolType): Promise<number> {
    const poolsSnapshot = await db.collection("pools")
        .where("type", "==", type)
        .get();
    return poolsSnapshot.size;
}