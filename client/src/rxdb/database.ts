import {createRxDatabase} from "rxdb";
import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import {users} from './schema';

export const createDatabase = async () => {
    const db = await createRxDatabase({
        name: 'mydatabase',
        storage: getRxStorageDexie()
    });
    const collections = await db.addCollections({
        users: {
            schema: users
        }
    });

    return db;
};