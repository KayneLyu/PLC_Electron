import { ipcRenderer } from 'electron';
export type IPCRendererCallbackFunc<T> = (error: string | undefined, result?: T) => void;
export type IPCRendererFunc<O> = (Options?: O | undefined) => void;

/**
 * 构建渲染层函数调用
 * @param fx 原函数 注意:1.确保函数名可用 2.函数名与原函数名保持一致
 * */
const buildElectronRenderFunction = <O, R>(fx: IPCRendererCallbackFunc<R>, name: string) => {
  return (Options?: O) => {
    const Method = `worker:${name}`;
    const wm: WorkerMessage<O, R> = {
      Method,
      Options,
    };
    console.log('send worker message =>', wm);
    ipcRenderer.send('worker-message', wm);
    ipcRenderer.removeAllListeners(Method);
    ipcRenderer.on(Method, (e, data: WorkerMessage<O, R>) => {
      console.log(`worker result for ${Method} =>`, data);
      fx(data.Error, data.Result);
    });
  };
};

const buildElectronRenderModule = (module: Record<string, IPCRendererCallbackFunc<unknown>>) => {
  const build: Record<string, IPCRendererFunc<unknown>> = {};
  const keys = Object.keys(module);
  keys.forEach(d => {
    build[d] = buildElectronRenderFunction(module[d], d);
  });
  return build;
};

export default buildElectronRenderModule;
