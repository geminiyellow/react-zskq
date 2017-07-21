package com.necer.ncalendar.calendar;
import android.content.Context;
import android.util.AttributeSet;
import android.util.SparseArray;

import com.necer.ncalendar.adapter.CalendarAdapter;
import com.necer.ncalendar.adapter.WeekCalendarAdapter;
import com.necer.ncalendar.listener.OnClickWeekCalendarListener;
import com.necer.ncalendar.listener.OnClickWeekViewListener;
import com.necer.ncalendar.listener.OnWeekCalendarPageChangeListener;
import com.necer.ncalendar.utils.Utils;
import com.necer.ncalendar.view.CalendarView;
import com.necer.ncalendar.view.WeekView;

import org.joda.time.DateTime;
import org.joda.time.Weeks;

/**
 * Created by necer on 2017/6/13.
 */
public class WeekCalendar extends CalendarViewPager implements OnClickWeekViewListener {

    private OnClickWeekCalendarListener onClickWeekCalendarListener;
    private OnWeekCalendarPageChangeListener onWeekCalendarPageChangeListener;

    public WeekCalendar(Context context) {
        super(context);
    }

    public WeekCalendar(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected CalendarAdapter getCalendarAdapter() {

        DateTime startSunFirstDayOfWeek = Utils.getSunFirstDayOfWeek(startDateTime);
        DateTime endSunFirstDayOfWeek = Utils.getSunFirstDayOfWeek(endDateTime);
        DateTime todaySunFirstDayOfWeek = Utils.getSunFirstDayOfWeek(DateTime.now());

        mPageSize = Weeks.weeksBetween(startSunFirstDayOfWeek, endSunFirstDayOfWeek).getWeeks() + 1;
        mCurrPage = Weeks.weeksBetween(startSunFirstDayOfWeek, todaySunFirstDayOfWeek).getWeeks();


        return new WeekCalendarAdapter(getContext(), mPageSize, mCurrPage, new DateTime(), this);
    }

    @Override
    protected void initCurrentCalendarView() {
        currentView = (WeekView) calendarAdapter.getCalendarViews().get(getCurrentItem());
        if (currentView == null) {
            return;
        }
        if (onWeekCalendarPageChangeListener != null && currentView != null) {
            DateTime selectDateTime = currentView.getSelectDateTime();
            DateTime initialDateTime = currentView.getInitialDateTime();
            onWeekCalendarPageChangeListener.onWeekCalendarPageSelected(selectDateTime == null ? initialDateTime : selectDateTime);
        }
    }

    @Override
    public void setDate(int year, int month, int day, boolean smoothScroll) {
        DateTime dateTime = new DateTime(year, month, day, 0, 0, 0);
        int i = jumpDate(dateTime, smoothScroll);
        WeekView weekView = (WeekView) calendarAdapter.getCalendarViews().get(i);

        if (weekView == null) {
            return;
        }
        weekView.setSelectDateTime(dateTime);
    }

    @Override
    public int jumpDate(DateTime dateTime, boolean smoothScroll) {
        //
        SparseArray<CalendarView> calendarViews = calendarAdapter.getCalendarViews();
        if (calendarViews.size() == 0) {
            return getCurrentItem();
        }

        DateTime initialDateTime = calendarViews.get(getCurrentItem()).getInitialDateTime();
        int weeks = Utils.getIntervalWeek(initialDateTime, dateTime);
        int i = getCurrentItem() + weeks;
        setCurrentItem(i, smoothScroll);
        return i;
    }

    public void setOnClickWeekCalendarListener(OnClickWeekCalendarListener onClickWeekCalendarListener) {
        this.onClickWeekCalendarListener = onClickWeekCalendarListener;
    }

    public void setOnWeekCalendarPageChangeListener(OnWeekCalendarPageChangeListener onWeekCalendarPageChangeListener) {
        this.onWeekCalendarPageChangeListener = onWeekCalendarPageChangeListener;
    }

    @Override
    public DateTime getSelectDateTime() {
        if (currentView == null) {
            return null;
        }
        return currentView.getSelectDateTime();
    }

    @Override
    public void onClickCurrentWeek(DateTime dateTime) {
        WeekView weekView = (WeekView) calendarAdapter.getCalendarViews().get(getCurrentItem());
        weekView.setSelectDateTime(dateTime);
        //清除其他选中
        //  clearSelect(weekView);
        if (onClickWeekCalendarListener != null) {
            onClickWeekCalendarListener.onClickWeekCalendar(dateTime);
        }
    }


    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        int heightSize = MeasureSpec.getSize(heightMeasureSpec);
        mRowHeigh = heightSize;
    }
}
