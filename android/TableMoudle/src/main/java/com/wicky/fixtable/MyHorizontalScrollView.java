package com.wicky.fixtable;

import android.content.Context;
import android.util.AttributeSet;
import android.view.View;
import android.widget.HorizontalScrollView;

/**
 * Created by Wicky on 2015/3/26.
 * SyncHorizontalScrollView
 */
public class MyHorizontalScrollView extends HorizontalScrollView {
    private View mView;

    public MyHorizontalScrollView(Context context) {
        super(context);
    }

    public MyHorizontalScrollView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public MyHorizontalScrollView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    @Override
    protected void onScrollChanged(int l, int t, int oldl, int oldt) {
        super.onScrollChanged(l, t, oldl, oldt);
        if(null != mView)
            mView.scrollTo(l, t);
    }

    public void setScrollView(View mView) {
        this.mView = mView;
    }
}
