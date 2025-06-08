'use client';

import { Card, Descriptions, Divider, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Contact {
  name: string;
  mail: string;
  phone: Array<string>;
}

interface Project {
  name: string;
  type: string; // label
  amount: number;
  createdTime: Date;
}

interface FollowUp {
  content: string;
  time: Date;
}

interface CustomerInfo {
  id: string;
  name: string;
  contacts: Array<Contact>;
  status: string;
  tag: string;
  region: string;
  coordinator: string;
  position: string;
  projects: Array<Project>;
  followUps: Array<FollowUp>;
  createdTime: Date;
  recommand: string;
}

// 示例数据（实际可通过 props 或 API 获取）
const data: CustomerInfo = {
  id: '123',
  name: '客户A',
  contacts: [
    { name: '联系人1', mail: 'a@example.com', phone: ['13800000000'] },
    { name: '联系人2', mail: 'b@example.com', phone: ['13900000001', '13700000002'] },
  ],
  status: '潜在客户',
  tag: '重要',
  region: '上海',
  coordinator: '张三',
  position: '商务经理',
  projects: [
    { name: '项目A', type: '咨询', amount: 100000, createdTime: new Date('2024-01-01') },
  ],
  followUps: [
    { content: '首次电话沟通', time: new Date('2024-02-01') },
    { content: '发出初步方案', time: new Date('2024-02-10') },
  ],
  createdTime: new Date('2024-01-01'),
  recommand: '百度引荐',
};

export default function CustomerDetail() {
  const contactColumns: ColumnsType<Contact> = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'mail', key: 'mail' },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      render: (phones: string[]) => phones.join(', ')
    }
  ];

  const projectColumns: ColumnsType<Project> = [
    { title: '项目名称', dataIndex: 'name', key: 'name' },
    { title: '项目类型', dataIndex: 'type', key: 'type' },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amt) => `${amt.toLocaleString()} 元`
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      render: (time) => new Date(time).toLocaleDateString()
    }
  ];

  const followColumns: ColumnsType<FollowUp> = [
    { title: '跟进内容', dataIndex: 'content', key: 'content' },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      render: (time) => new Date(time).toLocaleString()
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* 主信息 */}
      <Card title="客户基本信息" variant={'borderless'}>
        <Descriptions column={2}>
          <Descriptions.Item label="客户名称">{data.name}</Descriptions.Item>
          <Descriptions.Item label="状态">{data.status}</Descriptions.Item>
          <Descriptions.Item label="标签">{data.tag}</Descriptions.Item>
          <Descriptions.Item label="地区">{data.region}</Descriptions.Item>
          <Descriptions.Item label="负责人">{data.coordinator}</Descriptions.Item>
          <Descriptions.Item label="职位">{data.position}</Descriptions.Item>
          <Descriptions.Item label="推荐来源">{data.recommand}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.createdTime.toLocaleDateString()}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      {/* 联系人 */}
      <Card title="联系人信息" bordered={false}>
        <Table rowKey="mail" dataSource={data.contacts} columns={contactColumns} pagination={false} />
      </Card>

      <Divider />

      {/* 项目信息 */}
      <Card title="相关项目" bordered={false}>
        <Table rowKey="name" dataSource={data.projects} columns={projectColumns} pagination={false} />
      </Card>

      <Divider />

      {/* 跟进记录 */}
      <Card title="跟进记录" bordered={false}>
        <Table rowKey="time" dataSource={data.followUps} columns={followColumns} pagination={false} />
      </Card>
    </div>
  );
}