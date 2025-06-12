'use client';

import { Card, Descriptions, Table, Button, Space, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import BackButton from './BackButton';
import { genProjectId } from '../backend/util';
import { Status } from '../generated/prisma';
import { get } from 'http';

const { Option } = Select;

export interface ProjectStep {
    id: string;
    date: string;
    stage: string;
    status_id: number;
    mode: string;
    project_id: string;
}

interface ProjectDetail {
    customerId: string;
    productName: string;
    projectType: string;
    quoteAmount: string;
    paidAmount: string;
    createdAt: string;
}

export default function ProjectDetail() {
    const [steps, setSteps] = useState<ProjectStep[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false);

    const handleAddStep = async () => {
        form.validateFields().then(async (values) => {
            const newStep: ProjectStep = {
                id: values.id ? values.id : genProjectId(),
                date: values.date.format('YYYY-MM-DD'),
                stage: values.stage,
                status_id: values.status_id,
                mode: 'init',
                project_id: values.project_id
            };
            setSteps([...steps, newStep]);
            setIsModalOpen(false);
            form.resetFields();
            await post('/backend/api/project/followup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStep),
            });
        });

    };

    // useEffect(async () => {
    //     if(isModalOpen) {
    //         const colorLabel = await fetch('/backend/api/colorLabel', {
    //             method: 'GET',
    //             headers: { 'Content-Type': 'application/json' },
    //         })
    //         setCustomerStatus(colorLabel); 
    //     }
    // } ,[isModalOpen]);

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
            title: '',
            key: 'action',
            render: (_: any, record: ProjectStep) => (
                <Space>
                    <Button type="link" danger onClick={() => setSteps(steps.filter(s => s.key !== record.key))}>
                        删除
                    </Button>
                </Space>
            ),
            width: 10
        },
    ];

    const [data, setData] = useState<ProjectDetail>({
        customerId: '',
        productName: '',
        projectType: '',
        quoteAmount: '',
        paidAmount: '',
        createdAt: '',
    });

    const handleEdit = () => {
        setEditMode(true);
        form.setFieldsValue(data);
    };

    const handleCancel = () => {
        setEditMode(false);
        form.resetFields();
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setData(values);
            setEditMode(false);
            message.success('保存成功');
        } catch (error) {
            message.error('请检查输入项');
        }
    };

    const onDeleteProject = () => {
        //open a popover, 确定要删除, 确定，取消
    }

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <BackButton></BackButton>
                <Button danger onClick={() => onDeleteProject()}>删除</Button>
            </div>
            <div style={{ padding: 24 }}>
                <Card
                    title="项目详情"
                    style={{ marginBottom: 24 }}
                    extra={
                        editMode ? (
                            <Space>
                                <Button type="primary" onClick={handleSave}>保存</Button>
                                <Button onClick={handleCancel}>取消</Button>
                            </Space>
                        ) : (
                            <Button onClick={handleEdit}>编辑</Button>
                        )
                    }
                >
                    <Form form={form} layout="vertical">
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="签单客户编号" span={1}>
                                {editMode ? (
                                    <Form.Item name="customerId" rules={[{ required: true }]} noStyle>
                                        <Input />
                                    </Form.Item>
                                ) : (
                                    data.customerId
                                )}
                            </Descriptions.Item>

                            <Descriptions.Item label="产品名称" span={1}>
                                {editMode ? (
                                    <Form.Item name="productName" rules={[{ required: true }]} noStyle>
                                        <Input />
                                    </Form.Item>
                                ) : (
                                    data.productName
                                )}
                            </Descriptions.Item>

                            <Descriptions.Item label="项目类型" span={1}>
                                {editMode ? (
                                    <Form.Item name="projectType" rules={[{ required: true }]} noStyle>
                                        <Input />
                                    </Form.Item>
                                ) : (
                                    data.projectType
                                )}
                            </Descriptions.Item>

                            <Descriptions.Item label="报价金额" span={1}>
                                {editMode ? (
                                    <Form.Item name="quoteAmount" rules={[{ required: true }]} noStyle>
                                        <Input />
                                    </Form.Item>
                                ) : (
                                    data.quoteAmount
                                )}
                            </Descriptions.Item>

                            <Descriptions.Item label="报价金额" span={1}>
                                {editMode ? (
                                    <Form.Item name="paidAmount" rules={[{ required: true }]} noStyle>
                                        <Input />
                                    </Form.Item>
                                ) : (
                                    data.paidAmount
                                )}
                            </Descriptions.Item>

                            <Descriptions.Item label="项目创建时间" span={2}>
                                {data.createdAt}
                            </Descriptions.Item>
                        </Descriptions>
                    </Form>
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

function post(arg0: string, arg1: { method: string; headers: { 'Content-Type': string; }; body: string; }) {
    throw new Error('Function not implemented.');
}
