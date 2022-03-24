import React, {useState} from 'react';
import './App.css';
import Test from "./components/Test";
import {Layout} from "antd";
import {RxDatabase} from "rxdb/dist/types/types";
import {useMount} from "ahooks";
import {createDatabase} from "./rxdb/database";
import {Provider as RxDbHooksProvider} from "rxdb-hooks";

function App() {
    const [db, setDb] = useState<RxDatabase>();

    useMount(async () => {
        const db = await createDatabase();
        setDb(db);
    });

    return (
        <RxDbHooksProvider db={db}>
            <Layout style={{minHeight: '100vh'}}>
                <Test/>
            </Layout>
        </RxDbHooksProvider>
    );
}

export default App;
