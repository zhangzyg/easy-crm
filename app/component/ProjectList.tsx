'use client';

import { Button, Input, InputRef, Space, Table } from 'antd';
import StatusSelector from './StatusSelector'
import { ColumnsType, ColumnType } from 'antd/es/table';
import BackButton from './BackButton';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchOutlined } from '@ant-design/icons';

interface Project {
    projectId?: any;
    id?: string;
    customer_id: string;
    projectName: string;
    amount: string;
    paid: string;
    status_id: number;
}

interface Total {
    totalAmount: number;
    totalPaidAmount: number;
}

export default function ProjectList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [total, setTotal] = useState<Total | null>(null);
    const router = useRouter();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const [statusMap, setStatusMap] = useState<Map<number, string>>(new Map());

    const handleReceiveStatus = (mapFromChild: any[]) => {
        const map = new Map<number, string>();
        mapFromChild.forEach(child => map.set(child.id, child.label));
        setStatusMap(map);
    };


    const loadProjectList = async () => {
        const res = await fetch('/backend/api/project/list', {
            method: 'GET'
        });
        const result = await res.json();
        setProjects(result.projects);
        setTotal({
            totalAmount: result.totalAmount,
            totalPaidAmount: result.totalPaidAmount
        });
    }

    useEffect(() => {
        loadProjectList();
    }, []);

    const getColumnSearchProps = (
        dataIndex: keyof Project,
        customTextGetter?: (record: Project) => string
    ): ColumnType<Project> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`搜索 ${dataIndex}`}
                    value={(selectedKeys[0] || '') as string}
                    onChange={e =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => {
                        confirm();
                        setSearchText((selectedKeys[0] || '') as string);
                        setSearchedColumn(dataIndex as string);
                    }}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => {
                            confirm();
                            setSearchText((selectedKeys[0] || '') as string);
                            setSearchedColumn(dataIndex as string);
                        }}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        搜索
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters?.();
                            setSearchText('');
                        }}
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
            const text = customTextGetter
                ? customTextGetter(record)
                : record[dataIndex];
            return text?.toString().toLowerCase().includes((value as string).toLowerCase());
        },
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        }
    });


    const columns: ColumnsType<Project> = [
        {
            title: '客户编号',
            dataIndex: 'customer_id',
            key: 'customer_id',
            render: (customer_id: string) => (
                <Button type="link" onClick={() => router.push(`/customer/detail?id=${customer_id}`)}>
                    {customer_id}
                </Button>
            ),
            ...getColumnSearchProps('customer_id')
        },
        {
            title: '项目名称',
            dataIndex: 'projectName',
            key: 'projectName',
            sorter: (a, b) => a.projectName.localeCompare(b.projectName),
            render: (_, record: Project) => (
                <Button type="link" onClick={() => router.push(`/project/detail?id=${record.projectId}`)}>
                    {record.projectName}
                </Button>
            ),
            ...getColumnSearchProps('projectName')
        },
        {
            title: '项目金额',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: string) => (
                <span>{amount}元</span>
            ),
        },
        {
            title: '已付款',
            dataIndex: 'paid',
            key: 'paid',
            render: (paid: string) => (
                <span>{paid}元</span>
            ),
        },
        {
            title: '项目状态',
            dataIndex: 'status_id',
            key: 'status_id',
             ...getColumnSearchProps('status_id', (record) => statusMap?.get(record.status_id) || ''),
            render: (status_id: number) => (
                <div>
                    <StatusSelector value={status_id} type='projectStatus' editable={false} sendStatusMapToParent={handleReceiveStatus} />
                </div>
            )
        }
    ];
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <BackButton></BackButton>
                <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ color: 'green' }}>项目总支付额: {total?.totalPaidAmount}</span>
                    <span>项目总额: {total?.totalAmount}</span>
                </div>

            </div>
            <div>
                <Table columns={columns} dataSource={projects} pagination={{ pageSize: 15 }} />
            </div>
        </div>
    );
}