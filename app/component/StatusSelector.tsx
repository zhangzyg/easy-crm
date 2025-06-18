"use client";

import { useEffect, useState } from "react";
import { Button, Dropdown, Menu, Modal, Input, Tag } from "antd";
import { SketchPicker } from "react-color";
import { DeleteOutlined } from '@ant-design/icons';
import { Status } from "@prisma/client";

interface StatusSelectorProps {
  value?: number;
  onChange?: (id: number) => void;
  type:
  | "status"
  | "tag"
  | "projectType"
  | "projectStatus"
  | "followUpStatus";
  editable?: boolean | true;
  sendStatusMapToParent?: (map: Status[]) => void;
}

const initialStatusList: Status[] = [];

export default function StatusSelector({
  value,
  onChange,
  type,
  editable,
  sendStatusMapToParent
}: StatusSelectorProps) {
  const [statusList, setStatusList] =
    useState<Status[]>(initialStatusList);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");
  const [newStatusColor, setNewStatusColor] = useState("#1890ff");

  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(value ?? null);
  const selectedStatus = statusList.find((s) => s.id === selectedStatusId) || null;

  useEffect(() => {
    getColorLabelList();
  }, []);

  useEffect(() => {
    if (sendStatusMapToParent) {
      sendStatusMapToParent(statusList);
    }
  }, [statusList]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedStatusId(value);
    }
  }, [value]);

  const handleAddStatus = async () => {
    if (!newStatusName.trim()) return;
    const newStatus: any = {
      type: type,
      label: newStatusName,
      color: newStatusColor,
    };
    await fetch(`/backend/api/colorLabel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStatus)
    });
    await getColorLabelList();
    setModalVisible(false);
  };

  const getColorLabelList = async () => {
    try {
      const res = await fetch(`/backend/api/colorLabel?type=${type}`);
      const customerStatusList = await res.json();
      setStatusList(customerStatusList);
    } catch (err) {
      console.error("获取状态列表失败", err);
    }
  };

  const onDeleteColorLabel = async (record: Status) => {
    await fetch(`/backend/api/colorLabel?type=${type}&id=${record.id}`, {
      method: 'DELETE'
    });
    setStatusList(statusList.filter(item => item.id !== record.id));
  }

  const menu = (
    <Menu>
      {statusList.map((status) => (
        <Menu.Item
          key={status.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => {
            onChange?.(status.id); // 通知父组件更新
            setSelectedStatusId(status.id);
          }}
        >
          <Tag color={status.color} style={{ flex: 1 }}>
            {status.label}
          </Tag>
          <Button
            type="link"
            danger
            onClick={(e) => {
              e.stopPropagation(); // 阻止菜单关闭
              onDeleteColorLabel(status);
            }}
            icon={<DeleteOutlined />}
          />
        </Menu.Item>
      ))}
      <Menu.Divider />
      <Menu.Item danger onClick={() => setModalVisible(true)}>
        添加状态
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Dropdown overlay={menu} trigger={["click"]} disabled={!editable}>
        <Button
          type="text"
          onClick={() => getColorLabelList()}
        >
          {selectedStatus ? (
            <Tag color={selectedStatus.color} style={{ marginRight: 8 }}>
              {selectedStatus.label}
            </Tag>
          ) : (
            "选择状态"
          )}
        </Button>
      </Dropdown>

      <Modal
        title="添加新状态"
        open={modalVisible}
        onOk={() => handleAddStatus()}
        onCancel={() => setModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <Input
          placeholder="输入状态名称"
          value={newStatusName}
          onChange={(e) => setNewStatusName(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <SketchPicker
          color={newStatusColor}
          onChangeComplete={(color) => setNewStatusColor(color.hex)}
        />
      </Modal>
    </div>
  );
}
