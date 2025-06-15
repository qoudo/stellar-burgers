import { Status } from '@utils-types';

export const STATUS: Record<Status, Status> = {
  initial: 'initial',
  fetching: 'fetching',
  success: 'success',
  failure: 'failure'
} as const;
