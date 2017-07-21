package com.gaiaworks.gaiaonehandle.table;

import android.util.Log;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by AresPan on 2017/6/8.
 */

public class RNTableManager extends SimpleViewManager<TableView> {
    @Override
    public String getName() {
        return "RCTTableView";
    }

    @Override
    protected TableView createViewInstance(ThemedReactContext reactContext) {
        return new TableView(reactContext, reactContext.getCurrentActivity());
    }

    @ReactProp(name = "tableHeadData")
    public void setTableHeadData(TableView tableView, String tableHeadData) {

    }

    @ReactProp(name = "tableData")
    public void setTableData(TableView tableView, String tableData) {

    }

    @ReactProp(name = "tableInfo")
    public void setTableInfo(TableView tableView, ReadableMap tableInfo) {
        String tableHeadInfo = tableInfo.getString("tableHeadData");
        String tableData = tableInfo.getString("tableData");
        try {
            // 处理表头信息
            if (null == tableHeadInfo) {
                return;
            }
            JSONObject jsonObject = new JSONObject(tableHeadInfo);
            JSONArray jsonArray = jsonObject.getJSONArray("columns");
            List<Map<String, String>> titleData = new ArrayList<>();
            for (int i = 1; i < jsonArray.length(); i++) {
                JSONObject jsonObjectTemp = (JSONObject) jsonArray.get(i);
                String name = jsonObjectTemp.getString("name");
                String text = jsonObjectTemp.getString("text");
                String mergable = "false";
                if (jsonObjectTemp.optBoolean("mergable")) {
                    mergable = "true";
                }
                Map<String, String> cellContent = new HashMap<>();
                cellContent.put("pid", String.valueOf(i - 1));
                cellContent.put("name", name);
                cellContent.put("text", text);
                cellContent.put("mergable", mergable);
                titleData.add(cellContent);
            }
            JSONObject nameObjecct = (JSONObject) jsonArray.get(0);
            if (nameObjecct.optBoolean("mergable")) {
                tableView.setNameHB(true);
            } else {
                tableView.setNameHB(false);
            }
            // 设置表头数据
            tableView.setTitleData(titleData);
            // 设置name数据
            tableView.setNameData(setNameData(tableData));
            List<Map<String, String>> nameData = tableView.removeDuplicate(setNameData(tableData));
            tableView.setNameDataTemp(nameData);
            // 设置表格数据
            tableView.setContentData(setContentData(titleData,tableData));
            tableView.initData();
            tableView.renderTable();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private List<Map<String, String>> setNameData(String tableData) {
        if (null == tableData) {
            return null;
        }
        try {
            JSONArray jsonArray = new JSONArray(tableData);
            List<Map<String, String>> nameData = new ArrayList<>();
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObjectTemp = (JSONObject) jsonArray.get(i);
                Map<String, String> namecontent = new HashMap<>();
                String name = jsonObjectTemp.optString("EmployeeName");
                namecontent.put("text", name);
                namecontent.put("tid", String.valueOf(i));
                nameData.add(namecontent);
            }
            return nameData;
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }

    private List<List<Map<String, String>>> setContentData(List<Map<String, String>> titleData, String tableData) {
        try {
            JSONArray jsonArray = new JSONArray(tableData);
            List<Map<String, String>> columnData = new ArrayList<>();
            List<List<Map<String, String>>> tableContentData = new ArrayList<>();
            for (int j = 0; j < titleData.size(); j++) {
                Map<String, String> titleContent = titleData.get(j);
                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONObject jsonObjectTemp = (JSONObject) jsonArray.get(i);
                    Map<String, String> cellContent = new HashMap<>();
                    String titleName = titleContent.get("name");
                    String content = jsonObjectTemp.optString(titleName);
                    cellContent.put("cellText", content);
                    cellContent.put("cellName", titleName);
                    columnData.add(cellContent);
                }
                tableContentData.add(columnData);
            }

            return tableContentData;
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }
}
