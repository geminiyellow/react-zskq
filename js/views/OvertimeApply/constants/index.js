/*
*  加班申请中用到的常量
*/
module.exports = {
  // -------------设置需要的图片名称-------------------
  // 附件上传的添加图片
  attachAdd: 'list_add_pic',
  // 删除图片
  attachDelete: 'delete',
  // 获取返回按钮图片
  leftBack: 'left_back',
  // 向右的箭头图片
  turnRight: 'forward',
  // 加班超过额度的图片
  overTimeAmount: 'alert',
  // 餐别未选中图片
  checkBoxUnselected: 'checkbox_common',
  // 餐别选中图片
  checkBoxSelected: 'checkbox_selected',
  // 加班额度超过限定额度的显示颜色
  amountOverColor: '#ffb600',

  // -------------设置表单中的种类-------------------
  // 带有文字 - 文字
  formTypeWordAndWord: '1',
  // 带有文字 -（文字-图片）
  formTypeWordAndImage: '2',
  // 带有文字 - 图片
  formTypeImage: '3',
  // 带有文字 - 输入框
  formTypeWordAndInput: '4',
  // 带有输入框
  formTypeInput: '5',

  // -------------设置picker的种类-------------------
  // 开始日期弹出框
  pickerDate: '1',
  // 开始时间弹出框
  pickerStart: '2',
  // 结束时间弹出框
  pickerEnd: '3',
  // 实际日期弹出框
  pickerActualDate: '4',
  // 加班原因弹出框
  pickerReason: '5',

  // -------------设置附件上传的限制-------------------
  // 限制加班申请的附件上传
  attachmentNone: '0',
  // 只上传一张图片
  attachmentSingle: '1',
  // 可以上传多张图片
  attachmentMultiple: '2',

  // -------------设置附件上传的质量-------------------
  attachmentQuality: 0.5,

  // -------------设置附件上传的数量-------------------
  attachmentNumber: 5,

  // -------------设置餐别样式刷新的方式-------------------
  // 主页面调用刷新方法
  mealTypeRefreshIndex: 1,
  // 餐别页面调用刷新方法
  mealTypeRefreshSub: 2,

  // -------------设置餐别数据加载方式-------------------
  // 主页面调用加载方法
  mealTypeLoadIndex: 1,
  // 餐别页面调用加载方法
  mealTypeLoadSub: 2,

  // -------------设置加班类型是否显示-------------------
  // 显示加班类型
  otTypeIsShow: '1',

  // -------------设置加班的计算周期------------------
  otModeByAttendance: 0,
  otModeByQuarter: 1,
  otModeByYear: 2,
  otModeBySpecified: 3,
};