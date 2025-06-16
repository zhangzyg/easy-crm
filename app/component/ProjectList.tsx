'use client';

import { Button, Table } from 'antd';
import StatusSelector from './StatusSelector'
import { ColumnsType } from 'antd/es/table';
import BackButton from './BackButton';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
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


    const columns: ColumnsType<Project> = [
        {
            title: '客户编号',
            dataIndex: 'customer_id',
            key: 'customer_id',
            render: (customer_id: string) => (
                <Button type="link" onClick={() => router.push(`/customer/detail?id=${customer_id}`)}>
                    {customer_id}
                </Button>
            )
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
            )
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
            render: (status_id: number) => (
                <div>
                    <StatusSelector value={status_id} type='projectStatus' editable={false} />
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