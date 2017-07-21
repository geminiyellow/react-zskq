package com.andylidong.pickerview;

import android.content.Context;
import android.graphics.Typeface;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.andylidong.pickerview.listener.OnOptionsSelectListener;
import com.andylidong.pickerview.view.BasePickerView;
import com.andylidong.pickerview.view.WheelOptions;

import java.util.ArrayList;
import java.util.List;

/**
 * 选项选择器
 * Created by Andy.Li on 15/11/22.
 */
public class OptionsPickerView<T> extends BasePickerView implements View.OnClickListener {
    private WheelOptions<T> wheelOptions;
    private Button btnSubmit, btnCancel;
    private TextView tvTitle;
    private List<T> optionsItems1 = new ArrayList<>();
    private ArrayList<ArrayList<T>> optionsItems2 = new ArrayList<>();
    private ArrayList<ArrayList<ArrayList<T>>> optionsItems3 = new ArrayList<>();
    private static final String TAG_SUBMIT = "submit";
    private static final String TAG_CANCEL = "cancel";

    public OptionsPickerView(Context context) {
        super(context);
        LayoutInflater.from(context).inflate(R.layout.pickerview_options, contentContainer);
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
        // ----转轮
        final View optionspicker = findViewById(R.id.optionspicker);
        wheelOptions = new WheelOptions(optionspicker);
    }

    public void setPicker(ArrayList<T> optionsItems) {
        this.optionsItems1 = optionsItems;
        wheelOptions.setPicker(optionsItems, null, null, false);
    }

    public void setPicker(ArrayList<T> options1Items,
                          ArrayList<ArrayList<T>> options2Items, boolean linkage) {
        this.optionsItems1 = options1Items;
        this.optionsItems2 = options2Items;
        wheelOptions.setPicker(options1Items, options2Items, null, linkage);
    }

    public void setPicker(ArrayList<T> options1Items,
                          ArrayList<ArrayList<T>> options2Items,
                          ArrayList<ArrayList<ArrayList<T>>> options3Items,
                          boolean linkage) {
        this.optionsItems1 = options1Items;
        this.optionsItems2 = options2Items;
        this.optionsItems3 = options3Items;
        wheelOptions.setPicker(options1Items, options2Items, options3Items,
                linkage);
    }

    /**
     * 设置选中的item位置
     *
     * @param option1 位置
     */
    public void setSelectOptions(int option1) {
        // 设置标题
        this.setTitle(optionsItems1.get(option1).toString());
        // 设置当前的选项
        wheelOptions.setCurrentItems(option1, 0, 0);
    }

    /**
     * 设置选中的item位置
     *
     * @param option1 位置
     * @param option2 位置
     */
    public void setSelectOptions(int option1, int option2) {
        wheelOptions.setCurrentItems(option1, option2, 0);
    }

    /**
     * 设置选中的item位置
     *
     * @param option1 位置
     * @param option2 位置
     * @param option3 位置
     */
    public void setSelectOptions(int option1, int option2, int option3) {
        wheelOptions.setCurrentItems(option1, option2, option3);
    }

    /**
     * 设置是否循环滚动
     *
     * @param cyclic 是否循环
     */
    public void setCyclic(boolean cyclic) {
        wheelOptions.setCyclic(cyclic);
    }


    /**
     * 设置picker标题
     *
     * @param title
     */
    public void setTitle(String title) {
        if (TextUtils.isEmpty(title)) {
            wheelOptions.setOptionsSelectListener(new OnOptionsSelectListener() {

                @Override
                public void onOptionsSelect(int options1, int option2, int options3) {
                    tvTitle.setText(optionsItems1.get(options1).toString() + "-"
                            + optionsItems2.get(option2).toString() + "-"
                            + optionsItems3.get(options3).toString() );
                }

            });
            return;
        }
        tvTitle.setText(title);
        wheelOptions.setOptionsSelectListener(null);
    }

    /**
     * 设置确定的按钮信息
     *
     * @param submitText
     */
    public void setSubmit(String submitText) {
        if (TextUtils.isEmpty(submitText)) {
            return;
        }
        btnSubmit.setText(submitText);
    }

    /**
     * 设置取消的按钮信息
     *
     * @param cancelText
     */
    public void setCancel(String cancelText) {
        if (TextUtils.isEmpty(cancelText)) {
            return;
        }
        btnCancel.setText(cancelText);
    }

    /**
     * 判断数据是否重复显示
     *
     * @param cyclic1
     * @param cyclic2
     * @param cyclic3
     */
    public void setCyclic(boolean cyclic1, boolean cyclic2, boolean cyclic3) {
        wheelOptions.setCyclic(cyclic1, cyclic2, cyclic3);
    }

    @Override
    public void onClick(View v) {
        String tag = (String) v.getTag();
        if (tag.equals(TAG_CANCEL)) {
            pickerSelectListener.onPickerCancel();
            dismiss();
            return;
        } else {
            if (pickerSelectListener != null) {
                if (wheelOptions.getCurrentItems().length > 1) {
                    int[] optionsCurrentItems = wheelOptions.getCurrentItems();
                    pickerSelectListener.onPickerSelect(optionsCurrentItems);
                }
            }
            dismiss();
            return;
        }
    }
}