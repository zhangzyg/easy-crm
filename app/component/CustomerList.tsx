'use client'

import { Table, Input, Button, Space } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { SearchOutlined } from '@ant-design/icons'
import { useState, useRef } from 'react'
import type { InputRef } from 'antd'

interface Contact {
  name: string;
  mail: string;
  phones: Array<string>;
}
interface CustomerInfo {
  id: string;
  name: string;
  contact: Array<Contact>;
}

const data: CustomerInfo[] = [
  { id: '2', name: '公司B', contact: [{ name: '李四', mail: 'test@mail.com', phones: ['123', '45s6'] }] },
  { id: '3', name: '公司C', contact: [{ name: '王五', mail: 'test@mail.com', phones: ['123', '45s6'] }] },
  { id: '1', name: '公司A', contact: [{ name: '张三', mail: 'test@mail.com', phones: ['123', '45s6'] }] },
]

const selectedKeys: string[] = [];

export default function CustomerList() {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const getColumnSearchProps = (dataIndex: keyof CustomerInfo): ColumnType<CustomerInfo> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`搜索 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          //   onPressEnter={() => handleSearch([], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
  })

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterConfirmProps,
    dataIndex: string
  ) => {
    // confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters?: () => void) => {
    clearFilters?.()
    setSearchText('')
  }

  const columns: ColumnsType<CustomerInfo> = [
    {
      title: '客户编号',
      dataIndex: 'id',
      key: 'id',
      ...getColumnSearchProps('id'),
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
      render: (contact: Contact[]) => (
        <div>
          {contact.map((item, index) => (
            <span>
              {item.name}
              {index < contact.length - 1 ? <br /> : null}
            </span>
          ))}
        </div>
      ),
      ...getColumnSearchProps('contact'),
    },
    {
      title: '联系人邮箱',
      dataIndex: 'contact',
      key: 'contact',
      render: (contact: Contact[]) => (
        <div>
          {contact.map((item, index) => (
            <span>
              {item.mail}
              {index < contact.length - 1 ? <br /> : null}
            </span>
          ))}
        </div>
      ),
      ...getColumnSearchProps('contact'),
    },
    {
      title: '联系电话',
      dataIndex: 'contact',
      key: 'contact',
      render: (contact: Contact[]) => (
        <div>
          {contact.map((item, index) => (
            item.phones.map(phone, index) =>
          ))}
        </div>
      ),
      ...getColumnSearchProps('contact'),
    },
  ]

  return <Table columns={columns} dataSource={data} />
}