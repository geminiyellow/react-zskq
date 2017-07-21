import { isShow } from '@/common/Message';
import _ from 'lodash';

module.exports = {
  register(loading) {
    this.loading = loading;
  },
  unregister() {
    this.loading = null;
  },
  start() {
    if (isShow()) return;
    if (this.loading) this.loading.start();
  },
  stop() {
    if (isShow()) return;
    if (this.loading) this.loading.stop();
  },
  done() {
    if (isShow()) return;
    if (this.loading) this.loading.done();
  },
  setLoadingBg() {
    if (!_.isEmpty(global.companyResponseData.color.progressBarBg) && !_.isUndefined(global.companyResponseData.color.progressBarBg)) {
      this.loading.setProBg(global.companyResponseData.color.progressBarBg);
    }
  },
};