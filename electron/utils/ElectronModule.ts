export const SendMessage = <O, R>(Data: WorkerMessage<O, R>) => {
  process.send?.(Data);
};

export const BuildElectronModule = (module: { [key: string]: Function }) => {
  process.on('message', async (Data: WorkerMessage<unknown, unknown>) => {
    try {
      const MethodName = Data.Method.replace(`worker:`, '');
      Data.Result = await module[MethodName](Data.Options);
    } catch (err) {
      Data.Error = (err as Error).message;
    }
    return SendMessage(Data);
  });
};
