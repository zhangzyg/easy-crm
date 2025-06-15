import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, message } from 'antd';
import { useRouter } from 'next/navigation';
import StatusSelector from './StatusSelector';

interface CreateButtonProps {
    createModule: string;
}

export default function CreateButton({ createModule }: CreateButtonProps) {
    const router = useRouter();

    // 控制 Modal 显示
    const [visible, setVisible] = useState(false);

    // 表单实例
    const [form] = Form.useForm();

    // 打开 Modal
    function onClickCustomerDetail() {
        setVisible(true);
    }

    // Modal 确认按钮事件
    async function handleOk() {
        try {
            // 表单校验
            const values = await form.validateFields();

            // 调用后端 API 创建客户
            const res = await fetch('backend/api/customer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const err = await res.json();
                message.error('创建失败: ' + err.error || '未知错误');
                return;
            }

            const createdCustomer = await res.json();

            message.success('客户创建成功！');

            setVisible(false);
            form.resetFields();

            // 跳转详情页，传入创建的客户id
            router.push(`/customer/detail?id=${createdCustomer.id}`);
        } catch (err) {
            // 表单校验失败会到这里
            console.log('表单校验失败:', err);
        }
    }

    return (
        <>
            <Button onClick={onClickCustomerDetail}>{createModule}</Button>

            <Modal
                title="创建客户"
                open={visible}
                onOk={handleOk}
                onCancel={() => {
                    setVisible(false);
                    form.resetFields();
                }}
                okText="确认"
                cancelText="取消"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="客户名称"
                        name="name"
                        rules={[{ required: true, message: '请输入客户名称' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="状态"
                        name="status_id"
                        rules={[{ required: true, message: '请选择状态' }]}
                    >
                        <StatusSelector type='status' editable={true}/>
                    </Form.Item>

                     <Form.Item
                        label="标签"
                        name="tag_id"
                        rules={[{ required: true, message: '请选择标签' }]}
                    >
                        <StatusSelector type='tag' editable={true}/>
                    </Form.Item>

                    <Form.Item label="地区" name="region">
                        <Input />
                    </Form.Item>

                    <Form.Item label="协调人" name="coordinator">
                        <Input />
                    </Form.Item>

                    <Form.Item label="职位" name="position">
                        <Input />
                    </Form.Item>

                    <Form.Item label="推荐人" name="recommand_person">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
