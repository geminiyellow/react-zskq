package com.andylidong.pickerview;

import android.content.Context;
import android.graphics.Typeface;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.andylidong.pickerview.listener.OnTimeSelectListener;
import com.andylidong.pickerview.utils.DateUtil;
import com.andylidong.pickerview.view.BasePickerView;
import com.andylidong.pickerview.view.WheelTime;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 时间选择器
 * Created by Sai on 15/11/22.
 */
public class TimePickerView extends BasePickerView implements View.OnClickListener {

    public enum Type {
        ALL, // 年月日时分
        YEAR_MONTH_DAY, // 年月日
        YEAR_MONTH, // 年月
        YEAR, // 年
        MONTH_DAY_HOUR_MINUTE, // 月日时分
        MONTH_DAY, // 月日
        MONTH, // 月
            DAY, // 日
        HOUR_MINUTE, // 时分
        HOUR, // 时
        MINUTE, // 分
    }

    private WheelTime wheelTime;
    private Button btnSubmit, btnCancel;
    private TextView tvTitle;
    private static final String TAG_SUBMIT = "submit";
    private static final String TAG_CANCEL = "cancel";
    private Type type;
    private String timeFormatter;

    public TimePickerView(Context context, Type type) {
        super(context);
        this.type = type;
        LayoutInflater.from(context).inflate(R.layout.pickerview_time, contentContainer);
        // -----确定和取消按钮
        btnSubmit = (Button) findViewById(R.id.btn_submit);
        btnSubmit.setTypeface(Typeface.create(Typeface.SANS_SERIF,Typeface.NORMAL));
        btnSubmit.setTag(TAG_SUBMIT);
        btnCancel = (Button) findViewById(R.id.btn_cancel);
        btnCancel.setTypeface(Typeface.create(Typeface.SANS_SERIF,Typeface.NORMAL));
        btnCancel.setTag(TAG_CANCEL);
        btnSubmit.setOnClickListener(this);
        btnCancel.setOnClickListener(this);
        // 顶部标题
        tvTitle = (TextView) findViewById(R.id.tv_title);
        // ----时间转轮
        final View timepickerview = findViewById(R.id.timepicker);
        wheelTime = new WheelTime(timepickerview, type);
        // 默认选中当前时间
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(System.currentTimeMillis());
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DAY_OF_MONTH);
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE) / 5;
        wheelTime.setPicker(year, month, day, hour, minute);
    }


    /**
     * 设置可以选择的时间范围
     * 要在setTime之前调用才有效果
     *
     * @param startYear 开始年份
     * @param endYear   结束年份
     */
    public void setRange(int startYear, int endYear) {
        wheelTime.setStartYear(startYear);
        wheelTime.setEndYear(endYear);
    }

    /**
     * 设置选中时间
     *
     * @param date 时间
     */
    public void setTime(Date date, String timeFormatter) {
        // 显示时间的格式
        this.timeFormatter = timeFormatter;
        // 显示标题信息
        this.setTitle(getTime(date, timeFormatter));
        Calendar calendar = Calendar.getInstance();
        if (date == null) {
            calendar.setTimeInMillis(System.currentTimeMillis());
        } else {
            calendar.setTime(date);
        }
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DAY_OF_MONTH);
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE) / 5;
        wheelTime.setPicker(year, month, day, hour, minute);
    }

    /**
     * 设置picker的标题
     *
     * @param title
     */
    public void setTitle(String title) {
        if (TextUtils.isEmpty(title)) {
            wheelTime.setTimeChangeListener(new OnTimeSelectListener() {

                @Override
                public void onTimeSelect(String year, String month, String day, String hour, String minutes) {
                    StringBuffer sb = new StringBuffer();
                    if (!TextUtils.isEmpty(year)) {
                        sb.append(year).append("-");
                    }
                    if (!TextUtils.isEmpty(month)) {
                        sb.append(month).append("-");
                    }
                    if (!TextUtils.isEmpty(day)) {
                        sb.append(day).append(" ");
                    }
                    if (!TextUtils.isEmpty(hour)) {
                        sb.append(hour).append(":");
                    }
                    if (!TextUtils.isEmpty(minutes)) {
                        sb.append(minutes);
                    }
                    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
                    Date time = null;
                    try {
                        time = formatter.parse(sb.toString());
                        tvTitle.setText(getTime(time, timeFormatter));
                    } catch (Exception e) {
                        tvTitle.setText("");
                    }
                }
            });
            return;
        }
        wheelTime.setTimeChangeListener(null);
        tvTitle.setText(title);
    }


    /**
     * 设置是否循环滚动
     *
     * @param cyclic 是否循环
     */
    public void setCyclic(boolean cyclic) {
        wheelTime.setCyclic(cyclic);
    }


    /**
     * 设置确定的按钮信息
     * @param submitText
     */
    public void setSubmit(String submitText) {
        if(TextUtils.isEmpty(submitText)) {
            return;
        }
        btnSubmit.setText(submitText);
    }

    /**
     * 设置取消的按钮信息
     * @param cancelText
     */
    public void setCancel(String cancelText) {
        if(TextUtils.isEmpty(cancelText)) {
            return;
        }
        btnCancel.setText(cancelText);
    }


    /**
     * 设置年份的信息
     * @param yearText
     */
    public void setYearText(String yearText) {
        if(TextUtils.isEmpty(yearText)) {
            return;
        }
        wheelTime.setYearText(yearText);
    }

    /**
     * 设置月份的信息
     * @param monthText
     */
    public void setMonthText(String monthText) {
        if(TextUtils.isEmpty(monthText)) {
            return;
        }
        wheelTime.setMonthText(monthText);
    }


    /**
     * 设置日期的信息
     * @param dayText
     */
    public void setDayText(String dayText) {
        if(TextUtils.isEmpty(dayText)) {
            return;
        }
        wheelTime.setDayText(dayText);
    }


    /**
     * 设置小时的信息
     * @param hourText
     */
    public void setHourText(String hourText) {
        if(TextUtils.isEmpty(hourText)) {
            return;
        }
        wheelTime.setHourText(hourText);
    }


    /**
     * 设置分钟的信息
     * @param minuteText
     */
    public void setMinuteText(String minuteText) {
        if(TextUtils.isEmpty(minuteText)) {
            return;
        }
        wheelTime.setMinuteText(minuteText);
    }

    /**
     * 设置星期的数据
     * @param week
     */
    public void setWeeksData(String[] week) {
        if (week != null) {
            DateUtil.setWeek(week);
        }
    }


    /**
     * 获取想要的时间格式
     *
     * @param date
     * @return
     */
    public static String getTime(Date date, String timeFormatter) {
        return new SimpleDateFormat(timeFormatter).format(date);
    }


    @Override
    public void onClick(View v) {
        String tag = (String) v.getTag();
        switch (tag) {
            case TAG_CANCEL:
                if (pickerSelectListener != null) {
                    pickerSelectListener.onPickerCancel();
                }
                dismiss();
                break;
            case TAG_SUBMIT:
                if (pickerSelectListener != null) {
                    try {
                        Date date = WheelTime.dateFormat.parse(wheelTime.getTime());
                        pickerSelectListener.onPickerSelect(date);
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }
                dismiss();
                break;
        }
    }
}
