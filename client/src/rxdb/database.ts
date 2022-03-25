import {createRxDatabase} from "rxdb";
import { RxDBReplicationGraphQLPlugin } from 'rxdb/plugins/replication-graphql';
import {addRxPlugin} from "rxdb";
import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import {users} from './schema';
import moment from "moment";

//Add plugin for GraphQL
addRxPlugin(RxDBReplicationGraphQLPlugin);

const pullQueryBuilder = (doc:any) => {
    if (!doc) {
        // the first pull does not have a start-document
        doc = {
            uuid: '',
            updated_at: 0
        };
    }
    const query = `{
        rxPullUsers(lastId: "${doc.uuid}", minUpdatedAt: "${doc.updated_at}", limit: 5) {
            uuid,
            name,
            updated_at
            deleted_at
        }
    }`;
    return {
        query,
        variables: {}
    };
};

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

    collections.users.syncGraphQL({
        url: 'http://localhost/rxdb/server/public/graphql', // url to the GraphQL endpoint
        pull: {
            queryBuilder: pullQueryBuilder, // the queryBuilder from above
            // modifier: doc => doc, // (optional) modifies all pulled documents before they are handeled by RxDB. Returning null will skip the document.
            // dataPath: undefined // (optional) specifies the object path to access the document(s). Otherwise, the first result of the response data is used.
        },
        deletedFlag: 'deleted_at', // the flag which indicates if a pulled document is deleted
        live: true // if this is true, rxdb will watch for ongoing changes and sync them, when false, a one-time-replication will be done
    });

    return db;
};