import React, { PureComponent, PropTypes } from 'react';
import { requireNativeComponent } from 'react-native';

const RCTFormView = requireNativeComponent('RNFormView', FormView);
const itemArr = ['人物', '不调整佣金', '占比', '目标', '完成值', '完成率', '奖励金额', '惩罚金额'];

export default class FormView extends React.Component {
    render() {
        return
        <RCTFormView
          {...this.props} />
    }

}

module.exports = RCTFormView;