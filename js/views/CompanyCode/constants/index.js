import keyMirror from 'fbjs/lib/keyMirror';

module.exports = {
  actionType: keyMirror({
    // 获取存储的企业代码
    RETRIEVE_STORAGE_COMPANY_CODE: null,
    // 改变输入框中的企业代码
    CHANGE_COMPANY_CODE: null,
    // 改变输入框中的文本对齐方式
    CHANGE_TEXT_INPUT_ALIGN: null,
  }),
};