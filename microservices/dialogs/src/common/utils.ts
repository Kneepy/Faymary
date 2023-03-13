export type Modify<T, R> = Omit<T, keyof R> & R;
export type ArrayUsersDialog = {creators_ids: string[], user_ids: string[]}