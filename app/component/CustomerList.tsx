'use client'

import { Table, Input, Button, Space } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { useState, useRef, Key, useEffect } from 'react'
import type { InputRef } from 'antd'
import StatusSelector from './StatusSelector'
import { useRouter } from 'next/navigation'

interface Contact {
    name: string;
    mail?: string;
    phones: Array<string>;
}


interface CustomerInfo {
    id: string;
    name: string;
    contact: Array<Contact>;
    status: number;
    recommandPerson: string;
    createdDate: Date;
}

interface CustomerDB {
    id: string;
    name: string;
    status_id: number;
    tag_id: number;
    region: string;
    coordinator: string;
    position: string;
    recommand_person: string;
    created_date: string;
    Contact: {
        name: string;
        phone: string;
    }[];
}

const data: CustomerInfo[] = [];

const selectedKeys: Key[] = [];

export default function CustomerList() {
    const router = useRouter();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [customerData, setData] = useState(data);
    const searchInput = useRef<InputRef>(null);
    const [statusMap, setStatusMap] = useState<Map<number, string>>(new Map());

    const handleReceiveStatus = (mapFromChild: any[]) => {
        const map = new Map<number, string>();
        mapFromChild.forEach(child => map.set(child.id, child.label));
        setStatusMap(map); 
    };

    useEffect(() => {
        (async () => {
            const res = await fetch(`/backend/api/customer/list`);
            const customerList = await res.json() as CustomerDB[];
            const dto = convert2CustomrInfo(customerList);
            setData(dto);
        })();
    }, []);

    function convert2CustomrInfo(dataFromDb: CustomerDB[]): CustomerInfo[] {
        return dataFromDb.map((item) => {
            const contactMap = new Map<string, Set<string>>();

            item.Contact.forEach(({ name, phone }) => {
                if (!contactMap.has(name)) {
                    contactMap.set(name, new Set());
                }
                contactMap.get(name)!.add(phone);
            });

            const contactArray: Contact[] = Array.from(contactMap.entries()).map(([name, phones]) => ({
                name,
                phones: Array.from(phones),
            }));

            return {
                id: item.id,
                name: item.name,
                contact: contactArray,
                status: item.status_id,
                recommandPerson: item.recommand_person,
                createdDate: new Date(item.created_date),
            };
        });
    }

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

    const onClickCustomerId = (id: string) => {
        router.push(`/customer/detail?id=${id}`);
    }

    const columns: ColumnsType<CustomerInfo> = [
        {
            title: '客户编号',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id.localeCompare(b.id),
            render: (id: string) => (
                <Button type="link" onClick={() => onClickCustomerId(id)}>{id}</Button>
            )
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
            ...getColumnSearchProps('status', (record) => statusMap?.get(record.status) || ''),
            render: (status: string, record: CustomerInfo) => (
                <div>
                    <StatusSelector value={Number.parseInt(status)} type='status' editable={true} onChange={(childStatus) => {
                        status = childStatus.toString();
                        fetch(`/backend/api/customer`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id: record.id,
                                status_id: Number.parseInt(status)
                            }),
                        });
                    }} sendStatusMapToParent={handleReceiveStatus} />
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
                        item.phones?.map((phone, index) =>
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
                    <Button type="link" danger onClick={() => handleDelete(record)} icon={<DeleteOutlined />}></Button>
                </Space>
            ),
            width: 100
        }
    ]

    const handleDelete = async (record: CustomerInfo) => {
        await fetch(`/backend/api/customer?customerId=${record.id}`, {
            method: 'DELETE'
        });
        const newList = customerData.filter(item => item.id !== record.id);
        setData(newList);
    }

    return <Table columns={columns} dataSource={customerData} pagination={{ pageSize: 15 }} />
}