import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DeploymentUnitOutlined,
  CloudServerOutlined,
  UserOutlined,
  AndroidOutlined,
  ShopOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Button, theme } from 'antd'
import '../css/App.css'
import { Outlet, useNavigate } from 'react-router-dom'

const { Header, Sider, Content } = Layout

const BaseLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const navigate = useNavigate()

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
