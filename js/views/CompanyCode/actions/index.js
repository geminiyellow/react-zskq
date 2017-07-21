import { actionType } from '../constants';

export function retrieveStorageCompanyCode(companyCode) {
  return {
    type: actionType.RETRIEVE_STORAGE_COMPANY_CODE,
    companyCode,
  };
}

export function changeCompanyCode(companyCode) {
  return {
    type: actionType.CHANGE_COMPANY_CODE,
    companyCode,
  };
}

export function changeTextInputAlign(alignType) {
  return {
    type: actionType.CHANGE_TEXT_INPUT_ALIGN,
    alignType,
  };
}