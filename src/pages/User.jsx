import React, { useRef, useState } from 'react'
import {
  ProTable,
  ProForm,
  ProFormDigit,
  ProFormText,
} from '@ant-design/pro-components'
import { Button, Modal, Form, Row, Col, message } from 'antd'
import {
  addUser,
  delUser,
  updateUser,
  listUser,
  updatePassword,
} from '../api/user'
import { MD5 } from 'crypto-js'

function User() {
  const actionRef = useRef()
  const [form] = Form.useForm()
  const [form2] = Form.useForm()
  const formRef = useRef()
  const [open, setOpen] = useState(false)
  const [changePwd, setChangePwd] = useState(false)
  const [add, setAdd] = useState(true)

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'index',
      title: '序号',
      width: 120,
    },
    {
      title: '用户名',
      dataIndex: 'user_name',
      key: 'name',
    },
    {
      title: '真实名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      valueType: 'option',
      // width: 200,
      hideInSearch: true,
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          onClick={() => {
            setOpen(true)
            setAdd(false)
            form.setFieldsValue(record)
          }}
        >
          编辑
        </Button>,
        <Button
          type="link"
          size="small"
          key="edit"
          onClick={() => {
            setChangePwd(true)
            form2.setFieldsValue(record)
          }}
        >
          修改密码
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          onClick={async () => {
            Modal.confirm({
              title: '删除',
              content: '确定删除该项吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                delUser({ id: record.id })
                  .then((res) => {
                    actionRef.current?.reload()
                  })
                  .catch((e) => message.error('删除失败'))
              },
            })
          }}
        >
          删除
        </Button>,
      ],
    },
  ]

  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setOpen(false)
    form.resetFields()
  }
  const handleFinish = (values) => {
    // console.log('最后提交数据', values);
    if (values.id) {
      updateUser(values)
        .then((res) => {
          message.success('更新成功')
          handleCancel()
          actionRef.current.reload()
        })
        .catch((e) => {
          message.error('操作失败')
          handleCancel()
          actionRef.current.reload()
        })
    } else {
      addUser(values)
        .then((res) => message.success('新增成功'))
        .catch((e) => message.error('操作失败'))
    }
  }

  const handleUpdatePassword = (values) => {
    const data = { ...values, password: MD5(values.password).toString() }
    updatePassword(data).then((res) => message.success('更新成功'))
    setChangePwd(false)
  }

  return (
    <>
      <ProTable
        actionRef={actionRef}
        rowKey={'id'}
        key="user_table"
        columns={columns}
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={async () => {
              setOpen(true)
              setAdd(true)
            }}
          >
            新建
          </Button>,
        ]}
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `总共 ${total} 条`,
        }}
        request={(params) =>
          listUser(params).then((res) => {
            const result = {
              data: res.list,
              total: res.total,
              success: true,
            }
            return result
          })
        }
      />
      <Modal
        forceRender
        width={'40%'}
        title={'用户'}
        open={open}
        destroyOnClose
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ProForm
          form={form}
          onFinish={handleFinish}
          layout="horizontal"
          submitter={false}
          formRef={formRef}
        >
          <Row gutter={[16, 16]}>
            <Col span={24} order={1}>
              <ProFormDigit
                name="id"
                label={'id'}
                labelCol={{ span: 5 }}
                disabled
                hidden={true}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24} order={1}>
              <ProFormText
                name="user_name"
                label={'用户名'}
                labelCol={{ span: 5 }}
                placeholder="请输入用户名"
                rules={[
                  {
                    required: true,
                    message: '请输入用户名',
                  },
                ]}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24} order={1}>
              <ProFormText
                name="name"
                label={'真实名称'}
                labelCol={{ span: 5 }}
                placeholder="请输入真实名称"
                rules={[
                  {
                    required: true,
                    message: '请输入真实名称',
                  },
                ]}
              />
            </Col>
          </Row>
          {add && (
            <Row gutter={[16, 16]}>
              <Col span={24} order={1}>
                <ProFormText.Password
                  name="password"
                  type={'password'}
                  label={'密码'}
                  labelCol={{ span: 5 }}
                  placeholder="请输入密码"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码',
                    },
                  ]}
                />
              </Col>
            </Row>
          )}
        </ProForm>
      </Modal>
      <Modal
        width={'40%'}
        title={'修改密码'}
        open={changePwd}
        onCancel={() => setChangePwd(false)}
        onOk={() => form2.submit()}
      >
        <ProForm
          form={form2}
          onFinish={handleUpdatePassword}
          layout="horizontal"
          submitter={false}
          formRef={formRef}
        >
          <Row gutter={[16, 16]}>
            <Col span={24} order={1}>
              <ProFormDigit
                name="id"
                label={'id'}
                labelCol={{ span: 5 }}
                disabled
                hidden={true}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24} order={1}>
              <ProFormText.Password
                name="password"
                label={'新密码'}
                labelCol={{ span: 5 }}
                placeholder="请输入新密码"
                rules={[
                  {
                    required: true,
                    message: '请输入新密码',
                  },
                ]}
              />
            </Col>
          </Row>
        </ProForm>
      </Modal>
    </>
  )
}

export default User
