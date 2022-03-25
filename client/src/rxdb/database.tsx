import {createRxDatabase} from "rxdb";
import { RxDBReplicationGraphQLPlugin } from 'rxdb/plugins/replication-graphql';
import {addRxPlugin} from "rxdb";
import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import {books, users} from './schema';
import {notification} from "antd";
import configUsers from './models/user';
import configBooks from './models/book';

//Add plugin for GraphQL
addRxPlugin(RxDBReplicationGraphQLPlugin);

export const createDatabase = async () => {
    const db = await createRxDatabase({
        name: 'mydatabase',
        storage: getRxStorageDexie()
    });
    const collections = await db.addCollections({
        users: {
            schema: users
        },
        books: {
            schema: books
        },
    });

    collections.users.syncGraphQL(configUsers).error$.subscribe(onError);
    collections.books.syncGraphQL(configBooks).error$.subscribe(onError);

    return db;
};

const onError = (error:any) => {
    const e = error.innerErrors[0];
    notification.error({
        message: <div>
            <div><b>{e.message ?? e.path?.join('/')}</b></div>
            {e.debugMessage}
        </div>
    });
    console.log(error.innerErrors);
};