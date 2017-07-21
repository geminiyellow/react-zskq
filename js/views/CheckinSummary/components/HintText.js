import { TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import Text from '@/common/components/TextField';
import { device } from '@/common/Util';

export default class HintText extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isHint: false,
      hintText: '',
    };
  }

  onHint(days) {
    if (days) {
      this.setState({
        isHint: !this.state.isHint,
        hintText: `${I18n.t('mobile.module.exception.excestart')} ${days} ${I18n.t('mobile.module.exception.exceend')}`,
      });
    } else {
      this.setState({
        isHint: !this.state.isHint,
      });
    }
  }

  onShowHint() {
    const { isHint } = this.state;
    if (isHint) {
      return (
        <View style={styles.hintText}>
          <Text>{this.state.hintText}</Text>
        </View>
      );
    }
    return null;
  }

  // 关闭提示气泡
  onCloseHint() {
    const { isHint } = this.state;
    if (isHint) {
      this.setState({ isHint: false });
    }
  };

  /** Render methods */

  render() {
    const { isHint } = this.state;
    const { style } = this.props;

    if (!isHint) return null;

    return (
      <TouchableOpacity
        style={style}
        onPress={() => this.onHint()}
      >
        <View style={styles.triangle}>
          <View style={styles.triangleLeft} />
          <View style={styles.triangleCenter} />
          <View style={styles.triangleRight} />
        </View>
        <View style={styles.hintView}>
          <Text style={styles.hintText} numberOfLines={2}>{this.state.hintText}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  // 提示的文字
  triangle: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  hintView: {
    height: 33,
    width: 199,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    // shadow
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    justifyContent: 'center',
  },
  triangleLeft: {
    flex: 1,
  },
  triangleRight: {
    width: 16,
  },
  triangleCenter: {
    borderTopWidth: 0,
    borderRightWidth: 10 / 2.0,
    borderBottomWidth: 8,
    borderLeftWidth: 10 / 2.0,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
    borderLeftColor: 'transparent',
  },
  hintText: {
    marginLeft: 5,
    color: '#333333',
    fontSize: 12,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
});
