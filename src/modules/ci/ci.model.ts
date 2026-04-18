import { SelectCiSchema } from '@/db/schema/core';


export type FindCiParams = Partial<SelectCiSchema> & {
  ids?: number[];
};
