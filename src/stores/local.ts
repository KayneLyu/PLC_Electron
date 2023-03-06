/**
 * 获取本地离线数据
 * */
export const getSessionData = <T>(key: string, defaultVal: T) => {
  const data = sessionStorage.getItem(key);
  if (data) {
    /* 如果存在数据 则解析返回 */
    return JSON.parse(data) as T;
  }
  if (defaultVal) {
    /* 如果默认值不为空值 则设置为默认值 */
    sessionStorage.setItem(key, JSON.stringify(defaultVal));
  }
  return defaultVal;
};

/**
 * 保存数据到本地离线
 * */
export const setSessionData = <T>(key: string, defaultVal: T) => {
  if (defaultVal) {
    /* 默认值不为空 则存储默认值 */
    sessionStorage.setItem(key, JSON.stringify(defaultVal));
  } else {
    /* 默认值为空值 移除默认值 */
    sessionStorage.removeItem(key);
  }
  return defaultVal;
};
