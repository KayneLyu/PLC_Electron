import { v4 as uuidV4 } from 'uuid';

/**
 * 生成UUID
 * */
export const uuid = () => uuidV4().replace(/-/g, '');
