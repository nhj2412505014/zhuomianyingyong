import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // 唤起系统原生文件夹选择窗口，返回用户选中的目录路径
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
  // 使用系统资源管理器打开指定目录
  openFolder: (lujing) => ipcRenderer.invoke('shell:openFolder', lujing)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
