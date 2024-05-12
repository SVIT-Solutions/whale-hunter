import { UserState, UserAction, UserActionEnum } from './types';

const initialState: UserState = {};

export const userReducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    default:
      return state;
  }
};
