'use client';

import { Button, Card, DatePicker, Descriptions, Divider, Form, Input, InputNumber, message, Modal, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { PlusOutlined, MinusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import BackButton from './BackButton';
import StatusSelector from './StatusSelector';
import { useRouter, useSearchParams } from 'next/navigation';
import { CustomerFollowUp } from '@prisma/client';

export interface Contact {
    id?: string;
    name: string;
    mail: string;
    phone: Array<string>;
    customer_id: string;
}

interface Project {
    id?: string;
    name: string;
    type_id: number;
    status_id: number;
    amount: number;
    paid: number;
    created_date: Date;
    customer_id?: string;
}

interface FollowUp {
    id?: string;
    content: string;
    time: Date;
    customer_id?: string;
}

interface CustomerInfo {
    id: string;
    name: string;
    contacts: Array<Contact>;
    status: number;
    tag: number;
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
    id: '',
    name: '',
    contacts: [],
    status: 1,
    tag: 1,
    region: '',
    coordinator: '',
    position: '',
    projects: [],
    followUps: [],
    createdTime: new Date(),
    recommand: '',
};

export default function CustomerDetail() {

    const searchParams = useSearchParams();
    const customerId = searchParams.get('id') as string;
    const router = useRouter();

    useEffect(() => {
        getCustomerInfo(customerId);
    }, [customerId]);

    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactModalCreateMode, setContactModalCreateMode] = useState(true);
    const [contactModalTitle, setContactModalTitle] = useState('');
    const [contactForm] = Form.useForm();
    const [contactData, setContactData] = useState<Contact[]>([]);
    const [editingContactName, setEditingContactName] = useState<string | null>(null);
    const [deleteContactModalVisible, setDeleteContactModalVisible] = useState(false);
    const [toDeleteContact, setToDeleteContact] = useState<Contact | null>(null);

    const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
    const [followUpForm] = Form.useForm();
    const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);
    const [followUpData, setFollowUpData] = useState<FollowUp[]>([]);
    const [editingFollowUpId, setEditingFollowUpId] = useState<String>();
    const [followUpModalCreateMode, setFollowUpModalCreateMode] = useState<Boolean>(true);
    const [followUpModalTitle, setFollowUpModalTitle] = useState<String>('');
    const [toDeleteFollowUp, setToDeleteFollowUp] = useState<FollowUp | null>(null);
    const [deleteFollowUpModalVisible, setDeleteFollowUpModalVisible] = useState(false);

    const [projectData, setProjectData] = useState<Project[]>([]);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [projectForm] = Form.useForm();
    const [projectModalCreateMode, setProjectModalCreateMode] = useState<Boolean>(true);
    const [projectModalTitle, setProjectModalTitle] = useState<String>('');
    const [toDeleteProject, setToDeleteProject] = useState<Project | null>(null);
    const [deleteProjectModalVisible, setDeleteProjectModalVisible] = useState(false);

    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [data, setData] = useState<CustomerInfo>(customerData);

    const [deleteCustomerModalVisible, setDeleteCustomerModalVisible] = useState(false);

    useEffect(() => {
        if (contactModalCreateMode) {
            setContactModalTitle('添加联系人');
        } else {
            setContactModalTitle('更改联系人');
        }
    }, [contactModalCreateMode]);

    useEffect(() => {
        if (followUpModalCreateMode) {
            setFollowUpModalTitle('添加更进');
        } else {
            setFollowUpModalTitle('更改更进');
        }
    }, [followUpModalCreateMode]);

    useEffect(() => {
        if (projectModalCreateMode) {
            setProjectModalTitle('添加项目');
        } else {
            setProjectModalTitle('更改项目');
        }
    }, [projectModalCreateMode]);

    const getCustomerInfo = async (customerId: string) => {
        const res = await fetch(`/backend/api/customer?customerId=${customerId}`);
        const customer = await res.json();
        convert2CustomrInfo(customer.customer);
        convert2Contact(customer.contact);
        convert2CustomerFollowUp(customer.customerFollowUp);
        convert2Project(customer.project);
    };

    const convert2Project = (res: any[]) => {
        setProjectData(res);
    }

    const convert2CustomerFollowUp = (res: any[]) => {
        res.forEach(item => {
            item.created_time = new Date(item.created_time).toISOString().split('T')[0];
        })
        setFollowUpData(res);
    }

    const convert2Contact = (res: any[]) => {
        const map = new Map<string, Contact>();

        res.forEach(contact => {
            const key = `${contact?.name}-${contact?.mail}-${contact?.customer_id}`;

            if (!map.has(key)) {
                map.set(key, {
                    id: contact.id,
                    name: contact.name,
                    mail: contact.mail,
                    phone: [contact.phone],
                    customer_id: contact.customer_id,
                });
            } else {
                map.get(key)!.phone.push(contact.phone);
            }
        });
        let contacts: Contact[] = [];
        map.values().forEach(contact => contacts.push(contact));

        setContactData(contacts);
    };

    const contactColumns: ColumnsType<Contact> = [
        { title: '姓名', dataIndex: 'name', key: 'name' },
        { title: '邮箱', dataIndex: 'mail', key: 'mail' },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
            render: (phones: string[]) => phones?.join(', ')
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
        setIsContactModalOpen(true);
        setEditingContactName(record.name);
        setContactModalCreateMode(false);
    };

    const handleContactDelete = (record: Contact) => {
        setToDeleteContact(record);
        setDeleteContactModalVisible(true);
    }

    const handleDeleteContactOk = async () => {
        if (toDeleteContact) {
            await fetch(`/backend/api/customer/contact?contactName=${toDeleteContact.name}`, {
                method: 'DELETE'
            });
            setContactData(prev => prev.filter(item => item.name !== toDeleteContact.name));
            message.success('联系人已删除');
        }
        setDeleteContactModalVisible(false);
        setToDeleteContact(null);
    };

    const handleDeleteContactCancel = () => {
        setDeleteContactModalVisible(false);
        setToDeleteContact(null);
    };

    const handleDeleteFollowUpOk = async () => {
        if (toDeleteFollowUp) {
            await fetch(`/backend/api/customer/followup?followUpId=${toDeleteFollowUp.id}`, {
                method: 'DELETE'
            });
            setFollowUpData(prev => prev.filter(item => item.id !== toDeleteFollowUp.id));
            message.success('更进已删除');
        }
        setDeleteFollowUpModalVisible(false);
        setToDeleteFollowUp(null);
    }

    const handleDeleteFollowUpCancel = () => {
        setDeleteFollowUpModalVisible(false);
        setToDeleteFollowUp(null);
    };

    const projectColumns: ColumnsType<Project> = [
        {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
            render: (_, record: Project) => (
                <Button id={record.id} type='link' onClick={() => {
                    router.push(`/project/detail?id=${record.id}`)
                }}>{record.name}</Button>
            )
        },
        {
            title: '项目类型', dataIndex: 'type_id', key: 'type_id',
            render: (_, record: Project) => (
                <div>
                    <StatusSelector value={record.type_id} type='projectType' editable={false} />
                </div>
            ),
        },
        {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            render: (amt) => `${amt.toLocaleString()} 元`
        },
        {
            title: '创建时间',
            dataIndex: 'created_time',
            key: 'created_time',
            render: (time) => new Date(time).toLocaleDateString()
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" danger onClick={() => handleProjectDelete(record)} icon={<DeleteOutlined />}></Button>
                </Space>
            ),
            width: 100
        }
    ];

    const handleProjectDelete = (record: Project) => {
        setToDeleteProject(record);
        setDeleteProjectModalVisible(true);
    }

    const handleDeleteProjectOk = () => {
        if (toDeleteProject) {
            fetch(`/backend/api/project?projectId=${toDeleteProject.id}`, {
                method: 'DELETE'
            });
            const newProjectData = projectData.filter(item => item.id !== toDeleteProject.id);
            setProjectData(newProjectData);
            message.success('项目已删除');
            setDeleteProjectModalVisible(false);
            setToDeleteProject(null);
        }
    }

    const handleDeleteProjectCancel = () => {
        setDeleteProjectModalVisible(false);
        setToDeleteProject(null);
    };

    const handleDeleteCustomerOk = async () => {
        await fetch(`/backend/api/customer?customerId=${customerId}`, {
            method: 'DELETE'
        });
        message.success('客户已删除');
        setDeleteCustomerModalVisible(false);
        router.push('/customer/list');
    };

    const handleDeleteCustomerCancel = () => {
        setDeleteCustomerModalVisible(false);
    };

    const followColumns: ColumnsType<FollowUp> = [
        { title: '跟进内容', dataIndex: 'content', key: 'content' },
        {
            title: '时间',
            dataIndex: 'created_time',
            key: 'created_time',
            render: (time) => new Date(time).toLocaleDateString()
        }, {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleFollowUpEdit(record)} icon={<EditOutlined />}></Button>
                    <Button type="link" danger onClick={() => handleFollowUpDelete(record)} icon={<DeleteOutlined />}></Button>
                </Space>
            ),
            width: 100
        }
    ];

    const handleFollowUpEdit = (record: FollowUp) => {
        followUpForm.setFieldsValue(record);
        setIsFollowUpModalOpen(true);
        setEditingFollowUpId(record.id);
        setEditingFollowUp(record);
        setFollowUpModalCreateMode(false);
    };

    const handleFollowUpDelete = (record: FollowUp) => {
        setToDeleteFollowUp(record);
        setDeleteFollowUpModalVisible(true);
    }

    const handleEdit = () => {
        setEditMode(true);
        form.setFieldsValue(data);
    };

    const handleCancel = () => {
        setEditMode(false);
        form.resetFields();
    };

    const handleAddProject = async () => {
        try {
            const values = await projectForm.validateFields();
            const newProject: Project = {
                name: values.name,
                type_id: values.type_id,
                amount: values.amount,
                paid: values.paid,
                created_date: values.created_time.toDate(),
                status_id: values.status_id
            };

            newProject.customer_id = customerId;

            let updatedProject: Project;
            const res = await fetch('/backend/api/project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProject),
            });
            updatedProject = await res.json();

            projectData.push(updatedProject);
            setProjectData(projectData);
            message.success('添加成功');


            setIsProjectModalOpen(false);
            projectForm.resetFields();
            message.success('项目添加成功');
        } catch (e) {
            message.error('请检查表单填写是否完整');
            console.error(e);
        }
    };


    const handleAddOrEditContact = async () => {
        try {
            const values = await contactForm.validateFields();
            const contact: Contact = {
                customer_id: customerId,
                name: values.name,
                mail: values.mail,
                phone: values.phone,
            };

            let updatedContact: Contact;
            if (contactModalCreateMode) {
                const res = await fetch('/backend/api/customer/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(contact),
                });
                updatedContact = await res.json();
            } else {
                const res = await fetch(`/backend/api/customer/contact?contactName=${editingContactName}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(contact),
                })
                updatedContact = await res.json();
            }

            setContactData(prev => {
                if (contactModalCreateMode) {
                    if (prev.find(item => item.name === contact.name)) {
                        return prev;
                    }
                    prev.push(contact);
                } else {
                    prev.forEach(c => {
                        if (c.id === contact.id) {
                            c = contact;
                        }// 替换已有联系人
                        return c;
                    });
                }
                return prev;
            });

            setIsContactModalOpen(false);
            contactForm.resetFields();
            setEditingContactName(null);
            message.success(editingContactName ? '联系人已更新' : '联系人添加成功');
        } catch {
            message.error('请完善联系人信息');
        }
    };

    const onDeleteCustomer = () => {
        setDeleteCustomerModalVisible(true);
    }

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            values.status_id = data.status;
            values.tag_id = data.tag;
            values.id = data.id;
            await fetch(`/backend/api/customer`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            setData(values);
            setEditMode(false);
            message.success('保存成功');
        } catch (error) {
            message.error('请检查输入项');
        }
    };

    const convert2CustomrInfo = (customer: any) => {
        customerData.id = customer.id;
        customerData.name = customer.name;
        customerData.status = customer.status_id;
        customerData.tag = customer.tag_id;
        customerData.region = customer.region;
        customerData.coordinator = customer.coordinator;
        customerData.recommand = customer.recommand_person;
        customerData.createdTime = customer.created_date;
        customerData.position = customer.position;
        setData(customerData);
    }

    const handleAddOrEditFollowUp = async () => {
        try {
            const values = await followUpForm.validateFields();
            const payload: any = {
                customer_id: customerId,
                content: values.content,
            };

            if (!followUpModalCreateMode) {
                payload.id = editingFollowUp?.id;
                const res = await fetch(`/backend/api/customer/followup`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const result = await res.json();

                const newFollowUpData = followUpData.map(data => {
                    if (data.id === payload.id) {
                        data = result;
                    }
                    return data;
                });
                setFollowUpData(newFollowUpData);
                message.success('跟进记录已更新');
            } else {
                const res = await fetch(`/backend/api/customer/followup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const result = await res.json();
                followUpData.push(result);
                setFollowUpData(followUpData);
                message.success('添加成功');
            }

            setIsFollowUpModalOpen(false);
            followUpForm.resetFields();
            setEditingFollowUp(null);
        } catch {
            message.error('请输入跟进内容');
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <BackButton></BackButton>
                <Button danger onClick={() => onDeleteCustomer()}>删除</Button>
                <Modal
                    title="确认删除该客户？"
                    open={deleteCustomerModalVisible}
                    onOk={handleDeleteCustomerOk}
                    onCancel={handleDeleteCustomerCancel}
                    okText="确认删除"
                    okType="danger"
                    cancelText="取消"
                >
                    <p>删除后将无法恢复，是否继续？</p>
                </Modal>
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
                                <StatusSelector type={'status'} value={data.status} editable={editMode} onChange={(status) => data.status = status} />
                            </Descriptions.Item>
                            <Descriptions.Item label="标签">
                                <StatusSelector type={'tag'} value={data.tag} editable={editMode} onChange={(tag) => data.tag = tag} />
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
                                {new Date(customerData.createdTime).toLocaleDateString()}
                            </Descriptions.Item>
                        </Descriptions>
                    </Form>
                </Card>

                <Divider />

                {/* 联系人 */}
                <Card title="联系人信息" variant={'borderless'}
                    extra={<Button type="primary" onClick={() => {
                        setIsContactModalOpen(true);
                        setContactModalCreateMode(true);
                    }}>添加联系人</Button>}
                >
                    <Table rowKey="mail" dataSource={contactData} columns={contactColumns} pagination={false} />
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
                    title={contactModalTitle}
                    open={isContactModalOpen}
                    onOk={handleAddOrEditContact}
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
                <Card title={projectModalTitle} variant={'borderless'}
                    extra={<Button type="primary" onClick={() => {
                        setIsProjectModalOpen(true);
                        setProjectModalCreateMode(true);
                    }}>添加项目</Button>}
                >
                    <Table rowKey="name" dataSource={projectData} columns={projectColumns} pagination={false} />
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
                            name="type_id"
                            label="类型"
                            rules={[{ required: true, message: '请输入项目类型' }]}
                        >
                            <StatusSelector type={'projectType'} editable={true} />
                        </Form.Item>

                        <Form.Item
                            name="status_id"
                            label="状态"
                            rules={[{ required: true, message: '请输入项目状态' }]}
                        >
                            <StatusSelector type={'projectStatus'} editable={true} />
                        </Form.Item>

                        <Form.Item
                            name="amount"
                            label="金额（¥）"
                            rules={[{ required: true, message: '请输入金额' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={0} placeholder="总金额" />
                        </Form.Item>

                        <Form.Item
                            name="paid"
                            label="已付款（¥）"
                            rules={[{ required: true, message: '请输入已付款金额' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={0} placeholder="已付款金额" />
                        </Form.Item>

                        <Form.Item
                            name="created_time"
                            label="创建时间"
                            rules={[{ required: true, message: '请选择创建时间' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    open={deleteProjectModalVisible}
                    title="确认删除该项目吗？"
                    okText="删除"
                    cancelText="取消"
                    onOk={handleDeleteProjectOk}
                    onCancel={handleDeleteProjectCancel}
                >
                    <p>删除后将无法恢复，确定要删除吗？</p>
                </Modal>

                <Divider />

                {/* 跟进记录 */}
                <Card title="跟进记录" variant={'borderless'}
                    extra={<Button type="primary" onClick={() => {
                        setIsFollowUpModalOpen(true);
                        setFollowUpModalCreateMode(true);
                    }}>添加跟进</Button>}
                >
                    <Table rowKey="time" dataSource={followUpData} columns={followColumns} pagination={false} />
                </Card>

                <Modal
                    title={followUpModalTitle}
                    open={isFollowUpModalOpen}
                    onOk={handleAddOrEditFollowUp}
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

                <Modal
                    open={deleteFollowUpModalVisible}
                    title="确认删除该更进吗？"
                    okText="删除"
                    cancelText="取消"
                    onOk={handleDeleteFollowUpOk}
                    onCancel={handleDeleteFollowUpCancel}
                >
                    <p>删除后将无法恢复，确定要删除吗？</p>
                </Modal>
            </div>
        </div>
    );
}
