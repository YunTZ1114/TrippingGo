import { CommonFields } from './common.type';

export enum CheckListType {
  PREPARATION = 'PREPARATION',
  SHOPPING = 'SHOPPING',
}

export interface CheckListDescription {
  [key: string]: number[];
}

export interface CheckListItem {
  text: string;
  checked: boolean;
}

export interface FormattedCheckList {
  tripMemberId: number;
  data: Array<{
    description: CheckListItem[];
    [key: string]: any;
  }>;
}

export interface BaseCheckList {
  id: number;
  tripMemberId: number;
  description?: Record<string, number[]> | string[];
  title: string;
  type: CheckListType;
  isPublic: boolean;
}

export interface CheckList extends BaseCheckList, CommonFields {}
