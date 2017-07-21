package com.gaiaworks.gaiaonehandle.picker;

/**
 * Created by Andy on 2017/2/6.
 */

import android.text.TextUtils;
import android.view.View;

import com.andylidong.pickerview.OptionsPickerView;
import com.andylidong.pickerview.TimePickerView;
import com.andylidong.pickerview.listener.OnPickerSelectListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

/**
 * Created by Andy.Li on 2016/12/23.
 */

public class RNPickerType extends View {

    private final EventDispatcher mEventDispatcher;

    // 时间选择器
    private TimePickerView tpPicker;

    // 选项选择器
    private OptionsPickerView opPicker;

    // 时间的格式
    private static String timeFormatter;

    public RNPickerType(ReactContext reactContext) {
        super(reactContext);
        mEventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
    }

    /**
     * 设置时间picker显示的类型
     *
     * @param type
     */
    public void setTimeInit(ReactContext reactContext, TimePickerView.Type type) {
        if (tpPicker != null) {
            tpPicker = null;
        }
        tpPicker = new TimePickerView(reactContext.getCurrentActivity(), type);
        // 设置标题的内容
        setTimeTitle("");
        // 获取选中的信息
        tpPicker.setOnPickerSelectListener(new OnPickerSelectListener() {

            @Override
            public void onPickerSelect(Object obj) {
                // 获取最后的监听数据
                mEventDispatcher.dispatchEvent(
                        new ItemSelectedEvent(getId(), new String[]{getTime((Date) obj)}, 1));
            }

            @Override
            public void onPickerCancel() {
                // 发送取消事件
                mEventDispatcher.dispatchEvent(
                        new ItemCancelEvent(getId(), ""));
            }
        });
    }

    /**
     * 设置时间的开始年份和结束年份
     *
     * @param startYear
     * @param endYear
     */
    public void setTimeData(int startYear, int endYear) {
        if (tpPicker == null) {
            return;
        }
        // 设置数据的范围 要在setTime 之前才有效果哦
        tpPicker.setRange(startYear, endYear);
    }

    /**
     * 设置picker弹出之后选中的时间
     *
     * @param date
     */
    public void setTime(String date) {
        if (tpPicker == null) {
            return;
        }
        // 设置选中的时间
        Date time = null;
        try {
            time = TextUtils.isEmpty(date) ? new Date() : new SimpleDateFormat(timeFormatter).parse(date);
        } catch (ParseException e) {
            time = new Date();
        }
        tpPicker.setTime(time, timeFormatter);
    }

    /**
     * 设置标题的显示信息
     *
     * @param title
     */
    public void setTimeTitle(String title) {
        if (tpPicker == null) {
            return;
        }
        tpPicker.setTitle(title);
    }

    /**
     * 设置数据是否循环
     *
     * @param isCyclic
     */
    public void setTimeCyclic(boolean isCyclic) {
        if (tpPicker == null) {
            return;
        }
        tpPicker.setCyclic(isCyclic);
    }


    /**
     * 设置点击色区域是否显示
     *
     * @param isCancelable
     */
    public void setTimeCancelable(boolean isCancelable) {
        if (tpPicker == null) {
            return;
        }
        tpPicker.setCancelable(isCancelable);
    }


    /**
     * 判断picker是否显示
     */
    public boolean isTimeShowing() {
        if (tpPicker == null) {
            return false;
        }
        return tpPicker.isShowing();
    }

    /**
     * 隐藏picker
     */
    public void dismissTime() {
        if (tpPicker != null) {
            tpPicker.dismiss();
        }
    }

    /**
     * 显示picker
     */
    public void showTime() {
        if (tpPicker != null) {
            tpPicker.show();
        }
    }


    /**
     * 设置确定的按钮信息
     *
     * @param submitText
     */
    public void setTimeSubmit(String submitText) {
        if (tpPicker == null) {
            return;
        }
        tpPicker.setSubmit(submitText);
    }

    /**
     * 设置取消的按钮信息
     *
     * @param cancelText
     */
    public void setTimeCancel(String cancelText) {
        if (tpPicker == null) {
            return;
        }
        tpPicker.setCancel(cancelText);
    }


    /**
     * 设置年份的信息
     *
     * @param yearText
     */
    public void setYearText(String yearText) {
        if (tpPicker == null) {
            return;
        }
        tpPicker.setYearText(yearText);
    }

    /**
     * 设置月份的信息
     *
     * @param monthText
     */
    public void setMonthText(String monthText) {
        if (tpPicker == null) {
            return;
        }
        tpPicker.setMonthText(monthText);
    }


    /**
     * 设置日期的信息
     *
     * @param dayText
     */
    public void setDayText(String dayText) {
        if (tpPicker == null) {
            return;
        }
        tpPicker.setDayText(dayText);
    }


    /**
     * 设置小时的信息
     *
     * @param hourText
     */
    public void setHourText(String hourText) {
        if (tpPicker == null) {
            return;
        }
        tpPicker.setHourText(hourText);
    }


    /**
     * 设置分钟的信息
     *
     * @param minuteText
     */
    public void setMinuteText(String minuteText) {
        if (tpPicker == null) {
            return;
        }
        tpPicker.setMinuteText(minuteText);
    }

    /**
     * 设置显示的星期的数据
     *
     * @param week
     */
    public void setWeeksData(String[] week) {
        if (tpPicker == null) {
            return;
        }
        tpPicker.setWeeksData(week);
    }


    /**
     * 设置显示时间的格式
     *
     * @param timeFormatter
     */
    public void setTimeFormatter(String timeFormatter) {
        this.timeFormatter = timeFormatter;
    }

    /**
     * 获取想要的时间格式
     *
     * @param date
     * @return
     */
    public static String getTime(Date date) {
        SimpleDateFormat format = new SimpleDateFormat(timeFormatter);
        return format.format(date);
    }

    /**-------------------------显示选项选择器-----------------------------------------*/

    /**
     * 设置选项picker显示的初始化
     */
    public void setOptionInit(ReactContext reactContext, final ArrayList<String> optionF, final ReadableMap optionsItem) {
        //选项选择器
        if (opPicker != null) {
            opPicker = null;
        }
        opPicker = new OptionsPickerView(reactContext.getCurrentActivity());
        // 设置选择的标题
        setOptionTitle("");
        // 获取选中的信息
        opPicker.setOnPickerSelectListener(new OnPickerSelectListener() {

            @Override
            public void onPickerSelect(Object obj) {
                String dataStr[] = new String[2];
                try {
                    int[] array = (int[]) obj;
                    String firstStr = optionF.get(array[0]);
                    String secondStr = "";
                    if (optionsItem != null) {
                        ReadableArray secondData = optionsItem.getArray(firstStr);
                        for (int i = 0; i < secondData.size(); i++) {
                            if (array[1] == i) {
                                secondStr = secondData.getString(i);
                            }
                        }
                    }
                    dataStr[0] = firstStr;
                    dataStr[1] = secondStr;
                    // 获取最后的监听数据
                    mEventDispatcher.dispatchEvent(
                            new ItemSelectedEvent(getId(), dataStr, 2));
                } catch (Exception e) {
                    dataStr[0] = optionF.get(0);
                    dataStr[1] = optionsItem.getArray(dataStr[0]).getString(0);
                    // 获取最后的监听数据
                    mEventDispatcher.dispatchEvent(
                            new ItemSelectedEvent(getId(), dataStr, 2));
                }
            }

            @Override
            public void onPickerCancel() {
                // 发送取消事件
                mEventDispatcher.dispatchEvent(
                        new ItemCancelEvent(getId(), ""));
            }
        });
    }


    /**
     * 设置选项选择器的数据
     *
     * @param optionF
     * @param optionS
     */
    public void setPicker(ArrayList<String> optionF, ArrayList<ArrayList<String>> optionS) {
        if (opPicker == null) {
            return;
        }
        if (optionS == null) {
            opPicker.setPicker(optionF);
        } else {
            opPicker.setPicker(optionF, optionS, true);
        }
    }

    /**
     * 设置选项选择器的选中值
     *
     * @param optionF 选项选择器的数据
     * @param info    查询的信息
     */
    public void setOptions(ArrayList<String> optionF, ArrayList<ArrayList<String>> optionS, String info, int index1) {
        if (opPicker == null) {
            return;
        }
        try {
            if (optionS == null) {
                int index = optionF.indexOf(info);
                opPicker.setSelectOptions(index);
            } else {
                int index = optionF.indexOf(info);
                opPicker.setSelectOptions(index, index1);
            }
        } catch (Exception e) {
            opPicker.setSelectOptions(0);
        }
    }

    /**
     * 设置picker的标题
     *
     * @param title
     */
    public void setOptionTitle(String title) {
        if (opPicker == null) {
            return;
        }
        opPicker.setTitle(title);
    }

    /**
     * 设置数据是否循环
     *
     * @param isCyclic
     */
    public void setOptionCyclic(boolean isCyclic) {
        if (opPicker == null) {
            return;
        }
        opPicker.setCyclic(isCyclic);
    }

    /**
     * 设置点击色区域是否显示
     *
     * @param isCancelable
     */
    public void setOptionCancelable(boolean isCancelable) {
        if (opPicker == null) {
            return;
        }
        opPicker.setCancelable(isCancelable);
    }

    /**
     * 设置确定的按钮信息
     *
     * @param submitText
     */
    public void setOptionSubmit(String submitText) {
        if (opPicker == null) {
            return;
        }
        opPicker.setSubmit(submitText);
    }

    /**
     * 设置取消的按钮信息
     *
     * @param cancelText
     */
    public void setOptionCancel(String cancelText) {
        if (opPicker == null) {
            return;
        }
        opPicker.setCancel(cancelText);
    }


    /**
     * 判断picker是否显示
     */
    public boolean isOptionShowing() {
        if (opPicker == null) {
            return false;
        }
        return opPicker.isShowing();
    }

    /**
     * 隐藏picker
     */
    public void dismissOption() {
        if (opPicker != null) {
            opPicker.dismiss();
        }
    }

    /**
     * 显示picker
     */
    public void showOption() {
        if (opPicker != null) {
            opPicker.show();
        }
    }
}