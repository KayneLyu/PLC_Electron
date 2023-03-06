import { globalOperate } from '@/stores';
import buildElectronRenderModule from '@/utils/ElectronModule';

const ElectronRenderModule = buildElectronRenderModule({
  test: (error?: string, result?: unknown) => {
    const { setIPCData } = globalOperate();
    setIPCData(result);
    console.log('i got res =>', result);
  },
  initConnect: (error?: string, result?: unknown) => {
    if(error) {
      console.log('page：连接失败');
    } else {
      console.log('page：连接成功');
    }
  },
  addItem: (error?: string, result?: unknown) => {
    if(error) {
      console.log('page：写入失败');
    } else {
      console.log('page：写入成功');
    }
  }
});

export default ElectronRenderModule;
