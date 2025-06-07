'use client';

import { Card, Descriptions, Table, Button, Space, Modal, Form, Input, DatePicker, Select } from 'antd';
import { useState } from 'react';
import BackButton from './BackButton';

const { Option } = Select;

interface ProjectStep {
    key: string;
    date: string;
    stage: string;
    status: string;
}

export default function ProjectDetail() {
    const [steps, setSteps] = useState<ProjectStep[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleAddStep = () => {
        form.validateFields().then(values => {
            const newStep: ProjectStep = {
                key: `${Date.now()}`,
                date: values.date.format('YYYY-MM-DD'),
                stage: values.stage,
                status: values.status
            };
            setSteps([...steps, newStep]);
            setIsModalOpen(false);
            form.resetFields();
        });
    };

    const columns = [
        {
            title: '时间',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: '阶段名称',
            dataIndex: 'stage',
            key: 'stage',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: ProjectStep) => (
                <Space>
                    <Button type="link" danger onClick={() => setSteps(steps.filter(s => s.key !== record.key))}>
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div>
                <BackButton></BackButton>
            </div>
            <div style={{ padding: 24 }}>
                <Card title="项目详情" variant={'borderless'} style={{ marginBottom: 24 }}>
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="签单客户编号">CUS-20240601</Descriptions.Item>
                        <Descriptions.Item label="产品名称">企业级CRM系统</Descriptions.Item>
                        <Descriptions.Item label="项目类型">软件定制开发</Descriptions.Item>
                        <Descriptions.Item label="报价金额">¥ 120,000</Descriptions.Item>
                        <Descriptions.Item label="项目创建时间">2025-06-07</Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card
                    title="项目流程"
                    extra={<Button type="primary" onClick={() => setIsModalOpen(true)}>添加项目进度</Button>}
                >
                    <Table columns={columns} dataSource={steps} pagination={false} />
                </Card>

                <Modal
                    title="添加项目进度"
                    open={isModalOpen}
                    onOk={handleAddStep}
                    onCancel={() => setIsModalOpen(false)}
                    destroyOnClose
                >
                    <Form form={form} layout="vertical">
                        <Form.Item name="date" label="时间" rules={[{ required: true, message: '请选择时间' }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="stage" label="阶段名称" rules={[{ required: true, message: '请输入阶段名称' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
                            <Select>
                                <Option value="已完成">已完成</Option>
                                <Option value="进行中">进行中</Option>
                                <Option value="待开始">待开始</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}