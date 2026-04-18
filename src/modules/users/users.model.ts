import { users } from '@/db/schema/core';

export type User = typeof users.$inferSelect;

export type FindUserParams = Partial<User> & {
  ids?: number[];
};
