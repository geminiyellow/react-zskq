/**
 * 定制企业的帮助类,单例，
 */
import _ from 'lodash';
import { companysCode } from '@/common/Consts';

let instance = null;

export default class CustomizedCompanyHelper {
  constructor() {
    if (instance == null) {
      instance = this;
      this.init();
    }
    return instance;
  }
  /**
  初始化公司代码 和 接口前缀
   */
  init() {
    this.companys = new Map();
    this.companys.set('estee', '_Estee');
    this.companys.set('esteetest', '_Estee');
    this.companys.set('samsung', '_Custom');
    this.companys.set('gant', '_Custom');

    this.companysData = new Map();
    this.companysData.set('estee', companysCode.Estee);
    this.companysData.set('esteetest', companysCode.Estee);
    this.companysData.set('samsung', companysCode.Samsung);
    this.companysData.set('gant', companysCode.Gant);
  }
  /**
   * 保存公司代码和前缀
   */
  setCompanyCodeAndPrefix(code, urlPrefix) {
    this.companys.set(code, urlPrefix);
  }
  /**
   * 设置公司代码
   */
  setCompanyCode(code) {
    this.companyCode = `${code}`.toLowerCase().trim();
  }
  /**
   * 取到设置公司代码
   */
  getCompanyCode() {
    const value = this.companysData.get(`${this.companyCode}`);
    if (value) return value;
    return this.companyCode;
  }
  /**
   * 判断公司代码是否是特定版本的
   */
  isSpecifiedCompanyCode() {
    if (!this.companyCode) return false;
    if (this.companys.get(`${this.companyCode}`)) {
      return true;
    }
    return false;
  }

  /**
   * 获取所有的本地公司代码和前缀
   */
  getCompanyCodes() {
    return this.companys;
  }
  /**
   * 获取对应公司的前缀
   */
  getPrefix() {
    if (!this.companyCode) return '';
    const value = this.companys.get(`${this.companyCode}`);
    if (_.isUndefined(value)) return '';
    return value;
  }
}