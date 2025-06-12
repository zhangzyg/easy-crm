'use client'

import { Table, Input, Button, Space } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { useState, useRef, Key } from 'react'
import type { InputRef } from 'antd'
import StatusSelector, { StatusOption } from './StatusSelector'

interface Contact {
    name: string;
    mail: string;
    phones: Array<string>;
}


interface CustomerInfo {
    id: string;
    name: string;
    contact: Array<Contact>;
    status: string;
    recommandPerson: string;
    createdDate: Date;
}

const data: CustomerInfo[] = [
    { id: '1', name: '公司A', contact: [{ name: '张三', mail: 'test@mail.com', phones: ['123', '45s6'] }, { name: 'a', mail: 'test@mail.com', phones: ['123', '45s6'] }], status: '', recommandPerson: 'a', createdDate: new Date()},
    { id: '2', name: '公司B', contact: [{ name: '李四', mail: 'test2@mail.com', phones: ['123', '45s6'] }, { name: 'b', mail: 'test2@mail.com', phones: ['1231', '45s67'] }], status: '', recommandPerson: 'b', createdDate: new Date()},
    { id: '3', name: '公司C', contact: [{ name: '王五', mail: 'test3@mail.com', phones: ['123', '45s6'] }, { name: 'c', mail: 'test3@mail.com', phones: ['1232', '45s68'] }], status: '', recommandPerson: 'c', createdDate: new Date()},
]

const selectedKeys: Key[] = [];

export default function CustomerList() {
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')
    const searchInput = useRef<InputRef>(null)

    const getColumnSearchProps = (
        dataIndex: keyof CustomerInfo,
        getFieldValue?: (record: CustomerInfo) => string
    ): ColumnType<CustomerInfo> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`搜索 ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        搜索
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        重置
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) => {
            const fieldValue = getFieldValue ? getFieldValue(record) : record[dataIndex];
            return fieldValue
                ?.toString()
                .toLowerCase()
                .includes((value as string).toLowerCase());
        },
        onOpenChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterConfirmProps,
        dataIndex: string
    ) => {
        confirm()
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    }

    const handleReset = (clearFilters?: () => void) => {
        clearFilters?.()
        setSearchText('')
    }

    const columns: ColumnsType<CustomerInfo> = [
        {
            title: '客户编号',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id.localeCompare(b.id),
        },
        {
            title: '客户名称',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            ...getColumnSearchProps('status'),
            render: (status: string) => (
                <div>
                    <StatusSelector value={Number.parseInt(status)} type='status' editable={true}/>
                </div>
            ),
        },
        {
            title: '联系人',
            dataIndex: 'contact',
            key: 'contact',
            render: (contact: Contact[]) => (
                <div>
                    {contact.map((item, index) => (
                        <span>
                            {item.name}
                            {index < contact.length - 1 ? <br /> : null}
                        </span>
                    ))}
                </div>
            ),
            ...getColumnSearchProps('contact', (record) =>
                record.contact.map(c => c.name).join(' ')
            ),
        },
        {
            title: '联系电话',
            dataIndex: 'contact',
            key: 'contact',
            render: (contact: Contact[]) => (
                <div>
                    {contact.map((item) => (
                        item.phones.map((phone, index) =>
                            <span>
                                {phone}
                                {index < item.phones.length - 1 ? <br /> : null}
                            </span>
                        )))}
                </div>
            ),
        },
        {
            title: '上次跟进时间',
            dataIndex: 'contact',
            key: 'contact',
            render: (contact: Contact[]) => (
                <div>
                    {contact.map((item) => (
                        item.phones.map((phone, index) =>
                            <span>
                                {phone}
                                {index < item.phones.length - 1 ? <br /> : null}
                            </span>
                        )))}
                </div>
            ),
        },
        {
            title: '',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button onClick={() => searchFollowUp(record)}>查看</Button>
                    <Button type="link" onClick={() => handleEdit(record)} icon={<EditOutlined />}></Button>
                    <Button type="link" danger onClick={() => handleDelete(record)} icon={<DeleteOutlined />}></Button>
                </Space>
            ),
            width: 100
        }
    ]

    const searchFollowUp = (record: CustomerInfo) => {
        //查看客户更进, popover
    }

    const handleEdit = (record: CustomerInfo) => {
        console.log(record.id);
    }

    const handleDelete = (record: CustomerInfo) => {
        console.log(record.id);
    }

    return <Table columns={columns} dataSource={data} pagination={{ pageSize: 15 }}/>
}