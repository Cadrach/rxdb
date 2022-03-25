import React from 'react';
import {Button, Space, Table} from "antd";
import {useRxCollection, useRxData} from "rxdb-hooks";
import {ulid} from 'ulid';
import moment from 'moment';
import {RxDocument} from "rxdb/dist/types/types";

const Book = () => {
    const booksCollection = useRxCollection('books');
    const {result: books} = useRxData('books', c => c.find());

    const addItem = () => {
        const id = ulid();
        console.log("ADD ITEM ", id);
        booksCollection?.insert({
            "uuid": id,
            "name": "test",
        });
    };

    const deleteItem = (row:RxDocument) => {
        row.atomicPatch({deleted_at: moment().format('YYYY-MM-DD HH:mm:ss')});


    };

    const tableConfig = {
        rowKey: "uuid",
        dataSource: books,
        columns: [
            {title: 'ID', dataIndex: "uuid"},
            {title: "Name", dataIndex: "name"},
            {title: "Updated At", dataIndex: "updated_at", render: (date:any) => moment(date).fromNow()},
            {render: (row:any) => <Button onClick={() => deleteItem(row)} danger type="primary">Delete</Button>, align: 'right' as 'right'}
        ]
    };

    return <span>
        <Table {...tableConfig}/>
        <Space>
            <Button onClick={addItem}>Add item</Button>
            <Button onClick={() => booksCollection?.remove()}>Truncate</Button>
            <b>{books.length} Books</b>
        </Space>
    </span>;
};

export default Book;
