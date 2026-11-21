import { useState } from 'react'
import { Card, Row, Col, Button, Modal, Form, Input, Tag, Space, message } from 'antd'
import {
  PlusOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'

export default function Projects({ projectList = [], onAddProject, onUpdateProject, onDeleteProject }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 为 null 表示新增，否则为正在编辑的项目
  const [editingProject, setEditingProject] = useState(null)
  const [form] = Form.useForm()
  const isEdit = !!editingProject

  // 打开新增弹窗
  const handleOpenCreate = () => {
    setEditingProject(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  // 打开编辑弹窗并回填数据
  const handleOpenEdit = (item) => {
    setEditingProject(item)
    form.setFieldsValue({
      name: item.name,
      course: item.course,
      folderPath: item.folderPath,
      description: item.description
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
    form.resetFields()
  }

  // 唤起系统原生文件夹选择窗口
  const handleSelectFolder = async () => {
    if (!window.api?.selectFolder) {
      message.warning('当前环境不支持选择本地文件夹，请在桌面端应用中使用')
      return
    }

    const xuanzhongLujing = await window.api.selectFolder()
    if (xuanzhongLujing) {
      form.setFieldsValue({ folderPath: xuanzhongLujing })
    }
  }

  // 使用系统资源管理器打开项目目录
  const handleOpenFolder = async (item) => {
    if (!window.api?.openFolder) {
      message.warning('当前环境不支持打开本地文件夹，请在桌面端应用中使用')
      return
    }

    const jieguo = await window.api.openFolder(item.folderPath)
    if (jieguo && !jieguo.success) {
      message.warning(jieguo.message || '打开文件夹失败')
    }
  }

  // 删除项目记录二次确认
  const handleConfirmDelete = (item) => {
    Modal.confirm({
      title: '确认移除项目记录',
      content: (
        <div>
          <div>确定要从工作台移除项目「{item.name}」吗？</div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
            仅从工作台删除记录（含名下任务），不会删除电脑上的真实文件夹。
          </div>
        </div>
      ),
      okText: '确定移除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        if (onDeleteProject) {
          onDeleteProject(item.id)
        }
      }
    })
  }

  const handleFormFinish = (values) => {
    console.log('++++++++++', values)
    if (isEdit) {
      if (onUpdateProject) {
        onUpdateProject(editingProject.id, values)
      }
    } else {
      const newProject = {
        id: `p_${Date.now()}`,
        name: values.name,
        course: values.course,
        description: values.description || '暂无简介',
        createdAt: new Date().toISOString().split('T')[0],
        folderPath: values.folderPath || '待关联本地文件夹'
      }
      if (onAddProject) {
        onAddProject(newProject)
      }
    }
    setIsModalOpen(false)
    setEditingProject(null)
    form.resetFields()
  }

  return (
    <div className="xiangmuguanli">
      {/* 顶部操作栏 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>我的教学项目</h2>
          <span style={{ color: '#8c8c8c', fontSize: '13px' }}>
            共管理 {projectList.length} 个进行中的实训项目
          </span>
        </div>
        <Button onClick={handleOpenCreate} type="primary" icon={<PlusOutlined />}>
          新增项目
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {projectList.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.id}>
            <Card
              hoverable
              title={<span style={{ fontWeight: 'bold' }}>{item.name}</span>}
              style={{ height: '100%' }}
              extra={<Tag color="blue">{item.course}</Tag>}
              actions={[
                <span key="edit" onClick={() => handleOpenEdit(item)}>
                  <EditOutlined style={{ marginRight: '5px' }} />
                  编辑
                </span>,
                <span
                  key="delete"
                  onClick={() => handleConfirmDelete(item)}
                  style={{ color: '#ff4d4f' }}
                >
                  <DeleteOutlined style={{ marginRight: '5px' }} />
                  删除
                </span>
              ]}
            >
              {/* 项目简介 */}
              <p
                style={{
                  color: '#595959',
                  minHeight: '42px',
                  lineHeight: '21px',
                  margin: '0 0 12px 0'
                }}
              >
                {item.description}
              </p>
              {/* 本地目录与打开入口 */}
              <div
                style={{
                  fontSize: '12px',
                  color: '#8c8c8c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                  <FolderOutlined />
                  <span
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title={item.folderPath}
                  >
                    {item.folderPath}
                  </span>
                </div>
                <Button
                  type="link"
                  size="small"
                  icon={<FolderOpenOutlined />}
                  style={{ padding: 0, flexShrink: 0 }}
                  onClick={() => handleOpenFolder(item)}
                >
                  打开目录
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 新增 / 编辑项目弹窗 */}
      <Modal
        title={isEdit ? '编辑实训项目' : '新建教学实训项目'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText={isEdit ? '保存修改' : '创建'}
        cancelText="取消"
      >
        <Form form={form} onFinish={handleFormFinish} layout="vertical">
          <Form.Item
            name="name"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="例如：金融数据上链存证系统" />
          </Form.Item>
          <Form.Item
            name="course"
            label="所属课程"
            rules={[{ required: true, message: '请输入所属课程' }]}
          >
            <Input placeholder="例如：区块链技术原理及应用" />
          </Form.Item>
          <Form.Item name="folderPath" label="本地项目目录">
            <Space.Compact style={{ width: '100%' }}>
              <Input readOnly placeholder="未选择，点击右侧按钮选择本地项目文件夹" />
              <Button icon={<FolderOutlined />} onClick={handleSelectFolder}>
                选择文件夹
              </Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item name="description" label="项目简介">
            <Input.TextArea rows={3} placeholder="简要描述项目的核心目标，技术栈或者成果要求" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
