import { t, Static } from 'elysia';

export const CallbackQuery = t.Object({
  code: t.String(),
});
export type CallbackQuery = Static<typeof CallbackQuery>;
