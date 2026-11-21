import { useState } from 'react'
import { Layout } from 'antd'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import './App.css'
const { Header, Content } = Layout

export default function App() {
  // 当前默认进入的首页是项目管理页面，这是第二节的内容
  // const [current, setCurrent] = useState('projects')
  // 当前默认进入的首页是任务管理页面，这是第三节的内容
  const [current, setCurrent] = useState('tasks')

  // 项目列表及任务进度数据（初始为空，后续通过新增项目与任务写入）
  const [projects, setProjects] = useState([])

  // 新增项目处理函数
  const handleAddProject = (newProject) => {
    console.log(newProject, '****************')
    const projectWithTasks = {
      ...newProject,
      tasks: newProject.tasks || []
    }
    setProjects([projectWithTasks, ...projects])
  }

  // 编辑项目处理函数
  const handleUpdateProject = (projectId, values) => {
    console.log('-----------', '主组件更新项目：', projectId, values)
    setProjects((prevProjects) =>
      prevProjects.map((item) => {
        if (item.id === projectId) {
          return {
            ...item,
            name: values.name,
            course: values.course,
            description: values.description || item.description || '暂无简介',
            folderPath: values.folderPath || item.folderPath || '待关联本地文件夹'
          }
        }
        return item
      })
    )
  }

  // 删除项目处理函数
  const handleDeleteProject = (projectId) => {
    console.log('-----------', '主组件删除项目：', projectId)
    setProjects((prevProjects) => prevProjects.filter((item) => item.id !== projectId))
  }

  // 新增任务处理函数
  const handleAddTask = (projectId, taskTitle) => {
    console.log('-----------', '主组件接收到新增任务：', projectId, taskTitle)
    const newTask = {
      id: `t_${Date.now()}`,
      title: taskTitle,
      completed: false
    }
    setProjects((prevProjects) =>
      prevProjects.map((item) => {
        if (item.id === projectId) {
          return {
            ...item,
            tasks: [...(item.tasks || []), newTask]
          }
        }
        return item
      })
    )
  }

  // 切换任务完成状态函数(勾选/取消勾选)
  const handleToggleTask = (projectId, taskId) => {
    console.log('-----------', '主组件切换任务完成状态：', { projectId, taskId })
    setProjects((prevProjects) =>
      prevProjects.map((item) => {
        if (item.id === projectId) {
          return {
            ...item,
            tasks: (item.tasks || []).map((task) =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
          }
        }
        return item
      })
    )
  }

  // 删除任务处理函数
  const handleDeleteTask = (projectId, taskId) => {
    console.log('-----------', '主组件删除任务：', { projectId, taskId })
    setProjects((prevProjects) =>
      prevProjects.map((item) => {
        if (item.id === projectId) {
          return {
            ...item,
            tasks: (item.tasks || []).filter((task) => task.id !== taskId)
          }
        }
        return item
      })
    )
  }

  const handleMenuChange = (key) => {
    setCurrent(key)
  }

  return (
    <Layout className="zhuomianbuju">
      <Sidebar current={current} onMenuChange={handleMenuChange}></Sidebar>
      <Layout>
        <Header className="dingbutoubu">
          <span>USY 项目制教学桌面工作平台</span>
        </Header>
        <Content className="neirongquyu">
          {current === 'dashboard' && <Dashboard projectList={projects} />}
          {current === 'projects' && (
            <Projects
              projectList={projects}
              onAddProject={handleAddProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
            />
          )}
          {current === 'tasks' && (
            <Tasks
              projectList={projects}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  )
}
