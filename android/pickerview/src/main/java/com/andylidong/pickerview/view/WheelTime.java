package com.andylidong.pickerview.view;

import android.content.Context;
import android.text.TextUtils;
import android.view.View;
import android.widget.TextView;

import com.andylidong.pickerview.R;
import com.andylidong.pickerview.TimePickerView.Type;
import com.andylidong.pickerview.adapter.NumericWheelAdapter;
import com.andylidong.pickerview.lib.WheelView;
import com.andylidong.pickerview.listener.OnItemSelectedListener;
import com.andylidong.pickerview.listener.OnTimeSelectListener;
import com.andylidong.pickerview.utils.DateUtil;
import com.andylidong.pickerview.utils.WheelTimeUtil;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;


public class WheelTime {
	public static DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
	private View view;
	private WheelView wvYear;
	private WheelView wvMonth;
	private WheelView wvDay;
	private WheelView wvHours;
	private WheelView wvMinutes;

	private TextView tvYear, tvMonth, tvDay, tvHour, tvMinute;

	private Type type;
	public static final int DEFULT_START_YEAR = 1990;
	public static final int DEFULT_END_YEAR = 2100;
	private int startYear = DEFULT_START_YEAR;
	private int endYear = DEFULT_END_YEAR;

	// 记录当前的日期
	private OnTimeSelectListener timeChangeListener;
	private static String currentYear = "";
	private static String currentMonth = "";
	private static String currentDay = "";
	private static String currentHour = "";
	private static String currentMinute = "";

	public WheelTime(View view) {
		super();
		this.view = view;
		type = Type.ALL;
		setView(view);
	}

	public WheelTime(View view, Type type) {
		super();
		this.view = view;
		this.type = type;
		setView(view);
	}

	public void setPicker(int year, int month, int day) {
		this.setPicker(year, month, day, 0, 0);
	}

	public void setPicker(int year, int month, int day, int h, int m) {
		// 设置信息的初始化
		currentYear = setTime(year);
		currentMonth = setTime(month + 1);
		currentDay = setTime(day);
		currentHour = setTime(h);
		currentMinute = setTime(m * 5);
		DateUtil.setData(year, month + 1);
		// 添加大小月月份并将其转换为list,方便之后的判断
		String[] months_big = {"1", "3", "5", "7", "8", "10", "12"};
		String[] months_little = {"4", "6", "9", "11"};

		final List<String> list_big = Arrays.asList(months_big);
		final List<String> list_little = Arrays.asList(months_little);

		Context context = view.getContext();

		// 获取时间的单位信息
		tvYear = (TextView) view.findViewById(R.id.tv_year);
		tvYear.setText(context.getString(R.string.pickerview_year));
		tvMonth = (TextView) view.findViewById(R.id.tv_month);
		tvMonth.setText(context.getString(R.string.pickerview_month));
		tvDay = (TextView) view.findViewById(R.id.tv_day);
		tvDay.setText(context.getString(R.string.pickerview_day));
		tvHour = (TextView) view.findViewById(R.id.tv_hour);
		tvHour.setText(context.getString(R.string.pickerview_hours));
		tvMinute = (TextView) view.findViewById(R.id.tv_minute);
		tvMinute.setText(context.getString(R.string.pickerview_minutes));

		// 年
		wvYear = (WheelView) view.findViewById(R.id.year);
		wvYear.setAdapter(new NumericWheelAdapter(startYear, endYear));// 设置"年"的显示数据
		wvYear.setCurrentItem(year - startYear);// 初始化时显示的数据

		// 月
		wvMonth = (WheelView) view.findViewById(R.id.month);
		wvMonth.setAdapter(new NumericWheelAdapter(1, 12));
		wvMonth.setCurrentItem(month);

		// 日
		wvDay = (WheelView) view.findViewById(R.id.day);
		// 判断大小月及是否闰年,用来确定"日"的数据
		if (list_big.contains(String.valueOf(month + 1))) {
			wvDay.setAdapter(new NumericWheelAdapter(1, 31, WheelTimeUtil.WVDAY));
		} else if (list_little.contains(String.valueOf(month + 1))) {
			wvDay.setAdapter(new NumericWheelAdapter(1, 30, WheelTimeUtil.WVDAY));
		} else {
			// 闰年
			if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
				wvDay.setAdapter(new NumericWheelAdapter(1, 29, WheelTimeUtil.WVDAY));
			else
				wvDay.setAdapter(new NumericWheelAdapter(1, 28, WheelTimeUtil.WVDAY));
		}
		wvDay.setCurrentItem(day - 1);


		wvHours = (WheelView) view.findViewById(R.id.hour);
		wvHours.setAdapter(new NumericWheelAdapter(0, 23));
		wvHours.setCurrentItem(h);

		wvMinutes = (WheelView) view.findViewById(R.id.min);
		wvMinutes.setAdapter(new NumericWheelAdapter(0, 59, WheelTimeUtil.WVMINUTE));
		wvMinutes.setCurrentItem(m);

		// 添加"年"监听
		OnItemSelectedListener wheelListener_year = new OnItemSelectedListener() {
			@Override
			public void onItemSelected(int index) {
				int year_num = index + startYear;
				DateUtil.setData(year_num, Integer.parseInt(currentMonth));
				// 判断大小月及是否闰年,用来确定"日"的数据
				int maxItem = 30;
				if (list_big
						.contains(String.valueOf(wvMonth.getCurrentItem() + 1))) {
					wvDay.setAdapter(new NumericWheelAdapter(1, 31, WheelTimeUtil.WVDAY));
					maxItem = 31;
				} else if (list_little.contains(String.valueOf(wvMonth
						.getCurrentItem() + 1))) {
					wvDay.setAdapter(new NumericWheelAdapter(1, 30, WheelTimeUtil.WVDAY));
					maxItem = 30;
				} else {
					if ((year_num % 4 == 0 && year_num % 100 != 0)
							|| year_num % 400 == 0) {
						wvDay.setAdapter(new NumericWheelAdapter(1, 29, WheelTimeUtil.WVDAY));
						maxItem = 29;
					} else {
						wvDay.setAdapter(new NumericWheelAdapter(1, 28, WheelTimeUtil.WVDAY));
						maxItem = 28;
					}
				}
				if (wvDay.getCurrentItem() > maxItem - 1) {
					wvDay.setCurrentItem(0);
					currentDay = setTime(0);
				} else {
					wvDay.setCurrentItem(DateUtil.getCurrentDay(currentDay));
				}
				// 得到年份的信息
				currentYear = setTime(wvYear.getCurrentItem() + startYear);
				if (timeChangeListener != null) {
					currentYear = setTime(wvYear.getCurrentItem() + startYear);
					timeChangeListener.onTimeSelect(currentYear, currentMonth, currentDay, currentHour, currentMinute);
				}
			}
		};
		// 添加"月"监听
		OnItemSelectedListener wheelListener_month = new OnItemSelectedListener() {
			@Override
			public void onItemSelected(int index) {
				int month_num = index + 1;
				DateUtil.setData(Integer.parseInt(currentYear), month_num);
				int maxItem = 30;
				// 判断大小月及是否闰年,用来确定"日"的数据
				if (list_big.contains(String.valueOf(month_num))) {
					wvDay.setAdapter(new NumericWheelAdapter(1, 31, WheelTimeUtil.WVDAY));
					maxItem = 31;
				} else if (list_little.contains(String.valueOf(month_num))) {
					wvDay.setAdapter(new NumericWheelAdapter(1, 30, WheelTimeUtil.WVDAY));
					maxItem = 30;
				} else {
					if (((wvYear.getCurrentItem() + startYear) % 4 == 0 && (wvYear
							.getCurrentItem() + startYear) % 100 != 0)
							|| (wvYear.getCurrentItem() + startYear) % 400 == 0) {
						wvDay.setAdapter(new NumericWheelAdapter(1, 29, WheelTimeUtil.WVDAY));
						maxItem = 29;
					} else {
						wvDay.setAdapter(new NumericWheelAdapter(1, 28, WheelTimeUtil.WVDAY));
						maxItem = 28;
					}
				}
				if (wvDay.getCurrentItem() > maxItem - 1) {
					wvDay.setCurrentItem(0);
					currentDay = setTime(0);
				} else {
					wvDay.setCurrentItem(DateUtil.getCurrentDay(currentDay));
				}
				// 得到月份的信息
				currentMonth = setTime(wvMonth.getCurrentItem() + 1);
				if (timeChangeListener != null) {
					currentMonth = setTime(wvMonth.getCurrentItem() + 1);
					timeChangeListener.onTimeSelect(currentYear, currentMonth, currentDay, currentHour, currentMinute);
				}
			}
		};
		// 日的监听者
		OnItemSelectedListener wheelListener_day = new OnItemSelectedListener() {

			@Override
			public void onItemSelected(int index) {
				// 得到日期的信息
				currentDay = setTime(wvDay.getCurrentItem() + 1);
				if (timeChangeListener != null) {
					currentDay = setTime(wvDay.getCurrentItem() + 1);
					timeChangeListener.onTimeSelect(currentYear, currentMonth, currentDay, currentHour, currentMinute);
				}
			}
		};
		// 小时的监听者
		OnItemSelectedListener wheelListener_hour = new OnItemSelectedListener() {

			@Override
			public void onItemSelected(int index) {
				// 得到小时的信息
				currentHour = setTime(wvHours.getCurrentItem());
				if (timeChangeListener != null) {
					currentHour = setTime(wvHours.getCurrentItem());
					timeChangeListener.onTimeSelect(currentYear, currentMonth, currentDay, currentHour, currentMinute);
				}
			}
		};
		// 分钟的监听者
		OnItemSelectedListener wheelListener_minute = new OnItemSelectedListener() {

			@Override
			public void onItemSelected(int index) {
				// 得到分钟的信息
				currentMinute = setTime(wvMinutes.getCurrentItem());
				if (timeChangeListener != null) {
					currentMinute = setTime(wvMinutes.getCurrentItem());
					timeChangeListener.onTimeSelect(currentYear, currentMonth, currentDay, currentHour, currentMinute);
				}
			}
		};
		// 注册监听者
		wvYear.setOnItemSelectedListener(wheelListener_year);
		wvMonth.setOnItemSelectedListener(wheelListener_month);
		wvDay.setOnItemSelectedListener(wheelListener_day);
		wvHours.setOnItemSelectedListener(wheelListener_hour);
		wvMinutes.setOnItemSelectedListener(wheelListener_minute);

		// 根据屏幕密度来指定选择器字体的大小(不同屏幕可能不同)
		int textSize = 6;

		switch (type) {
			case ALL:
				textSize = textSize * 3;
				break;
			case YEAR_MONTH_DAY:
				textSize = textSize * 4;
				wvHours.setVisibility(View.GONE);
				wvMinutes.setVisibility(View.GONE);

				tvHour.setVisibility(View.GONE);
				tvMinute.setVisibility(View.GONE);
				break;
			case YEAR_MONTH:
				textSize = textSize * 4;
				wvDay.setVisibility(View.GONE);
				wvHours.setVisibility(View.GONE);
				wvMinutes.setVisibility(View.GONE);

				tvDay.setVisibility(View.GONE);
				tvHour.setVisibility(View.GONE);
				tvMinute.setVisibility(View.GONE);
				break;
			case YEAR:
				textSize = textSize * 4;
				wvMonth.setVisibility(View.GONE);
				wvDay.setVisibility(View.GONE);
				wvHours.setVisibility(View.GONE);
				wvMinutes.setVisibility(View.GONE);

				tvMonth.setVisibility(View.GONE);
				tvDay.setVisibility(View.GONE);
				tvHour.setVisibility(View.GONE);
				tvMinute.setVisibility(View.GONE);
				break;
			case MONTH_DAY_HOUR_MINUTE:
				textSize = textSize * 4;
				wvYear.setVisibility(View.GONE);

				tvYear.setVisibility(View.GONE);
				break;
			case MONTH_DAY:
				textSize = textSize * 4;
				wvYear.setVisibility(View.GONE);
				wvHours.setVisibility(View.GONE);
				wvMinutes.setVisibility(View.GONE);

				tvYear.setVisibility(View.GONE);
				tvHour.setVisibility(View.GONE);
				tvMinute.setVisibility(View.GONE);
				break;
			case MONTH:
				textSize = textSize * 4;
				wvYear.setVisibility(View.GONE);
				wvDay.setVisibility(View.GONE);
				wvHours.setVisibility(View.GONE);
				wvMinutes.setVisibility(View.GONE);

				tvYear.setVisibility(View.GONE);
				tvDay.setVisibility(View.GONE);
				tvHour.setVisibility(View.GONE);
				tvMinute.setVisibility(View.GONE);
				break;
			case DAY:
				textSize = textSize * 4;
				wvYear.setVisibility(View.GONE);
				wvMonth.setVisibility(View.GONE);
				wvHours.setVisibility(View.GONE);
				wvMinutes.setVisibility(View.GONE);

				tvYear.setVisibility(View.GONE);
				tvMonth.setVisibility(View.GONE);
				tvHour.setVisibility(View.GONE);
				tvMinute.setVisibility(View.GONE);
				break;
			case HOUR_MINUTE:
				textSize = textSize * 4;
				wvYear.setVisibility(View.GONE);
				wvMonth.setVisibility(View.GONE);
				wvDay.setVisibility(View.GONE);

				tvYear.setVisibility(View.GONE);
				tvMonth.setVisibility(View.GONE);
				tvDay.setVisibility(View.GONE);
				break;
			case HOUR:
				textSize = textSize * 4;
				wvYear.setVisibility(View.GONE);
				wvMonth.setVisibility(View.GONE);
				wvDay.setVisibility(View.GONE);
				wvMinutes.setVisibility(View.GONE);

				tvYear.setVisibility(View.GONE);
				tvMonth.setVisibility(View.GONE);
				tvDay.setVisibility(View.GONE);
				tvMinute.setVisibility(View.GONE);
				break;
			case MINUTE:
				textSize = textSize * 4;
				wvYear.setVisibility(View.GONE);
				wvMonth.setVisibility(View.GONE);
				wvDay.setVisibility(View.GONE);
				wvHours.setVisibility(View.GONE);

				tvYear.setVisibility(View.GONE);
				tvMonth.setVisibility(View.GONE);
				tvDay.setVisibility(View.GONE);
				tvHour.setVisibility(View.GONE);
				break;
		}
		wvDay.setTextSize(textSize);
		wvMonth.setTextSize(textSize);
		wvYear.setTextSize(textSize);
		wvHours.setTextSize(textSize);
		wvMinutes.setTextSize(textSize);
	}

	/**
	 * 设置是否循环滚动
	 *
	 * @param cyclic
	 */
	public void setCyclic(boolean cyclic) {
		wvYear.setCyclic(cyclic);
		wvMonth.setCyclic(cyclic);
		wvDay.setCyclic(cyclic);
		wvHours.setCyclic(cyclic);
		wvMinutes.setCyclic(cyclic);
	}


	/**
	 * 设置显示item的数目
	 *
	 * @param itemsVisible
	 */
	public void setItemsVisible(int itemsVisible) {
		wvYear.setItemsVisible(itemsVisible);
		wvMonth.setItemsVisible(itemsVisible);
		wvDay.setItemsVisible(itemsVisible);
		wvHours.setItemsVisible(itemsVisible);
		wvMinutes.setItemsVisible(itemsVisible);
	}


	/**
	 * 获取选中的时间
	 *
	 * @return
	 */
	public String getTime() {
		StringBuffer sb = new StringBuffer();
		sb.append((wvYear.getCurrentItem() + startYear)).append("-")
				.append((wvMonth.getCurrentItem() + 1)).append("-")
				.append((wvDay.getCurrentItem() + 1)).append(" ")
				.append(wvHours.getCurrentItem()).append(":")
				.append(wvMinutes.getCurrentItem());
		return sb.toString();
	}

	/**
	 * 设置日期或者是时间的格式
	 *
	 * @param time
	 * @return
	 */
	public String setTime(int time) {
		if (time < 10) {
			return "0" + time;
		}
		return time + "";
	}


	/**
	 * 设置年份的信息
	 *
	 * @param yearText
	 */
	public void setYearText(String yearText) {
		if (TextUtils.isEmpty(yearText)) {
			return;
		}
		tvYear.setText(yearText);
	}

	/**
	 * 设置月份的信息
	 *
	 * @param monthText
	 */
	public void setMonthText(String monthText) {
		if (TextUtils.isEmpty(monthText)) {
			return;
		}
		tvMonth.setText(monthText);
	}


	/**
	 * 设置日期的信息
	 *
	 * @param dayText
	 */
	public void setDayText(String dayText) {
		if (TextUtils.isEmpty(dayText)) {
			return;
		}
		tvDay.setText(dayText);
	}


	/**
	 * 设置小时的信息
	 *
	 * @param hourText
	 */
	public void setHourText(String hourText) {
		if (TextUtils.isEmpty(hourText)) {
			return;
		}
		tvHour.setText(hourText);
	}


	/**
	 * 设置分钟的信息
	 *
	 * @param minuteText
	 */
	public void setMinuteText(String minuteText) {
		if (TextUtils.isEmpty(minuteText)) {
			return;
		}
		tvMinute.setText(minuteText);
	}


	/**
	 * 监听滑动的时间信息
	 */
	public void setTimeChangeListener(OnTimeSelectListener timeChangeListener) {
		this.timeChangeListener = timeChangeListener;
	}

	public View getView() {
		return view;
	}

	public void setView(View view) {
		this.view = view;
	}

	public int getStartYear() {
		return startYear;
	}

	public void setStartYear(int startYear) {
		this.startYear = startYear;
	}

	public int getEndYear() {
		return endYear;
	}

	public void setEndYear(int endYear) {
		this.endYear = endYear;
	}
}
