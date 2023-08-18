import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DeploymentUnitOutlined,
  CloudServerOutlined,
  UserOutlined,
  AndroidOutlined,
  ShopOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Button, theme, Dropdown, Space, message } from 'antd'
import '../css/App.css'
import { Outlet, useNavigate } from 'react-router-dom'
import useGlobalStore from '../store'
import { clearSessionToken } from '../utils/access'

const { Header, Sider, Content } = Layout

const BaseLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const { userStore } = useGlobalStore()

  const navigate = useNavigate()

  const handleLogout = () => {
    clearSessionToken()
    message.success('退出成功', 1, () => {
      navigate('/login')
    })
  }

  const items = [
    {
      key: '1',
      label: (
        <Button type="text" onClick={handleLogout}>
          退出系统
        </Button>
      ),
    },
  ]

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={'side'}
      >
        <Menu
          theme="dark"
          mode="inline"
          onClick={({ key }) => navigate(key)}
          items={[
            {
              key: '/devices',
              icon: <CloudServerOutlined />,
              label: '设备列表',
            },
            {
              key: '/location',
              icon: <ShopOutlined />,
              label: '安装实体管理',
            },
            {
              key: '/rom',
              icon: <AndroidOutlined />,
              label: '固件版本管理',
            },
            {
              key: '/iptv/plan',
              icon: <DeploymentUnitOutlined />,
              label: 'iptv方案',
            },
            {
              key: '/user',
              icon: <UserOutlined />,
              label: '用户列表',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div className="flex justify-between">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Dropdown
              className="pr-9"
              menu={{
                items,
              }}
            >
              <Space>
                {userStore.userInfo.name}
                <DownOutlined />
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
export default BaseLayout
