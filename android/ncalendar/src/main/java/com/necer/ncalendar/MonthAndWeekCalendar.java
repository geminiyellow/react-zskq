package com.necer.ncalendar;

import android.app.Activity;
import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.necer.ncalendar.calendar.WeekCalendar;
import com.necer.ncalendar.calendar.MWCalendar;

import org.joda.time.DateTime;

/**
 * Created by Andy on 2017/6/27.
 */

public class MonthAndWeekCalendar extends LinearLayout{

    private MWCalendar mwCalendar;
    private WeekCalendar weekCalendar;

    private Activity activity;
    private Context context;

    public MonthAndWeekCalendar(Context context) {
        super(context);
    }

    public MonthAndWeekCalendar(Context _context, Activity _activity) {
        super(_context);
        activity = _activity;
        context = _context;
        init();
    }


    public void init() {
        this.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        LinearLayout linearLayout = new LinearLayout(activity);
        linearLayout.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        View contentView = activity.getLayoutInflater().from(context).inflate(R.layout.activity_wm, null);
        mwCalendar = (MWCalendar) contentView.findViewById(R.id.mwCalendar);
        weekCalendar = (WeekCalendar) contentView.findViewById(R.id.weekCalendar);

        mwCalendar.setWeekCalendar(weekCalendar);
        mwCalendar.setOnClickCalendarListener(new MWCalendar.OnCalendarChangeListener() {
            @Override
            public void onClickCalendar(DateTime dateTime) {
                Log.i("js", dateTime.toString());
            }

            @Override
            public void onCalendarPageChange(DateTime dateTime) {

            }
        });

        // 将组建加载在activity
        linearLayout.addView(contentView);
        this.addView(linearLayout);

    }

    /**
     * 显示周视图
     */
    public void close() {
        mwCalendar.close();
    }

    /**
     * 显示月视图
     */
    public void open() {
        mwCalendar.open();
    }
}
