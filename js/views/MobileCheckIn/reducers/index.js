import { actionType } from '../constants';

const initialState = {
  userShift: '',
  userWorkingTime: '...',
  userClockInfo: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionType.CHANGE_USER_WORKING_TIME:
      return Object.assign({}, state, {
        userWorkingTime: action.userWorkingTime || initialState.userWorkingTime,
      });

    case actionType.CHANGE_USER_SHIFT:
      return Object.assign({}, state, {
        userShift: action.userShift || initialState.userShift,
      });

    case actionType.CHANGE_USER_CLOCK_INFO:
      return Object.assign({}, state, {
        userClockInfo: action.userClockInfo || initialState.userClockInfo,
      });

    default:
      return state;
  }
}