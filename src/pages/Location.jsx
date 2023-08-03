import React, { useRef, useState } from 'react'
import {
  ProTable,
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components'
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Typography,
  Divider,
  message,
} from 'antd'
import { listLocation, addLocation, delLocation } from '../api/location'

function Location() {
  const actionRef = useRef()
  const [form] = Form.useForm()
  const formRef = useRef()
  const [open, setOpen] = useState(false)
  const [readOnly, setReadOnly] = useState(false)

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'index',
      title: '序号',
      width: 120,
    },

    {
      title: '名称',
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
          key="info"
          onClick={() => {
            setOpen(true)
            setReadOnly(true)
            form.setFieldsValue(record)
          }}
        >
          详情
        </Button>,
        <Button
          type="link"
          size="small"
          key="edit"
          onClick={() => {
            setOpen(true)
            form.setFieldsValue(record)
          }}
        >
          编辑
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
                delLocation(record.id)
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
    setReadOnly(false)
    form.resetFields()
  }
  const handleFinish = async (values) => {
    // console.log('最后提交数据', values);
    addLocation(values)
      .then((res) => {
        let msg = ''
        if (values.id) {
          msg = '更新成功'
        } else {
          msg = '新增成功'
        }
        message.success(msg)
        handleCancel()
        actionRef.current.reload()
      })
      .catch((e) => message.error('操作失败'))
  }

  return (
    <>
      <ProTable
        actionRef={actionRef}
        rowKey={'id'}
        key="device_table"
        columns={columns}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={async () => {
              setOpen(true)
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
          listLocation(params).then((res) => {
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
        title={'实体'}
        open={open}
        destroyOnClose
        onOk={handleOk}
        onCancel={handleCancel}
        footer={readOnly ? null : undefined}
      >
        <ProForm
          form={form}
          onFinish={handleFinish}
          layout="horizontal"
          submitter={false}
          formRef={formRef}
          readonly={readOnly}
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
                name="name"
                label={'名称'}
                labelCol={{ span: 5 }}
                placeholder="请输入安装实体名称"
                rules={[
                  {
                    required: true,
                    message: '请输入安装实体！',
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

export default Location
