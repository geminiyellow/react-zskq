import { getVersionId } from "@/common/Functions";
import { companyCodeList, moduleList } from "@/common/Consts";

export function isSamsung() {
  const companyCode = getVersionId(global.companyResponseData.version, moduleList.checkinSummary);
  if (companyCode == companyCodeList.samsung) {
    return true;
  }
  return false;
}