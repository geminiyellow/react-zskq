import { actionType } from '../constants';

export function changeUserWorkingTime(userWorkingTime) {
  return {
    type: actionType.CHANGE_USER_WORKING_TIME,
    userWorkingTime,
  };
}

export function changeUserShift(userShift) {
  return {
    type: actionType.CHANGE_USER_SHIFT,
    userShift,
  };
}

export function changeUserClockInfo(userClockInfo) {
  return {
    type: actionType.CHANGE_USER_CLOCK_INFO,
    userClockInfo,
  };
}