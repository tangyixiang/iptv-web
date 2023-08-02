import React, { useRef, useState } from 'react'
import {
  ProTable,
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components'
import { Button, Modal, Form, Row, Col, Typography, Divider } from 'antd'
import service from '../utils/request'

function Devices() {
  const actionRef = useRef()
  const [form] = Form.useForm()
  const formRef = useRef()
  const [selectedRowsState, setSelectedRows] = useState([])
  const [currentRow, setCurrentRow] = useState({})
  const [modalVisible, setModalVisible] = useState(false)
  const [open, setOpen] = useState(false)

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'index',
      title: '序号',
      width: 48,
    },
    {
      title: '安装实体',
      dataIndex: 'location_id',
      key: 'location_id',
    },
    {
      title: '房间号',
      dataIndex: 'room_id',
      key: 'room_id',
    },
    {
      title: 'ROM版本',
      dataIndex: 'rom_version',
      key: 'rom_version',
      hideInSearch: true,
    },
    {
      title: 'IPTV方案',
      dataIndex: 'iptv_network_plan',
      key: 'iptv_network_plan',
      hideInSearch: true,
    },
    {
      title: 'MAC地址',
      dataIndex: 'mac_address',
      key: 'mac_address',
      hideInSearch: true,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip_address',
      key: 'ip_address',
      hideInSearch: true,
    },
    {
      title: '端口号',
      dataIndex: 'port',
      key: 'port',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      hideInSearch: true,
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="info"
          onClick={() => {
            setModalVisible(true)
            setCurrentRow(record)
          }}
        >
          详情
        </Button>,
        <Button
          type="link"
          size="small"
          key="edit"
          onClick={() => {
            setModalVisible(true)
            setCurrentRow(record)
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
                const success = await handleRemoveOne(record)
                if (success) {
                  actionRef.current?.reload()
                }
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
  const handleFinish = async (values) => {
    // console.log('最后提交数据', values);
    props.onSubmit(values)
    return true
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
              setCurrentRow(undefined)
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
          service.get('/device/list', { params: params }).then((res) => {
            const result = {
              data: res.list,
              total: res.total,
              success: true,
            }
            return result
          })
        }
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows)
            if (props.selectRow) {
              props.selectRow(selectedRows)
            }
          },
        }}
      />
      <Modal
        forceRender
        width={'40%'}
        title={'设备'}
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
                name="userId"
                label={'用户ID'}
                labelCol={{ span: 4 }}
                placeholder="请输入用户ID"
                disabled
                hidden={true}
                rules={[
                  {
                    required: false,
                    message: '请输入用户ID！',
                  },
                ]}
              />
            </Col>
          </Row>
          <Typography.Title level={5}>基本信息</Typography.Title>
          <Row gutter={[16, 16]}>
            <Col span={24} order={1}>
              <ProFormText
                name="location_id"
                label={'安装实体'}
                labelCol={{ span: 4 }}
                placeholder="请输入安装实体"
                rules={[
                  {
                    required: true,
                    message: '请输入安装实体！',
                  },
                ]}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24} order={1}>
              <ProFormText
                name="romm_id"
                label={'安装房间号'}
                labelCol={{ span: 4 }}
                placeholder="请输入安装房间号"
                rules={[
                  {
                    required: true,
                    message: '请输入安装房间号！',
                  },
                ]}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24} order={1}>
              <ProFormText
                name="location_id"
                label={'安装实体'}
                labelCol={{ span: 4 }}
                placeholder="请输入安装实体"
                rules={[
                  {
                    required: true,
                    message: '请输入安装实体！',
                  },
                ]}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24} order={1}>
              <ProFormText
                name="rom_version"
                label={'固件版本'}
                labelCol={{ span: 4 }}
                placeholder="请输入固件版本"
                rules={[
                  {
                    required: true,
                    message: '请输入固件版本！',
                  },
                ]}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24} order={1}>
              <ProFormText
                name="iptv_network_plan"
                label={'IPTV方案'}
                labelCol={{ span: 4 }}
                placeholder="请输入IPTV方案"
                rules={[
                  {
                    required: true,
                    message: '请输入IPTV方案！',
                  },
                ]}
              />
            </Col>
          </Row>
          <Divider />
          <Typography.Title level={5}>远程控制参数</Typography.Title>
          <Row gutter={[16, 16]}>
            <Col span={24} order={1}>
              <ProFormText
                name="mac_address"
                label={'MAC地址'}
                labelCol={{ span: 4 }}
                placeholder="请输入MAC地址"
                rules={[
                  {
                    required: true,
                    message: '请输入MAC地址！',
                  },
                ]}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24} order={1}>
              <ProFormText
                name="ip_address"
                label={'远程控制IP地址'}
                labelCol={{ span: 4 }}
                placeholder="请输入远程控制IP地址"
                rules={[
                  {
                    required: true,
                    message: '请输入远程控制IP地址！',
                  },
                ]}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24} order={1}>
              <ProFormText
                name="port"
                label={'端口'}
                labelCol={{ span: 4 }}
                placeholder="请输入端口"
                rules={[
                  {
                    required: true,
                    message: '请输入端口！',
                  },
                ]}
              />
            </Col>
          </Row>
          <Divider />
          <Typography.Title level={5}>其他信息</Typography.Title>
          <Row gutter={[16, 16]}>
            <Col span={24} order={1}>
              <ProFormTextArea
                name="other_info"
                label={'其他信息'}
                labelCol={{ span: 4 }}
              />
            </Col>
          </Row>
        </ProForm>
      </Modal>
    </>
  )
}

export default Devices
