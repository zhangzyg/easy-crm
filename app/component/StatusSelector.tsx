'use client'
import { useState } from 'react'
import { Button, Dropdown, Menu, Modal, Input, Tag } from 'antd'
import { SketchPicker } from 'react-color';

export type StatusOption = {
  label: string
  color: string
}

const initialStatusList: StatusOption[] = [
  { label: '新建', color: '#87d068' },
  { label: '进行中', color: '#108ee9' },
  { label: '已完成', color: '#f50' },
]

export default function StatusSelector({ label }: { label: string }) {
  const [statusList, setStatusList] = useState<StatusOption[]>(initialStatusList)
  const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [newStatusName, setNewStatusName] = useState('')
  const [newStatusColor, setNewStatusColor] = useState('#1890ff')

  const handleAddStatus = () => {
    if (!newStatusName.trim()) return
    const newStatus: StatusOption = { label: newStatusName, color: newStatusColor }
    setStatusList([...statusList, newStatus])
    setSelectedStatus(newStatus)
    setNewStatusName('')
    setNewStatusColor('#1890ff')
    setModalVisible(false)
  }

  const menu = (
    <Menu>
      {statusList.map((status, index) => (
        <Menu.Item key={index} onClick={() => setSelectedStatus(status)}>
          <Tag color={status.color}>{status.label}</Tag>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <Menu.Item danger onClick={() => setModalVisible(true)}>
        添加状态
      </Menu.Item>
    </Menu>
  )

  return (
    <div>
      <Dropdown overlay={menu} trigger={['click']}>
        <Button style = {{ border: 'none' }}>
          {selectedStatus ? (
            <Tag color={selectedStatus.color} style={{ marginRight: 8 }}>
              {selectedStatus.label}
            </Tag>
          ) : (
            '选择状态'
          )}
        </Button>
      </Dropdown>

      <Modal
        title="添加新状态"
        open={modalVisible}
        onOk={handleAddStatus}
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
  )
}