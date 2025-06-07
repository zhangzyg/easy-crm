'use client'

import { Layout, Menu } from 'antd'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import 'antd/dist/reset.css'
import './globals.css'

const { Header, Sider, Content } = Layout

const items = [
  { label: <Link href="/">客户</Link>, key: '/' },
  { label: <Link href="/project/list">项目</Link>, key: '/project/list' }
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <html lang="en">
      <body>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider>
            <div className="text-white text-center p-4 text-xl font-bold">Easy CRM</div>
            <Menu theme="dark" mode="inline" selectedKeys={[pathname]} items={items} />
          </Sider>
          <Layout>
            <Header className="bg-white shadow" />
            <Content className="p-6 bg-gray-50">{children}</Content>
          </Layout>
        </Layout>
      </body>
    </html>
  )
}