'use client';

import { Button, Card, DatePicker, Descriptions, Divider, Form, Input, InputNumber, message, Modal, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { PlusOutlined, MinusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import BackButton from './BackButton';

interface Contact {
    id: string;
    name: string;
    mail: string;
    phone: Array<string>;
}

interface Project {
    name: string;
    type: string; // label
    amount: number;
    paidAmount: number;
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
const customerData: CustomerInfo = {
    id: '123',
    name: '客户A',
    contacts: [
        { id: 'a', name: '联系人1', mail: 'a@example.com', phone: ['13800000000'] },
        { id: 'b', name: '联系人2', mail: 'b@example.com', phone: ['13900000001', '13700000002'] },
    ],
    status: '潜在客户',
    tag: '重要',
    region: '上海',
    coordinator: '张三',
    position: '商务经理',
    projects: [
        { name: '项目A', type: '咨询', amount: 100000, paidAmount: 10000, createdTime: new Date('2024-01-01') },
    ],
    followUps: [
        { content: '首次电话沟通', time: new Date('2024-02-01') },
        { content: '发出初步方案', time: new Date('2024-02-10') },
    ],
    createdTime: new Date('2024-01-01'),
    recommand: '百度引荐',
};

const tagOptions = [
    { label: '高潜力', value: 'high' },
    { label: '普通', value: 'normal' },
    { label: '重要', value: 'important' },
];

export default function CustomerDetail() {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactForm] = Form.useForm();
    const [contactData, setContactData] = useState<{ contacts: Contact[] }>({
        contacts: [],
    });
    const [editingContactId, setEditingContactId] = useState<string | null>(null);
    const [deleteContactModalVisible, setDeleteContactModalVisible] = useState(false);
    const [toDeleteContact, setToDeleteContact] = useState<Contact | null>(null);

    const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
    const [followUpForm] = Form.useForm();
    const [followUpData, setFollowUpData] = useState<{ followUps: FollowUp[] }>({
        followUps: [],
    });
    const [projectData, setProjectData] = useState<{ projects: Project[] }>({ projects: [] });
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [projectForm] = Form.useForm();

    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [data, setData] = useState<CustomerInfo>(customerData);

    const contactColumns: ColumnsType<Contact> = [
        { title: '姓名', dataIndex: 'name', key: 'name' },
        { title: '邮箱', dataIndex: 'mail', key: 'mail' },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
            render: (phones: string[]) => phones.join(', ')
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleContactEdit(record)} icon={<EditOutlined />}></Button>
                    <Button type="link" danger onClick={() => handleContactDelete(record)} icon={<DeleteOutlined />}></Button>
                </Space>
            ),
            width: 100
        }
    ];


    const handleContactEdit = (record: Contact) => {
        contactForm.setFieldsValue(record);
        setEditingContactId(record.id);
        setIsContactModalOpen(true);
    };

    const handleContactDelete = (record: Contact) => {
        setToDeleteContact(record);
        setDeleteContactModalVisible(true);
    }

    const handleDeleteContactOk = () => {
        if (toDeleteContact) {
            setContactData(prev => ({
                ...prev,
                contacts: prev.contacts.filter(c => c.id !== toDeleteContact.id)
            }));
            message.success('联系人已删除');
        }
        setDeleteContactModalVisible(false);
        setToDeleteContact(null);
    };

    const handleDeleteContactCancel = () => {
        setDeleteContactModalVisible(false);
        setToDeleteContact(null);
    };

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

    const handleEdit = () => {
        setEditMode(true);
        form.setFieldsValue(data);
    };

    const handleCancel = () => {
        setEditMode(false);
        form.resetFields();
    };


    const handleAddFollowUp = async () => {
        try {
            const values = await followUpForm.validateFields();
            const newFollowUp: FollowUp = {
                content: values.content,
                time: new Date(), // 你可以自定义格式
            };

            setFollowUpData(prev => ({
                ...prev,
                followUps: [newFollowUp, ...prev.followUps],
            }));

            setIsFollowUpModalOpen(false);
            followUpForm.resetFields();
            message.success('添加成功');
        } catch {
            message.error('请输入跟进记录内容');
        }
    };

    const handleAddProject = async () => {
        try {
            const values = await projectForm.validateFields();
            const newProject: Project = {
                name: values.name,
                type: values.type,
                amount: values.amount,
                paidAmount: values.paidAmount,
                createdTime: values.createdTime.toDate(),
            };

            setProjectData(prev => ({
                ...prev,
                projects: [newProject, ...prev.projects],
            }));

            setIsProjectModalOpen(false);
            projectForm.resetFields();
            message.success('项目添加成功');
        } catch {
            message.error('请检查表单填写是否完整');
        }
    };


    const handleAddContact = async () => {
        try {
            const values = await contactForm.validateFields();
            const contact: Contact = {
                id: editingContactId || Date.now().toString(), //TODO: will replace id for new 
                name: values.name,
                mail: values.mail,
                phone: values.phone,
            };

            setData(prev => ({
                ...prev,
                contacts: editingContactId
                    ? prev.contacts.map(c => (c.id === editingContactId ? contact : c))
                    : [contact, ...prev.contacts],
            }));

            setIsContactModalOpen(false);
            contactForm.resetFields();
            setEditingContactId(null);
            message.success(editingContactId ? '联系人已更新' : '联系人添加成功');
        } catch {
            message.error('请完善联系人信息');
        }
    };

    const onDeleteCustomer = () => {
        Modal.confirm({
            title: '确认删除该客户？',
            content: '删除后将无法恢复，是否继续？',
            okText: '确认删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                message.success('客户已删除');
                // TODO: 调用实际删除 API 或跳转页面
            }
        });

    }

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

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <BackButton></BackButton>
                <Button danger onClick={() => onDeleteCustomer()}>删除</Button>
            </div>
            <div style={{ padding: 24 }}>
                {/* 主信息 */}
                <Card title="客户基本信息" variant={'borderless'}
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
                        <Descriptions column={2}>
                            <Descriptions.Item label="客户名称">
                                {editMode ? (
                                    <Form.Item name="name" noStyle>
                                        <Input />
                                    </Form.Item>
                                ) : (
                                    data.name
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="状态">
                                {editMode ? (
                                    <Form.Item name="status" noStyle>
                                        <Input />
                                    </Form.Item>
                                ) : (
                                    data.status
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="标签">
                                {editMode ? (
                                    <Form.Item name="tag" noStyle>
                                        <Select
                                            options={tagOptions}
                                            placeholder="请选择标签"
                                            style={{ width: 150 }}
                                        />
                                    </Form.Item>
                                ) : (
                                    data.tag
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="地区">
                                {editMode ? (
                                    <Form.Item name="region" noStyle>
                                        <Input />
                                    </Form.Item>
                                ) : (
                                    data.region
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="负责人">
                                {editMode ? (
                                    <Form.Item name="coordinator" noStyle>
                                        <Input />
                                    </Form.Item>
                                ) : (
                                    data.coordinator
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="职位">
                                {editMode ? (
                                    <Form.Item name="position" noStyle>
                                        <Input />
                                    </Form.Item>
                                ) : (
                                    data.position
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="推荐来源">
                                {editMode ? (
                                    <Form.Item name="recommand" noStyle>
                                        <Input />
                                    </Form.Item>
                                ) : (
                                    data.recommand
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="创建时间">
                                {data.createdTime.toLocaleDateString()}
                            </Descriptions.Item>
                        </Descriptions>
                    </Form>
                </Card>

                <Divider />

                {/* 联系人 */}
                <Card title="联系人信息" variant={'borderless'}
                    extra={<Button type="primary" onClick={() => setIsContactModalOpen(true)}>添加联系人</Button>}
                >
                    <Table rowKey="mail" dataSource={data.contacts} columns={contactColumns} pagination={false} />
                    <Modal
                        open={deleteContactModalVisible}
                        title="确认删除该联系人吗？"
                        okText="删除"
                        cancelText="取消"
                        onOk={handleDeleteContactOk}
                        onCancel={handleDeleteContactCancel}
                    >
                        <p>删除后将无法恢复，确定要删除吗？</p>
                    </Modal>
                </Card>

                <Modal
                    title="添加联系人"
                    open={isContactModalOpen}
                    onOk={handleAddContact}
                    onCancel={() => {
                        setIsContactModalOpen(false);
                        contactForm.resetFields();
                    }}
                    okText="保存"
                    cancelText="取消"
                >
                    <Form form={contactForm} layout="vertical">
                        <Form.Item
                            label="联系人姓名"
                            name="name"
                            rules={[{ required: true, message: '请输入姓名' }]}
                        >
                            <Input placeholder="如：张三" />
                        </Form.Item>

                        <Form.Item
                            label="邮箱"
                            name="mail"
                            rules={[
                                { required: true, message: '请输入邮箱地址' },
                                { type: 'email', message: '请输入有效的邮箱' },
                            ]}
                        >
                            <Input placeholder="example@example.com" />
                        </Form.Item>

                        <Form.List name="phone">
                            {(fields, { add, remove }) => (
                                <>
                                    <label>电话</label>
                                    {fields.map((field, index) => (
                                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item
                                                {...field}
                                                name={[field.name]}
                                                rules={[{ required: true, message: '请输入电话号码' }]}
                                            >
                                                <Input placeholder={`电话 ${index + 1}`} />
                                            </Form.Item>
                                            {fields.length > 1 && (
                                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                                            )}
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            添加电话
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form>
                </Modal>

                <Divider />

                {/* 项目信息 */}
                <Card title="相关项目" variant={'borderless'}
                    extra={<Button type="primary" onClick={() => setIsProjectModalOpen(true)}>添加项目</Button>}
                >
                    <Table rowKey="name" dataSource={data.projects} columns={projectColumns} pagination={false} />
                </Card>

                <Modal
                    title="添加项目"
                    open={isProjectModalOpen}
                    onOk={handleAddProject}
                    onCancel={() => {
                        setIsProjectModalOpen(false);
                        projectForm.resetFields();
                    }}
                    okText="保存"
                    cancelText="取消"
                >
                    <Form form={projectForm} layout="vertical">
                        <Form.Item
                            name="name"
                            label="项目名称"
                            rules={[{ required: true, message: '请输入项目名称' }]}
                        >
                            <Input placeholder="如：企业官网开发" />
                        </Form.Item>

                        <Form.Item
                            name="type"
                            label="类型"
                            rules={[{ required: true, message: '请输入项目类型' }]}
                        >
                            <Input placeholder="如：软件定制开发" />
                        </Form.Item>

                        <Form.Item
                            name="amount"
                            label="金额（¥）"
                            rules={[{ required: true, message: '请输入金额' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={0} placeholder="总金额" />
                        </Form.Item>

                        <Form.Item
                            name="paidAmount"
                            label="已付款（¥）"
                            rules={[{ required: true, message: '请输入已付款金额' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={0} placeholder="已付款金额" />
                        </Form.Item>

                        <Form.Item
                            name="createdTime"
                            label="创建时间"
                            rules={[{ required: true, message: '请选择创建时间' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Form>
                </Modal>

                <Divider />

                {/* 跟进记录 */}
                <Card title="跟进记录" variant={'borderless'}
                    extra={<Button type="primary" onClick={() => setIsFollowUpModalOpen(true)}>添加跟进</Button>}
                >
                    <Table rowKey="time" dataSource={data.followUps} columns={followColumns} pagination={false} />
                </Card>

                <Modal
                    title="添加跟进记录"
                    open={isFollowUpModalOpen}
                    onOk={handleAddFollowUp}
                    onCancel={() => {
                        setIsFollowUpModalOpen(false);
                        followUpForm.resetFields();
                    }}
                    okText="保存"
                    cancelText="取消"
                >
                    <Form form={followUpForm} layout="vertical">
                        <Form.Item
                            name="content"
                            label="跟进记录"
                            rules={[{ required: true, message: '请输入跟进记录内容' }]}
                        >
                            <Input.TextArea rows={6} placeholder="请输入具体的跟进内容..." />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}