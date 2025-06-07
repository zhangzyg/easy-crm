'use client';

import { Table } from 'antd';
import StatusSelector, { StatusOption } from './StatusSelector'
import { ColumnsType } from 'antd/es/table';

interface Project {
    customerName: string;
    productName: string;
    productAmount: number;
    paidAmount: number;
    status: string;
}

const data: Project[] = [{ customerName: '公司A', productName: '项目A', productAmount: 10000, paidAmount: 100, status: '新建' }];

export default function ProjectList() {
    const columns: ColumnsType<Project> = [
        {
            title: '客户名称',
            dataIndex: 'customerName',
            key: 'customerName',
            sorter: (a, b) => a.customerName.localeCompare(b.customerName),
        },
        {
            title: '项目名称',
            dataIndex: 'productName',
            key: 'productName',
            sorter: (a, b) => a.productName.localeCompare(b.productName),
        },
        {
            title: '项目金额',
            dataIndex: 'productAmount',
            key: 'productAmount',
            render: (productAmount: number) => (
                <span>{productAmount}元</span>
            ),
        },
        {
            title: '已付款',
            dataIndex: 'paidAmount',
            key: 'paidAmount',
            render: (productAmount: number) => (
                <span>{productAmount}元</span>
            ),
        },
        {
            title: '项目状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <div>
                    <StatusSelector label={status} />
                </div>
            )
        }
    ];
    return <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }}/>;
}