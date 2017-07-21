import { actionType } from './constant';
const initialState = {
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionType.LOAD_FAILED:
      return { ...state, isLoadFailed: action.value };
    case actionType.LOADED:
      return { ...state, loaded: action.value };
    case actionType.CAN_GO_BACK:
      return { ...state, canGoBack: action.value };
    default:
      return state;
  }
}