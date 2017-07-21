import { DeviceEventEmitter, InteractionManager } from 'react-native';
import { GET, POST } from '@/common/Request';
import { getOrganizationListInfo, getAssessmentPeriodListInfo, getOrganizationTableHeaderInfo, getOrganizationTableData } from '@/common/api';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';

module.exports = {
  // 获取组织列表详情
  onGetOrganizationListInfo() {
    GET(getOrganizationListInfo(), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        DeviceEventEmitter.emit('FRESH_ORGANIZATION_LIST_MODAL_DATA', responseData);
      });
    }, (message) => {
      showMessage(messageType.error, JSON.stringify(message));
    }, 'onGetOrganizationListInfo');
  },
  getAssessmentPeriodListInfo() {
    GET(getAssessmentPeriodListInfo(), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        DeviceEventEmitter.emit('FRESH_PERIOD_LIST_MODAL_DATA', responseData);
      });
    }, (message) => {
      showMessage(messageType.error, JSON.stringify(message));
    }, 'getAssessmentPeriodListInfo');
  },
  getOrganizationTableHeaderInfo() {
    GET(getOrganizationTableHeaderInfo(), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        DeviceEventEmitter.emit('FRESH_TABLE_HEAD_DATA', responseData);
      });
    }, (message) => {
      showMessage(messageType.error, JSON.stringify(message));
    }, 'getOrganizationTableHeaderInfo');
  },
  getOrganizationTableData(orgId, period) {
    GET(getOrganizationTableData(orgId, period), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        DeviceEventEmitter.emit('FRESH_TABLE_DATA', responseData);
      });
    }, (message) => {
      showMessage(messageType.error, JSON.stringify(message));
    }, 'getOrganizationTableData');
  },
};