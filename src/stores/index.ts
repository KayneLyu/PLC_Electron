import { State, useHookstate, hookstate } from '@hookstate/core';

interface GlobalState {
  data: any;
}
const defaultGlobalState: GlobalState = {
  data:{}
};

/**
 * 全局器数据状态
 * */
const globalStore = hookstate<GlobalState>(defaultGlobalState);

/**
 * 包装数据
 * */
const wrapState = (s: State<GlobalState>) => {
  const getIPCData=()=>{
    return s.value.data
  }
  return {getIPCData};
};

/**
 * 包装操作
 * */
const wrapOperate = (s: State<GlobalState>) => {
  const setIPCData = (data: any) => {
    s.nested('data').set(data);
  };
  return { setIPCData };
};

export const useGlobalState = () => wrapState(useHookstate(globalStore));

export const useGlobalOperate = () => wrapOperate(useHookstate(globalStore));

export const globalOperate = () => wrapOperate(globalStore);

export const globalState = () => wrapState(globalStore);
