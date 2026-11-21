import { useState } from 'react'
import { Card, Select, Space, Input, Button, Checkbox, Tag, Progress, List, Empty } from 'antd'
import {
  PlusOutlined,
  ProjectOutlined,
  DeleteOutlined,
  CheckCircleFilled,
  ClockCircleFilled
} from '@ant-design/icons'

export default function Tasks({ projectList = [], onAddTask, onToggleTask, onDeleteTask }) {
  // 当前选中项目的id，默认选中第一个项目
  const [currentProjectId, setCurrentProjectId] = useState(projectList[0]?.id)
  // 快速录入任务的输入内容
  const [taskInput, setTaskInput] = useState('')

  const currentProject =
    projectList.find((item) => item.id === currentProjectId) || projectList[0] || null

  // 如果系统里面没有任何项目，友好提示先去创建
  if (!projectList.length || !currentProject) {
    return (
      <div className="renwuguanli">
        <h2>任务管理清单</h2>
        <Empty
          style={{ marginTop: 60 }}
          description="系统暂无可用任务，请先前往左侧【项目管理】创建项目"
        />
      </div>
    )
  }

  // 当前项目的任务清单
  const tasks = currentProject.tasks || []
  // 任务完成情况统计
  const totalCount = tasks.length
  const completedCount = tasks.filter((task) => task.completed).length
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  // 切换所属项目
  const handleProjectChange = (value) => {
    setCurrentProjectId(value)
  }

  // 快速新增任务
  const handleCreateTask = () => {
    const title = taskInput.trim()
    if (!title) return
    if (onAddTask) {
      onAddTask(currentProject.id, title)
    }
    setTaskInput('')
  }

  // 勾选/取消勾选任务
  const handleToggleTask = (taskId) => {
    if (onToggleTask) {
      onToggleTask(currentProject.id, taskId)
    }
  }

  // 删除任务
  const handleDeleteTask = (taskId) => {
    if (onDeleteTask) {
      onDeleteTask(currentProject.id, taskId)
    }
  }

  return (
    <div className="renwuguanli">
      {/* 1. 顶部操作栏与项目选择器 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>任务管理清单</h2>
          <span style={{ color: '#8c8c8c', fontSize: '13px' }}>
            拆解实训阶段目标，标记完成情况并实时统计进度
          </span>
        </div>
        {/* 项目下拉选择器 */}
        <Space>
          <span style={{ fontSize: '14px', color: '#595959', fontWeight: 500 }}>
            <ProjectOutlined style={{ marginRight: 6 }} />
            切换所属项目:
          </span>
          <Select
            value={currentProject.id}
            onChange={handleProjectChange}
            style={{ width: 260 }}
            options={projectList.map((item) => ({
              label: item.name,
              value: item.id
            }))}
          />
        </Space>
      </div>

      {/* 2. 当前选中项目的基本信息与实时进度面板 */}
      <Card
        style={{ marginBottom: '20px', background: '#fafafa', border: '1px solid #f0f0f0' }}
        styles={{ body: { padding: '20px' } }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div>
            <span style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '10px' }}>
              {currentProject.name}
            </span>
            <Tag color="blue">{currentProject.course}</Tag>
          </div>
          <div style={{ fontSize: '13px', color: '#8c8c8c' }}>
            <span>
              总计: <b>{totalCount}</b> 项
            </span>
            <span style={{ margin: '0 8px' }}>|</span>
            <span style={{ color: '#52c41a' }}>
              已完成: <b>{completedCount}</b> 项
            </span>
            <span style={{ margin: '0 8px' }}>|</span>
            <span style={{ color: '#fa8c16' }}>
              待办: <b>{totalCount - completedCount}</b> 项
            </span>
          </div>
        </div>
        <Progress
          percent={percent}
          status={percent >= 100 ? 'success' : 'active'}
          strokeColor={{ '0%': '#1677ff', '100%': '#52c41a' }}
        />
      </Card>

      {/* 3. 极简任务快速录入输入框 */}
      <Space.Compact style={{ width: '100%', marginBottom: '20px' }}>
        <Input
          size="large"
          placeholder="输入实训待办任务，例如：完成前端页面开发与组件封装（支持按 Enter 回车快速添加）"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onPressEnter={handleCreateTask}
        />
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleCreateTask}>
          添加任务
        </Button>
      </Space.Compact>

      {/* 4. 当前项目的任务清单 */}
      <Card>
        {tasks.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="当前项目暂无任务，在上方输入框快速添加一个吧！"
          />
        ) : (
          <List
            dataSource={tasks}
            renderItem={(task) => (
              <List.Item
                key={task.id}
                actions={[
                  <Button
                    key="delete"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    删除
                  </Button>
                ]}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  {/* 左侧复选框 */}
                  <Checkbox checked={task.completed} onChange={() => handleToggleTask(task.id)} />
                  {/* 中间内容（已完成任务文字加删除线） */}
                  <span
                    style={{
                      fontSize: '14px',
                      color: task.completed ? '#8c8c8c' : '#262626',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    {task.title}
                  </span>

                  {/* 右侧状态 Tag */}
                  {task.completed ? (
                    <Tag icon={<CheckCircleFilled />} color="success">
                      已完成
                    </Tag>
                  ) : (
                    <Tag icon={<ClockCircleFilled />} color="warning">
                      待办
                    </Tag>
                  )}
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  )
}
