package com.necer.ncalendar.view;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.RectF;
import android.util.Log;
import android.view.GestureDetector;
import android.view.MotionEvent;

import com.necer.ncalendar.listener.OnClickMonthViewListener;
import com.necer.ncalendar.utils.CalendarHelper;
import com.necer.ncalendar.utils.Utils;

import org.joda.time.DateTime;

import java.util.List;

/**
 * Created by necer on 2017/6/9.
 */

public class MonthView extends CalendarView {

    private List<DateTime> monthDateTimeList;
    private List<String> lunarList;
    private List<String> localDateList;
    private OnClickMonthViewListener onClickMonthViewListener;
    private Context context;

    private int DEFAULT_ROUND_BORDER_RADIUS;// 默认圆角大小

    public MonthView(Context mContext, DateTime dateTime, OnClickMonthViewListener onClickMonthViewListener) {
        super(mContext);
        context = mContext;
        this.mInitialDateTime = dateTime;
        this.onClickMonthViewListener = onClickMonthViewListener;

        Utils.NCalendar monthCalendar = Utils.getMonthCalendar(dateTime);
        lunarList = monthCalendar.lunarList;
        localDateList = monthCalendar.localDateList;
        monthDateTimeList = monthCalendar.dateTimeList;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        // 判断显示几行
        int size = size();
        // 获取分辨率
        float scaledDensity = Utils.getDisplay(context);
        mWidth = getWidth();
        mHeight = (int) (40 * scaledDensity * size);
        DEFAULT_ROUND_BORDER_RADIUS = (int)scaledDensity * 3;
        mRectList.clear();
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < 7; j++) {
                // 整体的
                Rect rect = new Rect(j * mWidth / 7, i * mHeight / size, j * mWidth / 7 + mWidth / 7, i * mHeight / size + mHeight / size);
                // 每一个item的渲染 左  上  右 下
                int left =  j * mWidth / 7 + 11 * (int)scaledDensity;
                int top =  i * mHeight / size + 6 * (int)scaledDensity;
                int right =  j * mWidth / 7 + mWidth / 8 - 5 * (int)scaledDensity;
                int bottom =  i * mHeight / size + mHeight / size - 5 * (int)scaledDensity;
                RectF rectItem = new RectF(left, top, right, bottom);
                mRectList.add(rect);
                DateTime dateTime = monthDateTimeList.get(i * 7 + j);
                Paint.FontMetricsInt fontMetrics = mSorlarPaint.getFontMetricsInt();
                int baseline = (rect.bottom + rect.top - fontMetrics.bottom - fontMetrics.top) / 2;
                //当月和上下月的颜色不同
                if (Utils.isEqualsMonth(dateTime, mInitialDateTime)) {
                    // 当天和选中的日期不绘制农历
                    if (Utils.isToday(dateTime)) {
                        mSorlarPaint.setColor(mSelectCircleColor);
                        mSorlarPaint.setStyle(Paint.Style.STROKE);
                        mSorlarPaint.setStrokeWidth(2);
                        canvas.drawRoundRect(rectItem, DEFAULT_ROUND_BORDER_RADIUS, DEFAULT_ROUND_BORDER_RADIUS, mSorlarPaint);
                        mSorlarPaint.setStrokeWidth(0);
                        canvas.drawText(dateTime.getDayOfMonth() + "", rect.centerX(), baseline, mSorlarPaint);
                    } else {
                        mSorlarPaint.setColor(mSolarTextColor);
                        canvas.drawText(dateTime.getDayOfMonth() + "", rect.centerX(), baseline, mSorlarPaint);
                        drawLunar(canvas, rect, mLunarTextColor, i, j);
                    }
                    // 渲染是否选中
                    if (mSelectDateTime != null && dateTime.toLocalDate().equals(mSelectDateTime.toLocalDate())) {
                        mSorlarPaint.setColor(mSelectCircleColor);
                        mSorlarPaint.setStyle(Paint.Style.FILL);
                        canvas.drawRoundRect(rectItem, DEFAULT_ROUND_BORDER_RADIUS, DEFAULT_ROUND_BORDER_RADIUS, mSorlarPaint);
                        mSorlarPaint.setColor(CalendarHelper.getHelper().getSelectedTextColor());
                        canvas.drawText(dateTime.getDayOfMonth() + "", rect.centerX(), baseline, mSorlarPaint);
                    } else {
                        initCanlendar(canvas, dateTime, rect, rectItem, baseline);
                    }
                }
            }
        }
    }


    private void initCanlendar(Canvas canvas, DateTime dateTime, Rect rect, RectF rectItem, int baseline) {
        int type = CalendarHelper.getHelper().getValue(Utils.getTime(dateTime.toDate()));
        switch (type) {
            case 3:
                mSorlarPaint.setColor(CalendarHelper.getHelper().getEventBackgroundColor());
                mSorlarPaint.setStyle(Paint.Style.FILL);
                canvas.drawRoundRect(rectItem, DEFAULT_ROUND_BORDER_RADIUS, DEFAULT_ROUND_BORDER_RADIUS, mSorlarPaint);
                mSorlarPaint.setColor(CalendarHelper.getHelper().getScheduledTextColor());
                canvas.drawText(dateTime.getDayOfMonth() + "", rect.centerX(), baseline, mSorlarPaint);
                break;
            case 2:
                mSorlarPaint.setColor(CalendarHelper.getHelper().getScheduledTextColor());
                canvas.drawText(dateTime.getDayOfMonth() + "", rect.centerX(), baseline, mSorlarPaint);
                break;
            case 1:
                mSorlarPaint.setColor(CalendarHelper.getHelper().getEventBackgroundColor());
                mSorlarPaint.setStyle(Paint.Style.FILL);
                canvas.drawRoundRect(rectItem, DEFAULT_ROUND_BORDER_RADIUS, DEFAULT_ROUND_BORDER_RADIUS, mSorlarPaint);
                mSorlarPaint.setColor(CalendarHelper.getHelper().getOffScheduledTextColor());
                canvas.drawText(dateTime.getDayOfMonth() + "", rect.centerX(), baseline, mSorlarPaint);
                break;
            case 0:
                mSorlarPaint.setColor(CalendarHelper.getHelper().getOffScheduledTextColor());
                canvas.drawText(dateTime.getDayOfMonth() + "", rect.centerX(), baseline, mSorlarPaint);
                break;
            case -1:
                mSorlarPaint.setColor(CalendarHelper.getHelper().getEventBackgroundColor());
                mSorlarPaint.setStyle(Paint.Style.FILL);
                canvas.drawRoundRect(rectItem, DEFAULT_ROUND_BORDER_RADIUS, DEFAULT_ROUND_BORDER_RADIUS, mSorlarPaint);
                mSorlarPaint.setColor(CalendarHelper.getHelper().getNoScheduledTextColor());
                canvas.drawText(dateTime.getDayOfMonth() + "", rect.centerX(), baseline, mSorlarPaint);
                break;
            case -2:
                mSorlarPaint.setColor(CalendarHelper.getHelper().getNoScheduledTextColor());
                canvas.drawText(dateTime.getDayOfMonth() + "", rect.centerX(), baseline, mSorlarPaint);
                break;
            case -3:
                mSorlarPaint.setColor(CalendarHelper.getHelper().getNoScheduledTextColor());
                canvas.drawText(dateTime.getDayOfMonth() + "", rect.centerX(), baseline, mSorlarPaint);
                break;
        }
    }

    /**
     * 绘制农历
     *
     * @param canvas
     * @param rect
     * @param i
     * @param j
     */
    private void drawLunar(Canvas canvas, Rect rect, int color, int i, int j) {
        if (isShowLunar) {
            mLunarPaint.setColor(color);
            String lunar = lunarList.get(i * 7 + j);
            canvas.drawText(lunar, rect.centerX(), rect.bottom - Utils.dp2px(getContext(), 5), mLunarPaint);
        }
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        return mGestureDetector.onTouchEvent(event);
    }


    private GestureDetector mGestureDetector = new GestureDetector(getContext(), new GestureDetector.SimpleOnGestureListener() {
        @Override
        public boolean onDown(MotionEvent e) {
            return true;
        }

        @Override
        public boolean onSingleTapUp(MotionEvent e) {
            for (int i = 0; i < mRectList.size(); i++) {
                Rect rect = mRectList.get(i);
                if (rect.contains((int) e.getX(), (int) e.getY())) {
                    DateTime selectDateTime = monthDateTimeList.get(i);
                    if (Utils.isLastMonth(selectDateTime, mInitialDateTime)) {
                        onClickMonthViewListener.onClickLastMonth(selectDateTime);
                    } else if (Utils.isNextMonth(selectDateTime, mInitialDateTime)) {
                        onClickMonthViewListener.onClickNextMonth(selectDateTime);
                    } else {
                        onClickMonthViewListener.onClickCurrentMonth(selectDateTime);
                    }
                    break;
                }
            }
            return true;
        }
    });


    /**
     * 选中的是一月中的第几周
     *
     * @return
     */
    public int getWeekRow() {
        DateTime dateTime = mSelectDateTime == null ? mInitialDateTime : mSelectDateTime;
        int indexOf = localDateList.indexOf(dateTime.toLocalDate().toString());
        return indexOf / 7;
    }

    /**
     * 判断日历显示的几行
     *
     * @return
     */
    private int size() {
        // 显示的行数
        int size = 5;
        // 一个月有几天
        int days = 0;
        // 第一天显示星期几
        int dayOfWeek = 0;
        for (int i = 0; i < monthDateTimeList.size(); i++) {
            DateTime temp = monthDateTimeList.get(i);
            if (temp.getDayOfMonth() == 1) {
                days = Utils.getDaysOfMonth(temp.toDate());
                dayOfWeek = Utils.getWeekOfDate(temp.toDate());
                break;
            }
        }
        // 1、星期5 31天显示6行    2、星期6  大于29天显示6行
        if ((dayOfWeek == 6 && days == 31) || (dayOfWeek == 7 && days > 29)) {
            size = 6;
        }
        return size;
    }
}
