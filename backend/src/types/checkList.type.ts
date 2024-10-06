import { CommonFields } from './common.type';

export enum CheckListType {
  PREPARATION = 'PREPARATION',
  SHOPPING = 'SHOPPING',
}

export interface BaseCheckList {
  id: number;
  tripMemberId: number;
  description: Record<string, any>;
  title: string;
  type: CheckListType;
  isPublic: boolean;
}

export interface CheckList extends BaseCheckList, CommonFields {}
