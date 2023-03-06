import React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider, Global } from '@emotion/react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { StyledGlobal } from '@/assets/styles/Global';
import Router from '@/Router';

const emotionCache = createCache({
  key: 'key',
  container: document.body,
});

const App = () => {
  return (
    <CacheProvider value={emotionCache}>
      <ConfigProvider locale={zhCN} autoInsertSpaceInButton={false}>
        <Global styles={StyledGlobal} />
        <Router />
      </ConfigProvider>
    </CacheProvider>
  );
};

export default App;
