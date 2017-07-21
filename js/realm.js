import Realm from 'realm';

const CompanySchema = {
  name: 'Company',
  properties: {
    code: 'string',
    url: 'string',
    image_url: { type: 'string', optional: true },
  },
};

const ProjectCodeSchema = {
  name: 'ProjectCode',
  properties: {
    code: 'string',
    recommend: { type: 'bool', default: false, indexed: true },
  },
};

const ConfigSchema = {
  name: 'Config',
  properties: {
    name: 'string',
    value: { type: 'string', optional: true },
    enable: { type: 'bool', optional: true },
  },
};

const FormSchema = {
  name: 'Form',
  properties: {
    name: 'string',
    form_type: 'string',
  },
};

const UserSchema = {
  name: 'User',
  properties: {
    user_id: 'string',
    emp_id: 'string',
    name: 'string',
    password: 'string',
    head_url: { type: 'string', optional: true },
    emp_name: { type: 'string', optional: true },
    english_name: { type: 'string', optional: true },
  },
};

const TipSchema = {
  name: 'Tip',
  properties: {
    user_id: 'string',
    // 0:上班开启 。1:下班开启 。2:上班提醒时间 。3:下班提醒时间
    tiptype: 'int',
    toggletime: { type: 'string', optional: true },
    enable: { type: 'bool', optional: true, default: false },
  },
};

export default new Realm({
  schema: [
    CompanySchema,
    ProjectCodeSchema,
    ConfigSchema,
    FormSchema,
    UserSchema,
    TipSchema,
  ],
});