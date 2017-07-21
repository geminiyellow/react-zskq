import { actionType } from '../constants';

const initialState = {
  companyCode: '',
  alignType: 'left',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionType.RETRIEVE_STORAGE_COMPANY_CODE:
      return Object.assign({}, state, {
        companyCode: action.companyCode || initialState.companyCode,
      });

    case actionType.CHANGE_COMPANY_CODE:
      return Object.assign({}, state, {
        companyCode: action.companyCode,
      });

    case actionType.CHANGE_TEXT_INPUT_ALIGN:
      return Object.assign({}, state, {
        alignType: action.alignType,
      });

    default:
      return state;
  }
}