package com.necer.ncalendar.utils;


import android.graphics.Color;

import com.facebook.react.bridge.ReadableMap;


/**
 * Created by dalancon on 2017/6/28.
 */


public class CalendarHelper {

    /**
     * 排班的文字颜色 hours > 0
     */
    private int scheduledTextColor = Color.parseColor("#14BE4B");
    /**
     * 排班的文字大小
     */
    private float scheduledTextSize = 14;
    /**
     * off班 的文字大小 hours == 0
     */
    private float offScheduledTextSize = 14;
    /**
     * off班 的文字颜色 hours == 0
     */
    private int offScheduledTextColor = Color.parseColor("#A6A6A6");
    /**
     * 未排班 的文字大小
     */
    private float noScheduledTextSize = 14;
    /**
     * 未排班 的文字颜色
     */
    private int noScheduledTextColor = Color.parseColor("#2C2C2C");
    /**
     * 选中的日期背景颜色
     */
    private int selectedBackgroundColor = Color.parseColor("#14BE4B");
    /**
     * 选中的日期字体颜色
     */
    private int selectedTextColor = Color.parseColor("#FFFFFF");
    /**
     * 今天的边框样式
     */
    private int todayBorderColor = Color.parseColor("#14BE4B");
    /**
     * 今天的文字颜色
     */
    private int todayTextColor = Color.parseColor("#14BE4B");
    /**
     * 今天的文字大小
     */
    private float todayTextSize = 14;

    /**
     * 设置事件的背景颜色
     */
    private int eventBackgroundColor = Color.parseColor("#FFF9F2");

    /**
     * 设置数据源
     *
     * @return
     */
    private ReadableMap data;

    public int getScheduledTextColor() {
        if (scheduledTextColor < 0) {
            return Color.parseColor("#14BE4B");
        }
        return scheduledTextColor;
    }

    public void setScheduledTextColor(int scheduledTextColor) {
        this.scheduledTextColor = scheduledTextColor;
    }

    public float getScheduledTextSize() {
        if (scheduledTextSize < 0) {
            return 14;
        }
        return scheduledTextSize;
    }

    public void setScheduledTextSize(float scheduledTextSize) {
        this.scheduledTextSize = scheduledTextSize;
    }

    public float getOffScheduledTextSize() {
        if (offScheduledTextSize < 0) {
            return 14;
        }
        return offScheduledTextSize;
    }

    public void setOffScheduledTextSize(float offScheduledTextSize) {
        this.offScheduledTextSize = offScheduledTextSize;
    }

    public int getOffScheduledTextColor() {
        if (offScheduledTextColor < 0) {
            return Color.parseColor("#A6A6A6");
        }
        return offScheduledTextColor;
    }

    public void setOffScheduledTextColor(int offScheduledTextColor) {
        this.offScheduledTextColor = offScheduledTextColor;
    }

    public float getNoScheduledTextSize() {
        if (noScheduledTextSize < 0) {
            return 14;
        }
        return noScheduledTextSize;
    }

    public void setNoScheduledTextSize(float noScheduledTextSize) {
        this.noScheduledTextSize = noScheduledTextSize;
    }

    public int getNoScheduledTextColor() {
        if (noScheduledTextColor < -1) {
            return Color.parseColor("#2C2C2C");
        }
        return noScheduledTextColor;
    }

    public void setNoScheduledTextColor(int noScheduledTextColor) {
        this.noScheduledTextColor = noScheduledTextColor;
    }

    public int getSelectedBackgroundColor() {
        if (selectedBackgroundColor < 0) {
            return Color.parseColor("#14BE4B");
        }
        return selectedBackgroundColor;
    }

    public void setSelectedBackgroundColor(int selectedBackgroundColor) {
        this.selectedBackgroundColor = selectedBackgroundColor;
    }

    public int getSelectedTextColor() {
        if (selectedTextColor < 0) {
            return Color.parseColor("#FFFFFF");
        }
        return selectedTextColor;
    }

    public void setSelectedTextColor(int selectedTextColor) {
        this.selectedTextColor = selectedTextColor;
    }

    public int getTodayBorderColor() {
        if (todayBorderColor < 0) {
            return Color.parseColor("#14BE4B");
        }
        return todayBorderColor;
    }

    public void setTodayBorderColor(int todayBorderColor) {
        this.todayBorderColor = todayBorderColor;
    }

    public int getTodayTextColor() {
        if (todayBorderColor < 0) {
            return Color.parseColor("#14BE4B");
        }
        return todayTextColor;
    }

    public void setTodayTextColor(int todayTextColor) {
        this.todayTextColor = todayTextColor;
    }

    public float getTodayTextSize() {
        if (todayTextSize < 0) {
            return 14;
        }
        return todayTextSize;
    }

    public void setTodayTextSize(float todayTextSize) {
        this.todayTextSize = todayTextSize;
    }

    public int getEventBackgroundColor() {
        if (eventBackgroundColor < 0) {
            eventBackgroundColor = Color.parseColor("#FFF9F2");
        }
        return eventBackgroundColor;
    }

    public void setEventBackgroundColor(int eventBackgroundColor) {
        this.eventBackgroundColor = eventBackgroundColor;
    }

    private static CalendarHelper mhelp = null;

    private CalendarHelper() {
        mhelp = this;
    }

    public static CalendarHelper getHelper() {
        synchronized (CalendarHelper.class) {
            if (mhelp == null)
                mhelp = new CalendarHelper();
        }
        return mhelp;
    }

    /**
     * 设置数据源
     *
     * @param data
     */
    public void setMarkData(ReadableMap data) {
        this.data = data;
    }

    /**
     * 判断颜色和背景颜色
     * hour 3 : 有排班和异常事件（有）
     * hour 2 : 有排班和异常事件（无）
     * hour 1 : off班和异常事件（有）
     * hour 0 : off班和异常事件（无）
     * hour -1 : 没有排班和异常事件（有）
     * hour -2 : 没有排班和异常事件（无）
     * hour -3 : 没有数据
     *
     * @param time
     * @return
     */
    public int getValue(String time) {
        try {
            if (data.hasKey(time)) {
                try {
                    int hours = data.getMap(time).getInt("hours");
                    boolean hasEvent = data.getMap(time).getBoolean("hasEvent");
                    if (hours > 0 && hasEvent) {
                        return 3;
                    } else if (hours > 0 && !hasEvent) {
                        return 2;
                    } else if (hours == 0 && hasEvent) {
                        return 1;
                    } else if (hours == 0 && !hasEvent) {
                        return 0;
                    } else if (hours < 0 && hasEvent) {
                        return -1;
                    } else if (hours < 0 && !hasEvent) {
                        return -2;
                    } else {
                        return -3;
                    }
                } catch (Exception e) {
                    return -3;
                }
            }
        }catch (Exception e) {
            // 表示数据不存在
            return -3;
        }
        return -3;
    }
}
