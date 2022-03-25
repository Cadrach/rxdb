import React, {useState} from 'react';
import './App.css';
import Test from "./components/Test";
import {Layout, Tabs} from "antd";
import {RxDatabase} from "rxdb/dist/types/types";
import {useMount} from "ahooks";
import {createDatabase} from "./rxdb/database";
import {Provider as RxDbHooksProvider} from "rxdb-hooks";
import Books from './components/Books';

function App() {
    const [db, setDb] = useState<RxDatabase>();

    useMount(async () => {
        const db = await createDatabase();
        setDb(db);
    });

    return (
        <RxDbHooksProvider db={db}>
            <Layout style={{minHeight: '100vh'}}>
                <Tabs>
                    <Tabs.TabPane tab="BOOKS" key={0}>
                        <Books/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="USERS" key={1}>
                        <Test/>
                    </Tabs.TabPane>
                </Tabs>
            </Layout>
        </RxDbHooksProvider>
    );
}

export default App;
