'use client';

import { Card, Descriptions, Table, Button, Space, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import BackButton from './BackButton';
import { genProjectId } from '../backend/util';
import StatusSelector from './StatusSelector';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';

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
    projectType: number;
    projectStatus: number;
    quoteAmount: string;
    paidAmount: string;
    createdAt: any;
}

export default function ProjectDetail() {
    const [steps, setSteps] = useState<ProjectStep[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [stepsForm] = Form.useForm();
    const [editMode, setEditMode] = useState(false);

    const searchParams = useSearchParams();
    const projectId = searchParams.get('id') as string;

    const router = useRouter();

    useEffect(() => {
        onLoadProject(projectId);
    }, [projectId]);

    const onLoadProject = async (projectId: string) => {
        const promise = await fetch(`/backend/api/project?projectId=${projectId}`, {
            method: 'GET'
        })
        const res = await promise.json();
        convertProjectInfo(res.project);
        convertFollowUp(res.followUps);
    }

    function convertProjectInfo(project: any) {
        const projectData: ProjectDetail = {
            customerId: project.customer_id,
            productName: project.name,
            projectType: project.type_id,
            projectStatus: project.status_id,
            quoteAmount: project.amount,
            paidAmount: project.paid,
            createdAt: dayjs(project.created_date)
        };
        setData(projectData);
    }

    function convertFollowUp(followUps: any[]) {
        const newSteps = followUps.map(item => {
            const step: ProjectStep = {
                id: '',
                date: '',
                stage: '',
                status_id: 0,
                mode: '',
                project_id: ''
            };
            return step;
        });
        setSteps(newSteps);
    }

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
        projectType: 1,
        projectStatus: 1,
        quoteAmount: '',
        paidAmount: '',
        createdAt: new Date(),
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
            const project = {
                name: values.productName,
                type_id: values.projectType,
                status_id: values.projectStatus,
                amount: values.quoteAmount,
                paid: values.paidAmount,
                created_date: new Date(values.createdAt)
            };
            project.id = projectId;
            await fetch('/backend/api/project', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(project),
            })
            values.customerId = data.customerId;
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
                                <a onClick={() => router.push(`/customer/detail?id=${data.customerId}`)}>{data.customerId}</a>
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
                                <StatusSelector type={'projectType'} value={data.projectType} editable={editMode} onChange={(type) => data.projectType = type} />
                            </Descriptions.Item>

                            <Descriptions.Item label="项目状态" span={1}>
                                <StatusSelector type={'projectStatus'} value={data.projectStatus} editable={editMode} onChange={(status) => data.projectStatus = status} />
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
                                {editMode ? (
                                    <Form.Item name="createdAt" label="时间" rules={[{ required: true, message: '请选择时间' }]} noStyle>
                                        <DatePicker style={{ width: '50%' }} />
                                    </Form.Item>
                                ) : (dayjs(data.createdAt).format('YYYY/MM/DD'))
                                }
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
                    <Form form={stepsForm} layout="vertical">
                        <Form.Item name="date" label="时间" rules={[{ required: true, message: '请选择时间' }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="stage" label="阶段名称" rules={[{ required: true, message: '请输入阶段名称' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="stageStatus" label="阶段状态" rules={[{ required: true, message: '请输入阶段状态' }]}>
                            <StatusSelector type={'followUpStatus'} value={0} editable={true}/>
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
