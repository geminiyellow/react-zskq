package com.andylidong.pickerview.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by Andy on 2017/3/31.
 */

public class DateUtil {

    // 设置年月日
    public static int year;
    public static int month;
    public static String[] weeks;
    public static List<String> dayData;


    /**
     * 设置数据的信息
     *
     * @param yearS
     * @param monthS
     */
    public static void setData(int yearS, int monthS) {
        year = yearS;
        month = monthS;
        if (weeks == null || weeks.length < 1) {
            weeks = new String[]{"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"};
        }
        dayData = new ArrayList<String>();
        for (int i = 1; i <= 31; i++) {
            if (i < 10) {
                dayData.add("0" + i);
            } else {
                dayData.add(i + "");
            }
        }
    }


    /**
     * 设置星期的数据
     *
     * @param weekS
     */
    public static void setWeek(String[] weekS) {
        weeks = weekS;
    }


    /**
     * 获取星期
     *
     * @return
     */
    public static String getDayOfWeek(int day) {
        Date date = null;
        try {
            date = new SimpleDateFormat("yyyy-MM-dd").parse(year + "-" + month + "-" + day);
        } catch (ParseException e) {
            date = new Date();
        }
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK) - 1;
        switch (dayOfWeek) {
            case 0:
                return weeks[0];
            case 1:
                return weeks[1];
            case 2:
                return weeks[2];
            case 3:
                return weeks[3];
            case 4:
                return weeks[4];
            case 5:
                return weeks[5];
            case 6:
                return weeks[6];
            default:
                return "";
        }
    }

    /**
     * 返回获取的天数
     * @param day
     * @return
     */
    public static int getCurrentDay(String day) {
        // 获取滑动的数据
        if (dayData != null && dayData.size() > 0) {
            if (dayData.indexOf(day) > 0)
                return dayData.indexOf(day);
        }
        return 0;
    }

}
