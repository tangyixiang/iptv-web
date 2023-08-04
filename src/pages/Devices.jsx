import React, { useRef, useState, useEffect } from 'react'
import {
  ProTable,
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
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
  Tag,
  Space,
} from 'antd'
import {
  listDevice,
  addDevice,
  delDevice,
  rebootDevice,
  changeDeviceEth,
  changeDeviceHotspot,
  changeDeviceWifi,
  apkopenDevice,
  getDeviceConfig,
} from '../api/devices'
import { allLocation } from '../api/location'
import { allIptvPlan } from '../api/iptv_plan'
import { allRom } from '../api/rom'

function Devices() {
  const actionRef = useRef()
  const [form] = Form.useForm()
  const [maintainForm] = Form.useForm()
  const formRef = useRef()
  const maintainFormRef = useRef()
  const [open, setOpen] = useState(false)
  const [maintineModal, setMaintineModal] = useState(false)
  const [readOnly, setReadOnly] = useState(false)
  const [deviceId, setDeviceId] = useState()

  const [locationEnum, setLocationEnum] = useState({})
  const [romEnum, setRomEnum] = useState({})
  const [iptvEnum, setIptvEnum] = useState({})

  useEffect(() => {
    allLocation().then((res) => {
      const result = res.data.reduce((acc, obj) => {
        acc[obj.id] = obj.name
        return acc
      }, {})
      setLocationEnum(result)
    })
    allIptvPlan().then((res) => {
      const result = res.data.reduce((acc, obj) => {
        acc[obj.id] = obj.name
        return acc
      }, {})
      setIptvEnum(result)
    })
    allRom().then((res) => {
      const result = res.data.reduce((acc, obj) => {
        acc[obj.id] = obj.name
        return acc
      }, {})
      setRomEnum(result)
    })
  }, [])

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
      valueType: 'select',
      valueEnum: locationEnum,
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
      valueType: 'select',
      valueEnum: romEnum,
    },
    {
      title: 'IPTV方案',
      dataIndex: 'iptv_network_plan',
      key: 'iptv_network_plan',
      hideInSearch: true,
      valueType: 'select',
      valueEnum: iptvEnum,
    },
    {
      title: '状态',
      key: 'status',
      render: () => <Tag color="green">在线</Tag>,
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
      title: 'MAC地址',
      dataIndex: 'mac_address',
      key: 'mac_address',
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
          key="reboot"
          onClick={async () => {
            Modal.confirm({
              title: '重启设备',
              content: '确定重启设备?',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                rebootDevice({ deviceId: record.id })
                  .then((res) => {
                    message.success('设备重启中')
                  })
                  .catch((e) => message.error('设备重启失败'))
              },
            })
          }}
        >
          重启设备
        </Button>,
        <Button
          type="link"
          size="small"
          key="maintain"
          onClick={() => {
            getDeviceConfig({ id: record.id }).then((res) => {
              if (res.data) {
                maintainForm.setFieldsValue({
                  apk_model:
                    res.data.apk_install_swtich == 1 ? 'true' : 'false',
                  eth_open: res.data.eth_swtich == 1 ? 'true' : 'false',
                  eth_ip_model: res.data.eth_ip_method,
                  eth_ip_address: res.data.eth_ip_address,
                  eth_mask: res.data.eth_net_mask,
                  eth_gateway: res.data.eth_gateway,

                  wlan_open: res.data.wlan_swtich == 1 ? 'true' : 'false',
                  wlan_ssid: res.data.wlan_ssid,
                  wlan_password: res.data.wlan_password,

                  hotspot_open: res.data.hotspot_swtich == 1 ? 'true' : 'false',
                  hotspot_name: res.data.hotspot_ssid,
                  hotspot_password: res.data.hotspot_password,
                })
              }
              setMaintineModal(true)
              setDeviceId(record.id)
            })
          }}
        >
          远程维护
        </Button>,
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
              content: '确定删除该项吗?',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                delDevice(record.id)
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
    addDevice(values)
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

  const handleMaintineCancel = () => {
    setMaintineModal(false)
    maintainForm.resetFields()
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
          listDevice(params).then((res) => {
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
        title={'设备'}
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
                placeholder="请输入用户ID"
                disabled
                hidden={true}
              />
            </Col>
          </Row>
          <Typography.Title level={5}>基本信息</Typography.Title>
          <Row gutter={[16, 16]}>
            <Col span={24} order={1}>
              <ProFormSelect
                name="location_id"
                label={'安装实体'}
                labelCol={{ span: 5 }}
                placeholder="请输入安装实体"
                valueEnum={locationEnum}
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
                name="room_id"
                label={'安装房间号'}
                labelCol={{ span: 5 }}
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
              <ProFormSelect
                name="rom_version"
                label={'固件版本'}
                labelCol={{ span: 5 }}
                placeholder="请输入固件版本"
                valueEnum={romEnum}
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
              <ProFormSelect
                name="iptv_network_plan"
                label={'IPTV方案'}
                labelCol={{ span: 5 }}
                placeholder="请输入IPTV方案"
                valueEnum={iptvEnum}
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
                labelCol={{ span: 5 }}
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
                labelCol={{ span: 5 }}
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
                labelCol={{ span: 5 }}
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
                labelCol={{ span: 5 }}
              />
            </Col>
          </Row>
        </ProForm>
      </Modal>
      <Modal
        forceRender
        width={'60%'}
        title={'设备维护'}
        open={maintineModal}
        destroyOnClose
        onCancel={handleMaintineCancel}
        footer={null}
      >
        <ProForm
          form={maintainForm}
          onFinish={handleFinish}
          layout="horizontal"
          submitter={false}
          formRef={maintainFormRef}
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
          <div className="flex justify-between items-end">
            <Typography.Title level={5}>管理配置信息</Typography.Title>
            <Button
              type="primary"
              size="small"
              className="mb-2"
              onClick={() => {
                const data = {
                  deviceId: deviceId,
                  open: maintainForm.getFieldValue('apk_model'),
                }
                apkopenDevice(data)
                  .then((res) => message.success('修改成功'))
                  .catch((e) => message.error('修改失败'))
              }}
            >
              修改
            </Button>
          </div>

          <Row gutter={[16, 16]}>
            {/* <Col span={12} order={1}>
              <ProFormText
                name="location_id"
                label={'管理密码'}
                labelCol={{ span: 6 }}
                placeholder="请输入管理密码"
              />
            </Col> */}
            <Col span={12} order={1}>
              <ProFormSelect
                name="apk_model"
                label={'APK服务安装开关'}
                labelCol={{ span: 6 }}
                valueEnum={{
                  true: '开启',
                  false: '关闭',
                }}
              />
            </Col>
          </Row>

          <div className="flex justify-between items-end">
            <Typography.Title level={5}>有线配置信息</Typography.Title>
            <Button
              type="primary"
              size="small"
              className="mb-2"
              onClick={() => {
                const data = {
                  deviceId: deviceId,
                  open: maintainForm.getFieldValue('eth_open'),
                  ip_model: maintainForm.getFieldValue('eth_ip_model'),
                  ip_address: maintainForm.getFieldValue('eth_ip_address'),
                  mask: maintainForm.getFieldValue('eth_mask'),
                  gateway: maintainForm.getFieldValue('eth_gateway'),
                }
                changeDeviceEth(data)
                  .then((res) => message.success('修改成功'))
                  .catch((e) => message.error('修改失败'))
              }}
            >
              修改
            </Button>
          </div>
          <Row gutter={[16, 16]}>
            <Col span={12} order={1}>
              <ProFormSelect
                name="eth_open"
                label={'有线开关'}
                labelCol={{ span: 5 }}
                valueEnum={{
                  true: '开启',
                  false: '关闭',
                }}
              />
            </Col>
            <Col span={12} order={1}>
              <ProFormSelect
                name="eth_ip_model"
                label={'IP获取模式'}
                labelCol={{ span: 6 }}
                valueEnum={{
                  dhcp: 'DHCP',
                  manual: '固定IP',
                }}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12} order={1}>
              <ProFormText
                name="eth_ip_address"
                label={'IP地址'}
                labelCol={{ span: 6 }}
                placeholder={'请输入ip地址'}
              />
            </Col>
            <Col span={12} order={1}>
              <ProFormText
                name="eth_mask"
                label={'子网掩码'}
                labelCol={{ span: 6 }}
                placeholder={'请输入子网掩码信息'}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12} order={1}>
              <ProFormText
                name="eth_gateway"
                label={'网关'}
                labelCol={{ span: 6 }}
                placeholder={'请输入网关信息'}
              />
            </Col>
          </Row>
          <div className="flex justify-between items-end">
            <Typography.Title level={5}>无线信息</Typography.Title>
            <Button
              type="primary"
              size="small"
              className="mb-2"
              onClick={() => {
                const data = {
                  deviceId: deviceId,
                  open: maintainForm.getFieldValue('wlan_open'),
                  ssid: maintainForm.getFieldValue('wlan_ssid'),
                  password: maintainForm.getFieldValue('wlan_password'),
                }
                changeDeviceWifi(data)
                  .then((res) => message.success('修改成功'))
                  .catch((e) => message.error('修改失败'))
              }}
            >
              修改
            </Button>
          </div>
          <Row gutter={[16, 16]}>
            <Col span={12} order={1}>
              <ProFormSelect
                name="wlan_open"
                label={'开关'}
                labelCol={{ span: 6 }}
                valueEnum={{
                  true: '开启',
                  false: '关闭',
                }}
              />
            </Col>
            <Col span={12} order={1}>
              <ProFormText
                name="wlan_ssid"
                label={'WIFI SSID'}
                labelCol={{ span: 6 }}
                placeholder={'请输入SSID'}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12} order={1}>
              <ProFormText
                name="wlan_password"
                label={'访问密码'}
                labelCol={{ span: 6 }}
                placeholder={'请输入密码'}
              />
            </Col>
          </Row>
          <div className="flex justify-between items-end">
            <Typography.Title level={5}>热点配置信息</Typography.Title>
            <Button
              type="primary"
              size="small"
              className="mb-2"
              onClick={() => {
                const data = {
                  deviceId: deviceId,
                  open: maintainForm.getFieldValue('hotspot_open'),
                  ssid: maintainForm.getFieldValue('hotspot_name'),
                  password: maintainForm.getFieldValue('hotspot_password'),
                }
                changeDeviceHotspot(data)
                  .then((res) => message.success('修改成功'))
                  .catch((e) => message.error('修改失败'))
              }}
            >
              修改
            </Button>
          </div>
          <Row gutter={[16, 16]}>
            <Col span={12} order={1}>
              <ProFormSelect
                name="hotspot_open"
                label={'网络热点开关'}
                labelCol={{ span: 6 }}
                valueEnum={{
                  true: '开启',
                  false: '关闭',
                }}
              />
            </Col>
            <Col span={12} order={1}>
              <ProFormText
                name="hotspot_name"
                label={'热点名称'}
                labelCol={{ span: 5 }}
                placeholder={'请输入SSID'}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12} order={1}>
              <ProFormText
                name="hotspot_password"
                label={'访问密码'}
                labelCol={{ span: 5 }}
                placeholder={'请输入密码'}
              />
            </Col>
          </Row>
        </ProForm>
      </Modal>
    </>
  )
}

export default Devices
