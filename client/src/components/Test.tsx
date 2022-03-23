import React from 'react';
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import {useMount} from "ahooks";

const createDatabase = async () => {
  const dbDexie = await createRxDatabase({
      name: 'mydatabase',
      storage: getRxStorageDexie()
  });

  return dbDexie;
};

const Test = () => {

  useMount(() => {
    createDatabase();
  })

  return <span>HELLO WORD</span>;
}

export default Test;
