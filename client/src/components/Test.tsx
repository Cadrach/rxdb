import React from 'react';
import {Button, Space, Table} from "antd";
import {useRxCollection, useRxData} from "rxdb-hooks";

const Test = () => {
    const usersCollection = useRxCollection('users');
    const {result: users} = useRxData('users', c => c.find());

    const addItem = () => {
        const id = 'id' + (new Date()).getTime();
        console.log("ADD ITEM ", id);
        usersCollection?.insert({
            id,
            "email": "test@test.com",
            "name": "test",
        });
    };

    const deleteItem = (row:any) => {
        usersCollection?.bulkRemove([row.id]);
    };

    const tableConfig = {
        rowKey: "id",
        dataSource: users,
        columns: [
            {title: 'ID', dataIndex: "id"},
            {title: "Name", dataIndex: "name"},
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
