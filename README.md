##  :red_car: Roadmap

### Table of Contents

- [v3.0.0(2016-11-01)](#v300)
- [v3.0.1(2016-11-15)](#v301)
- [换班(2016-12-06)](#换班)
- [v3.0.2(2016-12-22)](#v302)
- [v3.1.0(2016-12-28)](#v310)
- [v3.1.1(2017-01-13)](#v311)
- [v3.1.2(2017-01-20)](#v312)
- [v3.1.3(2017-01-24)](#v313)
- [v3.2.0](#v320)
- [v3.3.0](#v330)

### v3.0.0

* - [x] 首页
* - [x] 登录页
* - [x] 引导页
* - [x] 启动页
* - [x] 蓝牙打卡
* - [x] 扫码打卡
* - [x] 定位打卡
* - [x] 排班查询
* - [x] 请假申请
* - [x] 加班申请
* - [x] 主管审核
* - [x] 考勤统计
* - [x] 考勤规则
* - [x] 个人信息
* - [x] 提醒设置
* - [x] 关于我们
* - [x] 我的表单
* - [x] 企业代码页

### v3.0.1

* - [x] 出差申请
* - [x] 优化
  * 请求类优化，添加取消机制
  * 请假休假额度为空时优化
  * 图片统一调整至原生处理
  * 项目结构调整
  * 空白页面优化
  * 语言设置优化
  * 导航栏优化

### 换班

* - [x] 换班
 
### v3.0.2

* - [x] 通知优化，整合令牌
* - [x] 考勤规则优化
* - [x] 移动考勤整合
* - [x] 我的薪资
* - [x] 优化
  * 头像优化，默认显示色块头像，获取到网络头像的情况下覆盖默认头像
  * 添加 https 协议检测机制，非 https 协议，统一提示用户更新新版本
  * 排班查询列表样式修改，月份换成星期几
  * 请假时数超过限制时长后附件必传控制
  * 密码、账号、企业代码、手势密码加密
  * 签核状态增加“强制通过、自动通过”
  * 跳转请假带出选择的日期
  * 启动页新增移动考勤逻辑
  * 排班查询日历样式修改
  * Tab 通用组件调整
  * 异常申诉次数限制
  * 异常申诉添加附件
  * 项目结构调整
  * 统一加密规则

### v3.1.0

* - [x] APP 接口协议统一由 http 转换成 https，同时 iOS 启用 ATS
* - [x] 登录页面文字修改：工号改成账号
* - [x] 表单详情页增加"表单号复制"
* - [x] 可配置化：工号与手机绑定
* - [x] 考勤异常周期问题
* - [x] 异常申诉表单拆分
* - [x] 首页图表优化
  * 每周起始日跟随系统设定
  * 增加出差类别
* - [x] 底层优化
  * iOS 推送（前台模式、后台模式）声音跟随音量控制，支持静音模式
  * android 端实现图片统一 webp 格式并原生处理
  * React Native 升级至0.32.0版本
  * 项目代码检索机制原生实现
  * 手势背景渐变色原生实现

### v3.1.1

* - [x] 如果 APP 中未开通请假模块，则隐藏排班中的请假按钮
* - [x] 加班申请单隐藏加班类型【凯德】
* - [x] 集成“爱关怀”模块

### v3.1.2

* - [x] 添加用户反馈功能，数据对接 jira 系统
* - [x] 只在跨天请假时才可看到“固定时段”选项
* - [x] 我的表单添加快速筛选过滤表单功能
* - [x] 首页添加不支持 iOS 7 的用户提示
* - [x] 错误提示显示时间改为10秒
* - [x] 我的表单添加流程状态总览
* - [x] 并签/会签的结构化展示
* - [x] 休息日取消上下班提醒
* - [x] 优化
  * 加班申请中，可加班额度（最大加班时数）支持 HR ONE 现有配置维度的展示
  * 当有多个蓝牙盒子时，优先找到可打卡的盒子
  * “返回/取消/确定”等按钮扩大点击区域
  * 薪资查询限制期数最大值36个月
  * 表单详情页面布局优化
  * 附件图片居中显示
  * 统一表单成功提示
  * 薪资项支持排序
  * 打卡界面优化

### v3.1.3

* - [x] 登录页添加版本号
* - [x] UI 细节调整

### v3.2.0

### v3.3.0