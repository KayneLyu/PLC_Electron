import React, { useEffect } from 'react';
import ElectronRenderModule from '@/samples/node-api';
import { useGlobalState } from '@/stores';

const Home = () => {
  const { getIPCData } = useGlobalState();
  const data = getIPCData();
  useEffect(() => {}, []);
  const buildConnect = () => {
    ElectronRenderModule.initConnect();
  };
  const readItem = () => {
    ElectronRenderModule.test()
  };
  const writtenItem = () => {
    ElectronRenderModule.addItem();
  };
  return (
    <div>
      <button onClick={buildConnect}>建立连接</button>
      <button onClick={readItem}>读取操作</button>
      <button onClick={writtenItem}>写入操作</button>
      <div>读取结果:{JSON.stringify(data)}</div>
    </div>
  );
};

export default Home;
