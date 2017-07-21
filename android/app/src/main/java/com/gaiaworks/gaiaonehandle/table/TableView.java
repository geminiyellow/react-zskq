package com.gaiaworks.gaiaonehandle.table;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.facebook.react.uimanager.ThemedReactContext;
import com.gaiaworks.gaiaonehandle.R;
import com.wicky.fixtable.MyHorizontalScrollView;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by AresPan on 2017/6/8.
 */

public class TableView extends LinearLayout {

    private ThemedReactContext context;
    private Activity activity;

    MyHorizontalScrollView sc_title, sc_data;
    LinearLayout ll_data, ll_left;
    TextView txt_time;
    List<Map<String, String>> dataList = new ArrayList<Map<String, String>>(); //内容显示区
    List<Map<String, String>> timeList = new ArrayList<Map<String, String>>(); //时间片段
    List<Map<String, String>> selectedList = new ArrayList<Map<String, String>>(); //需要合并的
    // List<Map<String, String>> idsList = new ArrayList<Map<String, String>>(); // name列合并数据列表


    double unit4Dp = 0.0f;
    double width = 0;
    private boolean isNameHB = false;

    private List<Map<String, String>> titleData = new ArrayList<>();
    private List<Map<String, String>> nameData = new ArrayList<>();
    private List<Map<String, String>> nameDataTemp = new ArrayList<>();
    private List<List<Map<String, String>>> tableContentData = new ArrayList<>();
    // private List<List<Map<String, String>>> HBContentData = new ArrayList<>();
    private Map<String, Integer> CFmap = new HashMap<>();
    private int index = 0;
    private int bgCount = 0;


    public TableView(ThemedReactContext _context, Activity _activity) {
        super(_context);
        context = _context;
        activity = _activity;
        init();
    }

    public void init() {
        this.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        LinearLayout linearLayout = new LinearLayout(activity);
        linearLayout.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        View tableView = activity.getLayoutInflater().inflate(R.layout.table, null);
        this.unit4Dp = getUnitDp(context, 4)[0];//把屏幕４等分，并获取其宽度。这里和布局的“时间”textview对应。
        this.sc_title = (MyHorizontalScrollView) tableView.findViewById(com.wicky.fixtable.R.id.sc_title);
        this.sc_data = (MyHorizontalScrollView) tableView.findViewById(com.wicky.fixtable.R.id.sc_data);
        this.ll_data = (LinearLayout) tableView.findViewById(com.wicky.fixtable.R.id.ll_data);
        this.ll_left = (LinearLayout) tableView.findViewById(com.wicky.fixtable.R.id.ll_left);
        this.txt_time = (TextView) tableView.findViewById(com.wicky.fixtable.R.id.txt_time);

        //这个是很重要的地方,这样就可以同步两个ScrollView了
        sc_title.setScrollView(sc_data);
        sc_data.setScrollView(sc_title);
        linearLayout.addView(tableView);
        this.addView(linearLayout);
    }

    public void initData() {
        // 清空数据
        index = 0;
        bgCount = 0;
        if (null != dataList && dataList.size() > 0) {
            dataList = new ArrayList<>();
        }
        if (null != timeList && timeList.size() > 0) {
            timeList = new ArrayList<>();
        }
        if (null != selectedList && selectedList.size() > 0) {
            selectedList = new ArrayList<>();
        }
        // 清空table
        ll_left.removeAllViews();
        ll_data.removeAllViews();
        sc_title.removeAllViews();

        //要显示的内容区域
        for (int i = 0; i < titleData.size(); i++) {
            dataList.add(titleData.get(i));
        }

        // name列
        for (int i = 0; i < nameData.size(); i++) {
            timeList.add(nameData.get(i));
        }

        // name数据合并处理
        setHBParams();

        // 表格数据合并
        // 1 name需要合并
        // 2 列需要合并
        if (isNameHB) {
            int count = 0;
            for (int i = 0; i < nameData.size(); i++) {
                if (i < count) {
                    continue;
                }
                Map<String, String> nameMap = nameData.get(i);
                Map<String, String> mapTemp = new HashMap<String, String>();
                int countTemp = CFmap.get(nameMap.get("text"));
                if (countTemp > 1) {
                    mapTemp.put("pid", String.valueOf(0));
                    mapTemp.put("start_tid", String.valueOf(i));
                    mapTemp.put("end_tid", String.valueOf(CFmap.get(nameMap.get("text")).intValue() + i));
                    mapTemp.put("index", String.valueOf(nameDataTemp.indexOf(nameMap)));
                    selectedList.add(mapTemp);
                    count = i + countTemp;
                }
            }
        }
    }

    public void renderTable() {
        // 员工单元格处理
        txt_time.setBackgroundResource(R.drawable.table_name_cell_white_bg);
        txt_time.setWidth((int) unit4Dp + 20);
        //初始化时间
        int timeCount = nameData.size();
        for (int i = 0; i < timeCount; i++) {
            // 过滤已经合并的单元格
            if (i < index) {
                continue;
            }
            ll_left.addView(getTimeRow(i));
        }

        //初始化表头
        sc_title.addView(getTitleRow());
        //初始化内容数据
        // dataList=titleData 表头数据
        for (int i = 0; i < dataList.size(); i++) {
            Map<String, String> titleMap = dataList.get(i);
            List<String> cellText = new ArrayList<>();
            String name = titleMap.get("name");
            for (int j = 0; j < tableContentData.size(); j++) {
                List<Map<String, String>> columnMapList = tableContentData.get(j);
                for (int k = 0; k < columnMapList.size(); k++) {
                    Map<String, String> columnMap = columnMapList.get(k);
                    if (columnMap.get("cellName").equals(name)) {
                        cellText.add(columnMap.get("cellText"));
                    }
                }
            }
            ll_data.addView(getDataColumn(i, cellText));
        }
    }

    private LinearLayout getDataColumn(int platformIndex, List<String> cellTextArr) {
        //创建一个纵向布局的LinearLayout
        LinearLayout veriLinearLayout = new LinearLayout(context);
        // veriLinearLayout.setClickable(true);
        veriLinearLayout.setOrientation(LinearLayout.VERTICAL);

        int rowCount = timeList.size();
        //需要合并的行数
        long mergeRow = 0;
        int bgCount = 0;
        for (int j = 0; j < rowCount; j++) {
            //跳过合并后(mergeRow -1)数量的行
            if (mergeRow > 1) {
                mergeRow--;
                continue;
            } else {
                //清零
                mergeRow = 0;
            }
            TextView textView = new TextView(context);
            textView.setId(com.wicky.fixtable.R.id.txt_view);
            textView.setGravity(Gravity.CENTER);
            textView.setTextSize(px2sp(context, getResources().getDimension(com.wicky.fixtable.R.dimen.text_font_normal)));
            textView.setTextColor(getResources().getColor(com.wicky.fixtable.R.color.text_content_black));
            Map<String, String> pInfo = dataList.get(platformIndex);

            if (pInfo.get("mergable").equals("true")) {
                for (int i = 0; i < selectedList.size(); i++) {
                    Map<String, String> selectedMap = selectedList.get(i);
                    int startTid = Integer.parseInt(selectedMap.get("start_tid"));
                    int endTid = Integer.parseInt(selectedMap.get("end_tid"));
                    //得到当前遍历的时间集合，根据具体的业务计算合并几行
                    Map<String, String> timeSpinnerMap = timeList.get(j);
                    int tId = Integer.parseInt(timeSpinnerMap.get("tid"));
                    //如果当前的这个时间id,等于合并数据的开始时间id,表示从这里开始合并
                    if (tId == startTid) {
                        mergeRow = endTid - startTid;
                    }
                }
            }
            String cellText = cellTextArr.get(j);
            if (TextUtils.isEmpty(cellText) || "null".equals(cellText)) {
                textView.setText("");
            } else {
                if (pInfo.get("name").equals("Commission")) {
                    textView.setTextColor(getResources().getColor(R.color.completevalue_color));
                    if (cellText.contains("E")) {
                        cellText = numEtransDouble(cellText);
                    }
                    if (cellText.length() > 12) {
                        cellText = String.valueOf(numTrans(cellText));
                        cellText = cellText.substring(0,9) + "...";
                        textView.setText(cellText);
                    } else {
                        textView.setText(String.valueOf(numTrans(cellText)));
                    }
                } else if (pInfo.get("name").equals("CompleteValue") || pInfo.get("name").equals("Target") || pInfo.get("name").equals("CalculateCommission")) {
                    if (cellText.contains("E")) {
                        cellText = numEtransDouble(cellText);
                    }
                    if (cellText.length() > 12) {
                        cellText = String.valueOf(numTrans(cellText));
                        cellText = cellText.substring(0,9) + "...";
                        textView.setText(cellText);
                    } else {
                        textView.setText(String.valueOf(numTrans(cellText)));
                    }
                } else {
                    textView.setText(cellText);
                }
            }
            if (mergeRow != 0) {
                textView.setMinHeight((int) (getResources().getDimension(com.wicky.fixtable.R.dimen.dpf_cell_height) * mergeRow));
                if (bgCount % 2 != 0) {
                    textView.setBackgroundResource(com.wicky.fixtable.R.drawable.border_dfp_content);
                } else {
                    textView.setBackgroundResource(com.wicky.fixtable.R.drawable.border_dfp_content_gray);
                }
            } else {
                textView.setMinHeight((int) getResources().getDimension(com.wicky.fixtable.R.dimen.dpf_cell_height));
                // 根据name列合并情况区分
                if (!isNameHB) {
                    if (j % 2 != 0) {
                        textView.setBackgroundResource(com.wicky.fixtable.R.drawable.border_dfp_content);
                    } else {
                        textView.setBackgroundResource(com.wicky.fixtable.R.drawable.border_dfp_content_gray);
                    }
                    break;
                }
                if (isNameHB) {
                    // 获取当前列的合并需求
                    String mergable = pInfo.get("mergable");
                    if (mergable.equals("true")) {
                        // 当前列需要合并
                        if (bgCount % 2 != 0) {
                            textView.setBackgroundResource(com.wicky.fixtable.R.drawable.border_dfp_content);
                        } else {
                            textView.setBackgroundResource(com.wicky.fixtable.R.drawable.border_dfp_content_gray);
                        }
                    } else {
                        // 当前列不需要合并
                        Map<String, String> nameMap = nameData.get(j);
                        String name = nameMap.get("text");
                        int cellIndex = 0;
                        for (int m = 0; m < nameDataTemp.size(); m++) {
                            if (nameDataTemp.get(m).get("text").equals(name)) {
                                cellIndex = m;
                                break;
                            }
                        }
                        if (cellIndex % 2 != 0) {
                            textView.setBackgroundResource(com.wicky.fixtable.R.drawable.border_dfp_content);
                        } else {
                            textView.setBackgroundResource(com.wicky.fixtable.R.drawable.border_dfp_content_gray);
                        }
                    }

                }
            }
            //同头部一样设置宽度
            LayoutParams lp = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
            double oneWidth = getUnitDp(context, 1)[0] - unit4Dp;
            int headerCount = dataList.size();
            if (headerCount == 1) {
                lp.width = (int) oneWidth;
            } else if (headerCount == 2) {
                lp.width = (int) oneWidth / 2;
            } else {
                lp.width = (int) unit4Dp;
            }
            textView.setLayoutParams(lp);
            veriLinearLayout.addView(textView);
            bgCount++;
        }
        return veriLinearLayout;
    }

    private LinearLayout getTitleRow() {
        LinearLayout layout = new LinearLayout(context);
        layout.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, (int) getResources().getDimension(com.wicky.fixtable.R.dimen.dpf_cell_height)));
        layout.setOrientation(LinearLayout.HORIZONTAL);
        int headerCount = dataList.size();
        for (int j = 0; j < headerCount; j++) {
            LinearLayout view = (LinearLayout) View.inflate(context, com.wicky.fixtable.R.layout.activity_item, null);
            TextView textView = (TextView) view.findViewById(com.wicky.fixtable.R.id.txt_view);
            textView.setGravity(Gravity.CENTER);
            textView.setTextColor(getResources().getColor(R.color.text_content_black));
            textView.setText(dataList.get(j).get("text"));
            textView.setTextSize(px2sp(context, getResources().getDimension(com.wicky.fixtable.R.dimen.text_font_normal)));
            //用tag保存id信息
            textView.setTag(dataList.get(j).get("pid"));
            //如果长度为3或以下则铺满
            LayoutParams lp = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
            //总宽度－“时间”宽度＝当前title宽度
            double oneWidth = getUnitDp(context, 1)[0] - unit4Dp;
            if (headerCount == 1) {
                lp.width = (int) oneWidth;
            } else if (headerCount == 2) {
                lp.width = (int) oneWidth / 2;
            } else {
                lp.width = (int) unit4Dp;
            }
            //缓存头部宽度
            view.setLayoutParams(lp);
            layout.addView(view);
        }
        return layout;
    }

    private View getTimeRow(int i) {
        TextView textView = new TextView(context);
        //保证和“时间”一样宽
        String cellName = nameData.get(i).get("text");
        textView.setWidth((int) unit4Dp - 20);
        textView.setText(cellName);
        textView.setTextColor(getResources().getColor(com.wicky.fixtable.R.color.text_content_black));
        textView.setGravity(Gravity.CENTER);
        textView.setTextSize(px2sp(context, getResources().getDimension(com.wicky.fixtable.R.dimen.text_font_normal)));
        // 支持合并
        if (isNameHB) {
            if (CFmap.containsKey(cellName)) {
                // 显示的name为重复项
                // count 重复的数量
                int count = CFmap.get(cellName);
                if (count > 1) {
                    // 设置单元格高度
                    textView.setMinHeight((int) getResources().getDimension(com.wicky.fixtable.R.dimen.dpf_cell_height) * count);
                    // 保存i
                    index = count + i;
                } else {
                    textView.setMinHeight((int) getResources().getDimension(com.wicky.fixtable.R.dimen.dpf_cell_height));
                }
            } else {
                textView.setMinHeight((int) getResources().getDimension(com.wicky.fixtable.R.dimen.dpf_cell_height));
            }
            // 设置单元格背景
            if (bgCount % 2 != 0) {
                textView.setBackgroundResource(R.drawable.table_name_cell_white_bg);
            } else {
                textView.setBackgroundResource(R.drawable.table_name_cell_gray_bg);
            }
            bgCount++;
        } else {
            textView.setMinHeight((int) getResources().getDimension(com.wicky.fixtable.R.dimen.dpf_cell_height));
            if (i % 2 != 0) {
                textView.setBackgroundResource(R.drawable.table_name_cell_white_bg);
            } else {
                textView.setBackgroundResource(R.drawable.table_name_cell_gray_bg);
            }
        }
        return textView;
    }

    private void setHBParams() {
        // 需要将相同名称的name合并
        // 获取需要合并的cell序号
        // CFMap name列重复出现的name次数
        if (null != CFmap) {
            CFmap = new HashMap<>();
        }
        for (int i = 0; i < nameData.size(); i++) {
            Map<String, String> nameMap = nameData.get(i);
            if (CFmap.containsKey(nameMap.get("text"))) {
                CFmap.put(nameMap.get("text"), CFmap.get(nameMap.get("text")).intValue() + 1);
            } else {
                CFmap.put(nameMap.get("text"), 1);
            }
        }
    }

    public List<Map<String, String>> removeDuplicate(List<Map<String, String>> list) {
        for (int i = 0; i < list.size() - 1; i++) {
            for (int j = list.size() - 1; j > i; j--) {
                if (list.get(j).get("text").equals(list.get(i).get("text"))) {
                    list.remove(j);
                }
            }
        }
        return list;
    }

    public void setNameHB(boolean isHB) {
        if (isNameHB) {
            isNameHB = false;
        }
        this.isNameHB = isHB;
    }

    public void setTitleData(List<Map<String, String>> titleDataList) {
        if (null != titleData && titleData.size() > 0) {
            titleData = new ArrayList<>();
        }
        this.titleData = titleDataList;
    }

    public void setNameData(List<Map<String, String>> nameDataList) {
        if (null != nameData && nameData.size() > 0) {
            nameData = new ArrayList<>();
        }
        this.nameData = nameDataList;
    }

    public void setNameDataTemp(List<Map<String, String>> nameDataTempList) {
        if (null != nameDataTemp && nameDataTemp.size() > 0) {
            nameDataTemp = new ArrayList<>();
        }
        this.nameDataTemp = nameDataTempList;
    }

    public void setContentData(List<List<Map<String, String>>> tableContentDataList) {
        if (null != tableContentData && tableContentData.size() > 0) {
            tableContentData = new ArrayList<>();
        }
        this.tableContentData = tableContentDataList;
    }

    /**
     * 等分屏幕px
     *
     * @param context
     * @param num
     * @return [width, height]
     */
    private float[] getUnitDp(Context context, int num) {
        DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
        float dpHeight = displayMetrics.heightPixels;
        float dpWidth = displayMetrics.widthPixels;
        width = dpWidth;
        return new float[]{(dpWidth / num) + 20, dpHeight / num};
    }

    /**
     * 格式化数字为千分位显示；
     *
     * @return
     */
    public static String fmtMicrometer(String text) {
        DecimalFormat df = null;
        if (text.indexOf(".") > 0) {
            if (text.length() - text.indexOf(".") - 1 == 0) {
                df = new DecimalFormat("###,##0.");
            } else if (text.length() - text.indexOf(".") - 1 == 1) {
                df = new DecimalFormat("###,##0.0");
            } else {
                df = new DecimalFormat("###,##0.00");
            }
        } else {
            df = new DecimalFormat("###,##0");
        }
        double number = 0.0;
        try {
            number = Double.parseDouble(text);
        } catch (Exception e) {
            number = 0.0;
        }
        return df.format(number);
    }

    public static String numTrans(String number) {
        NumberFormat numberFormat = NumberFormat.getInstance();
        double dou = Double.parseDouble(number);
        String douStr = numberFormat.format(dou);
        return douStr;
    }

    public static int px2sp(Context context, float pxValue) {
        final float fontScale = context.getResources().getDisplayMetrics().scaledDensity;
        return (int) (pxValue / fontScale + 0.5f);
    }

    public String numEtransDouble(String numberStr) {
        BigDecimal bigDecimal = new BigDecimal(numberStr);
        return bigDecimal.toPlainString();
    }
}
