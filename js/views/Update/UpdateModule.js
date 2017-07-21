import realm from '@/realm';

/**
 * 升级Module 单例
 */
let instance = null;


export default class UpdateModule {

  constructor() {
    if (instance == null) {
      instance = this;
    }
  }

  // 重置  用于升级窗口关闭后使用
  reset() {
    realm.write(() => {
      const updateResult = realm.objects('Config').filtered('name = "uptodate"');
      if (updateResult.length == 0) {
        realm.create('Config', { name: 'uptodate', enable: false });
      } else {
        updateResult[0].enable = false;
      }
    });
    realm.write(() => {
      const uptodataNextStartedResult = realm.objects('Config').filtered('name = "uptodatenextstarted"');
      if (uptodataNextStartedResult.length == 0) {
        realm.create('Config', { name: 'uptodatenextstarted', enable: false });
      } else {
        uptodataNextStartedResult[0].enable = false;
      }
    });
  }

  // 下载更新成功
  upToDate() {
    realm.write(() => {
      const updateResult = realm.objects('Config').filtered('name = "uptodate"');
      if (updateResult.length == 0) {
        realm.create('Config', { name: 'uptodate', enable: true });
      } else {
        updateResult[0].enable = true;
      }
    });
  }
  // 显示升级成功对话框
  showTipModal() {
    const updateResult = realm.objects('Config').filtered('name = "uptodate"');
    if (updateResult.length > 0 && updateResult[0].enable == true) {
      realm.write(() => {
        const uptodataNextStartedResult = realm.objects('Config').filtered('name = "uptodatenextstarted"');
        if (uptodataNextStartedResult.length == 0) {
          realm.create('Config', { name: 'uptodatenextstarted', enable: true });
        } else {
          uptodataNextStartedResult[0].enable = true;
        }
      });
    } else {
      realm.write(() => {
        const uptodataNextStartedResult = realm.objects('Config').filtered('name = "uptodatenextstarted"');
        if (uptodataNextStartedResult.length == 0) {
          realm.create('Config', { name: 'uptodatenextstarted', enable: false });
        } else {
          uptodataNextStartedResult[0].enable = false;
        }
      });
    }
  }
}