/**
 * 头部筛选界面
 */

import { View } from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import { device } from '@/common/Util';
import Modal from 'react-native-modalbox';
import Text from '@/common/components/TextField';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import SubmitButton from '@/common/components/SubmitButton';

export default class CalcuModal extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      commisson: 10000,
    };
  }

  /**
   * 显示modal
   */
  openModal = (data) => {
    this.setState({
      commisson: data,
    });
    this.modal.open();
  }

  /**
   * 关闭modal
   */
  closeModal = () => {
    this.modal.close();
  }

  render() {
    const { commisson } = this.state;
    return (
      <Modal
        style={styles.container}
        position={'center'}
        ref={ref => {
          this.modal = ref;
        } }
        swipeToClose={false}
        animationDuration={300}
        backdropOpacity={0.5}
        onClosed={type => this.closeModal()}
        >
        <View>
          <View style={styles.topBg} />
          <View style={styles.bottomBg}>
            <Text style={styles.title}>{I18n.t('mobile.module.commission.quota.modal.content')}</Text>
            <Text style={styles.commissonStyle}>{commisson.toString()}</Text>
            <SubmitButton title={I18n.t('mobile.module.commission.quota.modal.ok')} customStyle={styles.submitStyle} onPressBtn={() => this.closeModal()} />
          </View>
          <View style={styles.circleBg} >
            <View style={styles.circle} >
              <Text style={styles.circleText}>{I18n.t('mobile.module.commission.quota.modal.circle')}</Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    height: 208,
    width: device.width - 100,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    borderRadius: 12,
  },
  topBg: {
    height: 43,
    width: device.width - 100,
    backgroundColor: 'transparent',
  },
  bottomBg: {
    backgroundColor: 'white',
    borderRadius: 12,
  },
  circleBg: {
    position: 'absolute',
    left: (device.width * 0.5 - 95),
    top: 0,
    width: 85,
    height: 85,
    borderRadius: 85,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  circle: {
    width: 75,
    height: 75,
    borderRadius: 75,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14BE4B',
  },
  circleText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  title: {
    marginTop: 50,
    color: '#999999',
    fontSize: 14,
    textAlign: 'center',
  },
  commissonStyle: {
    marginTop: device.isIos ? 10 : 5,
    marginBottom: 12,
    color: '#FF801A',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  submitStyle: {
    width: device.width - 100,
    height: 52,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});