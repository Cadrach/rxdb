import React from 'react';
import {Button, Space, Table} from "antd";
import {useRxCollection, useRxData} from "rxdb-hooks";
import { v4 as uuidv4} from "uuid";
import moment from 'moment';

const Test = () => {
    const usersCollection = useRxCollection('users');
    const {result: users} = useRxData('users', c => c.find());

    const addItem = () => {
        const id = uuidv4();
        console.log("ADD ITEM ", id);
        usersCollection?.insert({
            "uuid": id,
            "email": "test@test.com",
            "name": "test",
        });
    };

    const deleteItem = (row:any) => {
        usersCollection?.bulkRemove([row.id]);
    };

    const tableConfig = {
        rowKey: "uuid",
        dataSource: users,
        columns: [
            {title: 'ID', dataIndex: "uuid"},
            {title: "Name", dataIndex: "name"},
            {title: "Updated At", dataIndex: "updated_at", render: (date:any) => moment(date).fromNow()},
            {render: (row:any) => <Button onClick={() => deleteItem(row)}>Delete</Button>}
        ]
    };

    return <span>
        <Table {...tableConfig}/>
        <Space>
            <Button onClick={addItem}>TEST</Button>
            <Button onClick={() => usersCollection?.remove()}>Truncate</Button>
        </Space>
    </span>;
};

export default Test;
