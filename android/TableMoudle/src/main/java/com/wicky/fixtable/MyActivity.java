package com.wicky.fixtable;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Wicky
 */
public class MyActivity extends Activity implements View.OnClickListener{
    final static String TAG = "MyActivity";

    MyHorizontalScrollView sc_title, sc_data;
    LinearLayout ll_data, ll_left;
    TextView txt_time;
    List<Map<String, String>> dataList = new ArrayList<Map<String, String>>(); //内容显示区
    List<Map<String, String>> timeList = new ArrayList<Map<String, String>>(); //时间片段
    List<Map<String, String>> selectedList = new ArrayList<Map<String, String>>(); //需要合并的

    final static int STATUS_ONE = 1;
    final static int STATUS_TWO = 2;
    float unit4Dp = 0.0f;

    private int unitNum = 2;

    /**
     * Called when the activity is first created.
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        //初始化组件
        initComponent();
        //使用本的数据
        initData();
        //渲染数据
        renderTable();
    }

    private void initData() {
        //要显示的内容区域
        for (int i = 0; i < 10; i++) {
            Map<String, String> map = new HashMap<String, String>();
            map.put("text", "网球场"+i);
            map.put("pid", String.valueOf(i));
            dataList.add(map);
        }

        //时间片段
        for (int i = 0; i < 12; i++) {
            Map<String, String> map = new HashMap<String, String>();
            map.put("text", "08:00-08:30");//偷个懒，写成一样的
            map.put("tid", String.valueOf(i));
            timeList.add(map);
        }

        //合并区域
        Map<String, String> map1 = new HashMap<String, String>();
        map1.put("pid", String.valueOf(3));
        map1.put("start_tid", String.valueOf(3));
        map1.put("end_tid", String.valueOf(5));
        map1.put("status", String.valueOf(STATUS_ONE));
        selectedList.add(map1);

        //合并了3行
        Map<String, String> map2 = new HashMap<String, String>();
        map2.put("pid", String.valueOf(0));
        map2.put("start_tid", String.valueOf(4));
        map2.put("end_tid", String.valueOf(4));
        map2.put("status", String.valueOf(STATUS_TWO));
        selectedList.add(map2);

    }

    private void initComponent() {
        this.unit4Dp = getUnitDp(this, 4)[0];//把屏幕４等分，并获取其宽度。这里和布局的“时间”textview对应。
        this.sc_title = (MyHorizontalScrollView) findViewById(R.id.sc_title);
        this.sc_data = (MyHorizontalScrollView) findViewById(R.id.sc_data);
        this.ll_data = (LinearLayout) findViewById(R.id.ll_data);
        this.ll_left = (LinearLayout) findViewById(R.id.ll_left);
        this.txt_time = (TextView) findViewById(R.id.txt_time);

        //这个是很重要的地方,这样就可以同步两个ScrollView了
        sc_title.setScrollView(sc_data);
        sc_data.setScrollView(sc_title);
    }

    private void renderTable() {
        //初始化时间
        int timeCount = timeList.size();
        timeCount = timeCount - unitNum + 1;
        for (int i = 0; i < timeCount; i++) {
            ll_left.addView(getTimeRow(i));
        }

        //初始化表头
        sc_title.addView(getTitleRow());
        //初始化内容数据
        for (int i = 0; i < dataList.size(); i++) {
            ll_data.addView(getDataColumn(i));
        }
    }

    private LinearLayout getDataColumn(int platformIndex) {
        //创建一个纵向布局的LinearLayout
        LinearLayout veriLinearLayout = new LinearLayout(this);
        veriLinearLayout.setClickable(true);
        veriLinearLayout.setOrientation(LinearLayout.VERTICAL);

        int rowCount = timeList.size();
        //需要合并的行数
        long mergeRow = 0;
        for (int j = 0; j < rowCount; j++) {
            //跳过合并后(mergeRow -1)数量的行
            if( mergeRow > 1) {
                mergeRow --;
                continue;
            } else {
                //清零
                mergeRow = 0;
            }
            TextView textView = new TextView(this);
            textView.setId(R.id.txt_view);
            textView.setGravity(Gravity.CENTER);
            textView.setTextSize(TypedValue.COMPLEX_UNIT_PX, getResources().getDimension(R.dimen.text_font_normal));
            textView.setTextColor(getResources().getColor(R.color.text_content_black));
            Map<String,String> pInfo = dataList.get(platformIndex);

            int dealState = -1;
            for (int i = 0; i < selectedList.size(); i++) {
                Map<String, String> selectedMap = selectedList.get(i);
                //如果存在已订场地相同的场地id，则需要显示
                if((selectedMap.get("pid")).equals(pInfo.get("pid"))) {
                    int startTid = Integer.parseInt(selectedMap.get("start_tid"));
                    int endTid = Integer.parseInt(selectedMap.get("end_tid"));
                    //得到当前遍历的时间集合，根据具体的业务计算合并几行
                    Map<String, String> timeSpinnerMap = timeList.get(j);
                    int tId = Integer.parseInt(timeSpinnerMap.get("tid"));
                    //如果当前的这个时间id,等于合并数据的开始时间id,表示从这里开始合并
                    if(tId == startTid) {
                        mergeRow = endTid - startTid;
                        dealState = Integer.parseInt(selectedMap.get("status"));
                        Log.d(TAG, "合并的场id＝" + pInfo.get("pid") + ",startTi=" + startTid + ",endTid=" + endTid + ",dealState=" + dealState);
                    }
                }
            }
            if(mergeRow != 0){
                textView.setBackgroundResource(R.drawable.border_dfp_content_gray);
                textView.setMinHeight((int) (getResources().getDimension(R.dimen.dpf_cell_height) * mergeRow));
                if(dealState != STATUS_ONE)
                    textView.setText(getResources().getString(R.string.dpf_state_bookinged));
                else
                    textView.setText(getResources().getString(R.string.dpf_state_booking));
            }else {
                if (j % 2 == 0){
                    textView.setBackgroundResource(R.drawable.border_dfp_content);
                } else {
                    textView.setBackgroundResource(R.drawable.border_dfp_content_gray);
                }
                textView.setMinHeight((int) getResources().getDimension(R.dimen.dpf_cell_height));
                textView.setOnClickListener(this);
            }
            //同头部一样设置宽度
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
            float oneWidth = getUnitDp(this, 1)[0] - unit4Dp;
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
        }
        return veriLinearLayout;
    }

    private LinearLayout getTitleRow() {
        LinearLayout layout = new LinearLayout(this);
        layout.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        layout.setOrientation(LinearLayout.HORIZONTAL);
        int headerCount = dataList.size();
        for (int j = 0; j < headerCount; j++) {
            LinearLayout view = (LinearLayout) View.inflate(this, R.layout.activity_item, null);
            TextView textView = (TextView) view.findViewById(R.id.txt_view);
            textView.setGravity(Gravity.CENTER);
            // textView.setTextColor(getResources().getColor(R.color.text_content_black));
            textView.setText(dataList.get(j).get("text"));
            //用tag保存id信息
            textView.setTag(dataList.get(j).get("pid"));
            //如果长度为3或以下则铺满
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
            //总宽度－“时间”宽度＝当前title宽度
            float oneWidth = getUnitDp(this, 1)[0] - unit4Dp;
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

    private TextView getTimeRow(int i) {
        TextView textView = new TextView(this);
        //保证和“时间”一样宽
        textView.setWidth((int) unit4Dp);
        textView.setText(timeList.get(i).get("text"));
        textView.setTextColor(getResources().getColor(R.color.text_content_black));
        textView.setGravity(Gravity.CENTER);
        //textView.setBackgroundResource(R.drawable.border_dfp_time);
        textView.setTextSize(TypedValue.COMPLEX_UNIT_PX, getResources().getDimension(R.dimen.text_font_normal));
        // 支持合并
        // 设置合并的单元格为3
        if (i == 3) {
            textView.setMinHeight((int) getResources().getDimension(R.dimen.dpf_cell_height) * unitNum);
            textView.setBackgroundResource(R.drawable.border_dfp_time);
            i = unitNum - 1 + i;
        } else {
            textView.setMinHeight((int) getResources().getDimension(R.dimen.dpf_cell_height));
        }
        if (i % 2 != 0){
            textView.setBackgroundDrawable(getResources().getDrawable(R.drawable.border_dfg_layer));
            // textView.setBackgroundResource(R.drawable.border_dfp_content);
        } else {
            textView.setBackgroundDrawable(getResources().getDrawable(R.drawable.border_dfg_layer));
            //textView.setBackgroundResource(R.drawable.border_dfp_content_gray);
        }
        return textView;
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
        return new float[]{dpWidth / num, dpHeight / num};
    }

    @Override
    public void onClick(View v) {

    }
}
