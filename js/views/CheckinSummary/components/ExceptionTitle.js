import { TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Text from '@/common/components/TextField';
import Image from '@/common/components/CustomImage';
import { device } from '@/common/Util';
import { getVersionId } from '@/common/Functions';
import { companyCodeList, moduleList } from '@/common/Consts';
import { statisticsTitle, listTitle } from '@/views/CheckinSummary/constants';
const hint = 'exception_hint';

export default class ExceptionTitle extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      unhandleExceptionNum: 0,
      workingDays: 0
    };
  }

  /** Life cycle */

  componentWillMount() {
    this.companyCode = getVersionId(
      global.companyResponseData.version,
      moduleList.checkinSummary,
    );
    this.isCustom =
      this.companyCode == companyCodeList.estee ||
      this.companyCode == companyCodeList.gant;
  }

  componentDidMount() {
    const {
      unhandleExceptionNum,
      typeOfTitle,
      workingDays,
      onlyApplyDays,
    } = this.props;

    this.typeOfTitle = typeOfTitle;
    this.setState({
      unhandleExceptionNum,
      workingDays,
      onlyApplyDays,
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      unhandleExceptionNum,
      typeOfTitle,
      workingDays,
      onlyApplyDays,
    } = nextProps;

    this.typeOfTitle = typeOfTitle;
    this.setState({
      unhandleExceptionNum,
      workingDays,
      onlyApplyDays,
    });
  }

  onHint() {
    this.hintButton.measureInWindow((x, y, width, height) => {
      this.props.onShow(y);
    });
  };

  /** Render methods */

  renderExceptionTitle() {
    const { unhandleExceptionNum, workingDays, onlyApplyDays } = this.state;
    if (this.typeOfTitle == statisticsTitle) {
      if (workingDays && workingDays != 0) {
        return (
          <View>
            {this.isCustom
              ? <View style={styles.checkinTitle}>
                <Text style={styles.topTitle}>
                  {I18n.t('mobile.module.exception.customtotalfirst')}
                </Text>
                <Text style={styles.durationNum}>{7}</Text>
                <Text style={styles.topTitle}>
                  {I18n.t('mobile.module.exception.customtotalsecond')}
                </Text>
              </View>
              : <View style={styles.checkinTitle}>
                <Text style={styles.topTitle}>
                  {I18n.t('mobile.module.exception.uncheckindurationdesc')}
                </Text>
                <Text style={styles.durationNum}>{`${workingDays}`}</Text>
                <Text style={styles.topTitle}>
                  {I18n.t('mobile.module.exception.uncheckindurationday')}
                </Text>
              </View>}
          </View>
        );
      }
    }
    if (this.typeOfTitle == listTitle) {
      if (unhandleExceptionNum && unhandleExceptionNum != 0) {
        return (
          <View>
            {this.isCustom
              ? <View
                style={{
                  flexDirection: 'row',
                  paddingLeft: 18,
                  paddingRight: 18,
                }}
                >
                <Text style={styles.summaryExceptionLabel} numberOfLines={5}>
                  {I18n.t('mobile.module.exception.totalfirst')}
                  <Text style={styles.summaryExceptionNum}>
                    {`${unhandleExceptionNum}`}
                  </Text>
                  {I18n.t('mobile.module.exception.totalsecond')}
                </Text>
                {!onlyApplyDays || onlyApplyDays == 0
                    ? null
                    : <TouchableOpacity
                        ref={view => this.hintButton = view}
                        onPress={() => this.onHint(onlyApplyDays)}
                        style={styles.questionButton}
                      >
                        <Image source={{ uri: hint }} style={{ marginTop: 10, width: 14, height: 14 }}/>
                      </TouchableOpacity>}
              </View>
              : <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 18,
                    paddingRight: 18,
                  }}
                >
                <Text style={styles.summaryExceptionLabel} numberOfLines={5}>
                  {I18n.t('mobile.module.exception.unhandleone')}
                  <Text style={styles.summaryExceptionNum}>
                    {`${unhandleExceptionNum}`}
                  </Text>
                  {I18n.t('mobile.module.exception.unhandletwo')}
                </Text>
                {!onlyApplyDays || onlyApplyDays == 0
                    ? null
                    : <TouchableOpacity
                        ref={view => this.hintButton = view}
                        onPress={() => this.onHint(onlyApplyDays)}
                        style={styles.questionButton}
                      >
                        <Image source={{ uri: hint }} style={{ marginTop: 10, width: 14, height: 14 }}/>
                      </TouchableOpacity>}
              </View>}
          </View>
        );
      }
    }
    return null;
  }

  render() {
    return (
      <View>
        {this.renderExceptionTitle()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  summaryExceptionLabel: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    color: '#000000',
  },
  summaryExceptionNum: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 14,
    color: '$color.mainColorLight',
    '@media ios': {
      fontWeight: '500',
    },
  },
  checkinTitle: {
    marginTop: 8,
    marginHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 14,
    color: '#000000',
  },
  durationNum: {
    fontSize: 14,
    color: '$color.mainColorLight',
    '@media ios': {
      fontWeight: '500',
    },
  },
  // 提示的文字
  hintText: {
    position: 'absolute',
    top: 30,
    left: 200,
    backgroundColor: '#FFFFFF',
    width: device.width / 3,
    height: 10,
  },
  questionButton: {
    width: 40,
    alignItems: 'flex-end',
  },
});
