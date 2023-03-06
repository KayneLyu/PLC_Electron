import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { release } from 'node:os';
import { resolve } from 'node:path';
import { fork, ChildProcess } from 'node:child_process';

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = resolve(__dirname, '../');
process.env.DIST = resolve(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? resolve(process.env.DIST_ELECTRON, '../public') : process.env.DIST;

if (require('electron-squirrel-startup')) app.quit();

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
let worker: ChildProcess | null = null;

const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = resolve(process.env.DIST, 'index.html');
const workerPath = resolve(__dirname, '../worker/index.js');

const createWindow = async () => {
  win = new BrowserWindow({
    title: 'Main window',
    icon: resolve(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    initWorker();
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
ipcMain.on('worker-message', (_, args: WorkerMessage<unknown, unknown>) => {
  console.log('send message to worker =>', args);
  worker?.send?.(args);
});
const initWorker = () => {
  worker = fork(workerPath, [], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'], env: process.env });
  worker.on('message', (Result: WorkerMessage<unknown, unknown>) => {
    console.log('worker message =>', Result);
    if (win && win.webContents.send) win.webContents.send(`${Result.Method}`, Result);
  });
  worker.on('exit', code => {
    // 当进程退出
  });
  worker.on('uncaughtException', err => {
    // 捕获进程未捕获的异常
  });
  worker.on('error', err => {
    // 当进程出错
  });
};
