package com.necer.ncalendar.calendar;

import android.content.Context;
import android.content.res.TypedArray;
import android.support.v4.view.ViewPager;
import android.util.AttributeSet;
import android.util.SparseArray;
import android.view.MotionEvent;

import com.necer.ncalendar.R;
import com.necer.ncalendar.adapter.CalendarAdapter;
import com.necer.ncalendar.utils.Attrs;
import com.necer.ncalendar.utils.Utils;
import com.necer.ncalendar.view.CalendarView;

import org.joda.time.DateTime;

import java.util.List;


/**
 * Created by necer on 2017/6/13.
 */

public abstract class CalendarViewPager extends ViewPager {

    protected CalendarAdapter calendarAdapter;
    protected int mRowHeigh;
    protected CalendarView currentView;
    protected DateTime startDateTime;
    protected DateTime endDateTime;
    protected int mPageSize;
    protected int mCurrPage;


    public CalendarViewPager(Context context) {
        this(context, null);
    }

    public CalendarViewPager(Context context, AttributeSet attrs) {
        super(context, attrs);

        TypedArray ta = context.obtainStyledAttributes(attrs, R.styleable.NCalendar);
        Attrs.solarTextColor = ta.getColor(R.styleable.NCalendar_solarTextColor, getResources().getColor(R.color.solarTextColor));
        Attrs.lunarTextColor = ta.getColor(R.styleable.NCalendar_lunarTextColor, getResources().getColor(R.color.lunarTextColor));
        Attrs.selectCircleColor = ta.getColor(R.styleable.NCalendar_selectCircleColor, getResources().getColor(R.color.selectCircleColor));
        Attrs.hintColor = ta.getColor(R.styleable.NCalendar_hintColor, getResources().getColor(R.color.hintColor));
        Attrs.solarTextSize = ta.getDimension(R.styleable.NCalendar_solarTextSize, Utils.sp2px(context, 14));
        Attrs.lunarTextSize = ta.getDimension(R.styleable.NCalendar_lunarTextSize, Utils.sp2px(context, 8));
        Attrs.selectCircleRadius = ta.getInt(R.styleable.NCalendar_selectCircleRadius, (int) Utils.dp2px(context, 200));
        Attrs.isShowLunar = ta.getBoolean(R.styleable.NCalendar_isShowLunar, false);

        Attrs.pointSize = ta.getDimension(R.styleable.NCalendar_pointSize, (int) Utils.dp2px(context, 2));
        Attrs.pointColor = ta.getColor(R.styleable.NCalendar_pointcolor, getResources().getColor(R.color.selectCircleColor));
        Attrs.hollowCircleColor = ta.getColor(R.styleable.NCalendar_hollowCircleColor, getResources().getColor(R.color.solarTextColor));
        Attrs.hollowCircleStroke = ta.getInt(R.styleable.NCalendar_hollowCircleStroke, (int) Utils.dp2px(context, 1));

        String startString = ta.getString(R.styleable.NCalendar_startDateTime);
        String endString = ta.getString(R.styleable.NCalendar_endDateTime);
        ta.recycle();

        startDateTime = new DateTime(startString == null ? "2016-01-01" : startString);
        endDateTime = new DateTime(endString == null ? "2018-12-31" : endString);

        calendarAdapter = getCalendarAdapter();
        setAdapter(calendarAdapter);
        setCurrentItem(mCurrPage);

        addOnPageChangeListener(new OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
            }

            @Override
            public void onPageSelected(int position) {
                initCurrentCalendarView();
            }

            @Override
            public void onPageScrollStateChanged(int state) {
            }
        });
        post(new Runnable() {
            @Override
            public void run() {
                initCurrentCalendarView();
            }
        });
    }

    public int getRowHeigh() {
        return mRowHeigh;
    }


    public void setDate(int year, int month, int day) {
        setDate(year, month, day, false);
    }

    protected abstract CalendarAdapter getCalendarAdapter();

    protected abstract void initCurrentCalendarView();

    public abstract void setDate(int year, int month, int day, boolean smoothScroll);

    public abstract int jumpDate(DateTime dateTime, boolean smoothScroll);

    public abstract DateTime getSelectDateTime();

    public void setPointList(List<String> pointList) {
        if (currentView == null) {
            return;
        }
        currentView.setPointList(pointList);
        invalidate();
    }

    @Override
    public boolean onTouchEvent(MotionEvent arg0) {
        return false;
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent arg0) {
        return false;
    }


    /**
     * 清除选中的item
     * @param currentCalendarView
     */
    protected void clearSelect(CalendarView currentCalendarView) {
        SparseArray<CalendarView> monthViews = calendarAdapter.getCalendarViews();
        for (int i = 0; i < monthViews.size(); i++) {
            int key = monthViews.keyAt(i);
            if (currentCalendarView == null) {
                return;
            }
            CalendarView view = monthViews.get(key);
            if (view.hashCode() != currentCalendarView.hashCode()) {
                view.clear();
            }
        }
    }
}
