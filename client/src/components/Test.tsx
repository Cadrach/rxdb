import React from 'react';
import {Button, Space, Table} from "antd";
import {useRxCollection, useRxData} from "rxdb-hooks";
import {ulid} from 'ulid';
import moment from 'moment';

const Test = () => {
    const usersCollection = useRxCollection('users');
    const {result: users} = useRxData('users', c => c.find());

    const addItem = () => {
        const id = ulid();
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
            <Button onClick={addItem}>Add item</Button>
            <Button onClick={() => usersCollection?.remove()}>Truncate</Button>
            <b>{users.length} Users</b>
        </Space>
    </span>;
};

export default Test;
