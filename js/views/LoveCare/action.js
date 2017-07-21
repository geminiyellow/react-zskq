// action creators
import { actionType } from './constant';

export function loadFailed(value) {
  return {
    type: actionType.LOAD_FAILED,
    value,
  };
}

export function setLoaded(value) {
  return {
    type: actionType.LOADED,
    value,
  };
}

export function goBack(value) {
  return {
    type: actionType.CAN_GO_BACK,
    value,
  };
}