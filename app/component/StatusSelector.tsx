"use client";

import { useEffect, useState } from "react";
import { Button, Dropdown, Menu, Modal, Input, Tag } from "antd";
import { SketchPicker } from "react-color";
import { Status } from "../generated/prisma";

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
}

const initialStatusList: Status[] = [];

export default function StatusSelector({
  value,
  onChange,
  type,
  editable
}: StatusSelectorProps) {
  const [statusList, setStatusList] =
    useState<Status[]>(initialStatusList);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");
  const [newStatusColor, setNewStatusColor] = useState("#1890ff");

  const selectedStatus = statusList.find((s) => s.id === value) || null;

  const handleAddStatus = () => {
    if (!newStatusName.trim()) return;
    const newId = Math.max(...statusList.map((s) => s.id)) + 1;
    const newStatus: Status = {
      id: newId,
      label: newStatusName,
      color: newStatusColor,
    };
    const updated = [...statusList, newStatus];
    setStatusList(updated);
    onChange?.(newStatus.id);
    setNewStatusName("");
    setNewStatusColor("#1890ff");
    setModalVisible(false);
  };

  const getCustomerStatus = async () => {
    try {
      const res = await fetch(`/backend/api/colorLabel?type=${type}`);
      const customerStatusList = await res.json();
      setStatusList(customerStatusList);
    } catch (err) {
      console.error("获取状态列表失败", err);
    }
  };

  useEffect(() => {
    getCustomerStatus();
  }, [type]);

  const menu = (
    <Menu>
      {statusList.map((status) => (
        <Menu.Item key={status.id} onClick={() => onChange?.(status.id)}>
          <Tag color={status.color}>{status.label}</Tag>
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
        <Button style={{ border: "none" }}>
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
