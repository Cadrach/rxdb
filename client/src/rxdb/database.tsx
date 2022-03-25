import {createRxDatabase} from "rxdb";
import { RxDBReplicationGraphQLPlugin } from 'rxdb/plugins/replication-graphql';
import {addRxPlugin} from "rxdb";
import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import {users} from './schema';
import moment from "moment";
import {notification} from "antd";

//Add plugin for GraphQL
addRxPlugin(RxDBReplicationGraphQLPlugin);

/**
 * Pull data from the server
 * @param doc
 */
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
            uuid
            name
            email
            updated_at
            deleted_at
        }
    }`;
    return {
        query,
        variables: {}
    };
};

/**
 * Push data to the server
 * @param doc
 */
const pushQueryBuilder = (doc:any) => {
    const dateOrNull = (date:any) => date ? `"${date}"`:'null';

    const query = `
        mutation {
            rxPushUsers(
                uuid: "${doc.uuid}"
                name: "${doc.name}"
                email: "${doc.email}"
                password: ""
                deleted_at: ${dateOrNull(doc.deleted_at)}
            ) {
            id
            uuid
            name
            email
            updated_at
            deleted_at
        }
    }
    `;
    const variables = {
        user: doc
    };
    return {
        query,
        variables
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
        push: {
            queryBuilder: pushQueryBuilder, // the queryBuilder from above
            batchSize: 5, // (optional) amount of documents that will pulled out of the storage at once. This does not affect how many documents are send to the server in a single request.
            // modifier: d => d // (optional) modifies all pushed documents before they are send to the GraphQL endpoint. Returning null will skip the document.
        },
        deletedFlag: 'deleted_at', // the flag which indicates if a pulled document is deleted
        live: true // if this is true, rxdb will watch for ongoing changes and sync them, when false, a one-time-replication will be done
    }).error$.subscribe(error => {
        const e = error.innerErrors[0];
        notification.error({
            message: <div>
                <div><b>{e.path.join('/')}</b></div>
                {e.debugMessage}
            </div>
        });
        console.log(error.innerErrors);
    });

    return db;
};