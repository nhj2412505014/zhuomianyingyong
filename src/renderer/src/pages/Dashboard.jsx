import { useEffect, useState } from 'react'
import {
  ProjectOutlined,
  CheckSquareOutlined,
  CheckCircleOutlined,
  RiseOutlined
} from '@ant-design/icons'

// 数字滚动动效：从 0 平滑增长到目标值
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frameId
    const startTime = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      }
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [target, duration])

  return value
}

export default function Dashboard({ projectList = [] }) {
  // 汇总所有项目的任务数据
  const allTasks = projectList.flatMap((project) =>
    (project.tasks || []).map((task) => ({ ...task, projectName: project.name }))
  )
  const totalProjects = projectList.length
  const totalTasks = allTasks.length
  const completedTasks = allTasks.filter((task) => task.completed).length
  const pendingTasks = allTasks.filter((task) => !task.completed)
  const overallPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  // 统计数字的滚动动效
  const animProjects = useCountUp(totalProjects)
  const animTasks = useCountUp(totalTasks)
  const animDone = useCountUp(completedTasks)
  const animPercent = useCountUp(overallPercent)

  const tongjiKapian = [
    {
      key: 'projects',
      label: '项目总数',
      value: animProjects,
      suffix: '个',
      icon: <ProjectOutlined />,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.12)',
      c1: '#38bdf8',
      c2: '#818cf8'
    },
    {
      key: 'tasks',
      label: '任务总数',
      value: animTasks,
      suffix: '项',
      icon: <CheckSquareOutlined />,
      color: '#a78bfa',
      bg: 'rgba(167, 139, 250, 0.12)',
      c1: '#a78bfa',
      c2: '#e879f9'
    },
    {
      key: 'done',
      label: '已完成任务',
      value: animDone,
      suffix: '项',
      icon: <CheckCircleOutlined />,
      color: '#34d399',
      bg: 'rgba(52, 211, 153, 0.12)',
      c1: '#34d399',
      c2: '#22d3ee'
    },
    {
      key: 'rate',
      label: '整体完成率',
      value: animPercent,
      suffix: '%',
      icon: <RiseOutlined />,
      color: '#fbbf24',
      bg: 'rgba(251, 191, 36, 0.12)',
      c1: '#fbbf24',
      c2: '#f97316'
    }
  ]

  // 根据当前时间生成问候语
  const xianzai = new Date()
  const xiaoshi = xianzai.getHours()
  let wenhou = '晚上好'
  if (xiaoshi < 6) {
    wenhou = '凌晨好'
  } else if (xiaoshi < 12) {
    wenhou = '早上好'
  } else if (xiaoshi < 14) {
    wenhou = '中午好'
  } else if (xiaoshi < 18) {
    wenhou = '下午好'
  }
  const riqi = `${xianzai.getFullYear()} 年 ${xianzai.getMonth() + 1} 月 ${xianzai.getDate()} 日`

  return (
    <div className="keji-home">
      {/* 网格背景与霓虹光晕 */}
      <div className="keji-grid" />
      <div className="keji-glow keji-glow-a" />
      <div className="keji-glow keji-glow-b" />

      {/* 顶部标题与系统状态 */}
      <div className="keji-head usy-fade-up">
        <div>
          <div className="keji-title">USY 项目制教学工作台</div>
          <div className="keji-sub">
            {riqi} · {wenhou}，实时同步项目与任务数据
          </div>
        </div>
        <div className="keji-status">
          <span className="keji-dot" />
          SYSTEM ONLINE
        </div>
      </div>

      {/* 数据概览 */}
      <div className="keji-stats">
        {tongjiKapian.map((item, index) => (
          <div
            key={item.key}
            className="keji-stat usy-fade-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div
              className="keji-stat-icon"
              style={{ color: item.color, background: item.bg }}
            >
              {item.icon}
            </div>
            <div className="keji-stat-label">{item.label}</div>
            <div
              className="keji-stat-value"
              style={{ '--c1': item.c1, '--c2': item.c2 }}
            >
              {item.value}
              <span>{item.suffix}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 项目进度 + 待办任务 */}
      <div className="keji-panels">
        <div className="keji-panel usy-fade-up" style={{ animationDelay: '320ms' }}>
          <div className="keji-panel-head">
            <span className="keji-panel-title">项目进度</span>
            <span className="keji-panel-en">PROJECT PROGRESS · {totalProjects}</span>
          </div>

          {totalProjects === 0 ? (
            <div className="keji-empty">暂无项目，请先在【项目管理】中创建</div>
          ) : (
            projectList.map((project) => {
              const tasks = project.tasks || []
              const done = tasks.filter((task) => task.completed).length
              const percent = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100)
              return (
                <div className="keji-row" key={project.id}>
                  <div className="keji-row-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="keji-project-name">{project.name}</span>
                      <span className="keji-tag">{project.course}</span>
                    </div>
                    <span className="keji-count">
                      {done} / {tasks.length} · {percent}%
                    </span>
                  </div>
                  <div className="keji-bar">
                    <div className="keji-bar-fill" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="keji-panel usy-fade-up" style={{ animationDelay: '400ms' }}>
          <div className="keji-panel-head">
            <span className="keji-panel-title">待办任务</span>
            <span className="keji-panel-en">PENDING · {pendingTasks.length}</span>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="keji-empty">太棒了，所有任务都已完成</div>
          ) : (
            pendingTasks.slice(0, 6).map((task) => (
              <div className="keji-task" key={task.id}>
                <span className="keji-task-dot" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="keji-task-title" title={task.title}>
                    {task.title}
                  </div>
                  <div className="keji-task-sub">{task.projectName}</div>
                </div>
                <span className="keji-tag">待办</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
