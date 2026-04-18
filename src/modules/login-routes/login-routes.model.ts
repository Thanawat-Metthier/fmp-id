import { LoginRoute } from '@/db/schema/core';


export type FindLoginRouteParams = Partial<LoginRoute> & {
  ids?: number[];
};
