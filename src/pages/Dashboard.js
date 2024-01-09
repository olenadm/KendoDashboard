import * as React from "react";

import { useLocalization } from "@progress/kendo-react-intl";

import { getter } from "@progress/kendo-react-common";
import { process } from "@progress/kendo-data-query";
import { Input } from "@progress/kendo-react-inputs";
import { GridPDFExport } from "@progress/kendo-react-pdf";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { Button } from "@progress/kendo-react-buttons";
import {
  AdventureCell,
  FlagCell,
  OnlineCell,
  RatingCell,
  EngagementCell,
  CurrencyCell,
} from "./../Components/GridCells";

import {
  Grid,
  GridColumn as Column,
  GridToolbar,
} from "@progress/kendo-react-grid";
import { ColumnMenu } from "./../Components/Grid";
import {
  setGroupIds,
  setExpandedState,
} from "@progress/kendo-react-data-tools";
import { adventures } from "./../resources/adventures";

const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const initialDataState = {
  take: 10,
  skip: 0,
  group: [],
};
const processWithGroups = (data, dataState) => {
  const newDataState = process(data, dataState);
  setGroupIds({
    data: newDataState.data,
    group: dataState.group,
  });
  return newDataState;
};
const Dashboard = () => {
  const localizationService = useLocalization();

  const idGetter = getter("id");
  const [filterValue, setFilterValue] = React.useState();
  const [filteredData, setFilteredData] = React.useState(adventures);
  const [currentSelectedState, setCurrentSelectedState] = React.useState({});
  const [dataState, setDataState] = React.useState(initialDataState);
  const [dataResult, setDataResult] = React.useState(
    process(filteredData, dataState)
  );
  const [data, setData] = React.useState(filteredData);
  const onFilterChange = (ev) => {
    let value = ev.value;
    setFilterValue(ev.value);
    let newData = adventures.filter((item) => {
      let match = false;
      for (const property in item) {
        if (
          item[property]
            .toString()
            .toLocaleLowerCase()
            .indexOf(value.toLocaleLowerCase()) >= 0
        ) {
          match = true;
        }
        if (
          item[property].toLocaleDateString &&
          item[property].toLocaleDateString().indexOf(value) >= 0
        ) {
          match = true;
        }
      }
      return match;
    });
    setFilteredData(newData);
    let clearedPagerDataState = {
      ...dataState,
      take: 8,
      skip: 0,
    };
    let processedData = process(newData, clearedPagerDataState);
    setDataResult(processedData);
    setDataState(clearedPagerDataState);
    setData(newData);
  };
  const [resultState, setResultState] = React.useState(
    processWithGroups(
      adventures.map((item) => ({
        ...item,
        ["selected"]: currentSelectedState[idGetter(item)],
      })),
      initialDataState
    )
  );
  const dataStateChange = (event) => {
    setDataResult(process(filteredData, event.dataState));
    setDataState(event.dataState);
  };
  const onExpandChange = React.useCallback(
    (event) => {
      const newData = [...dataResult.data];
      const item = event.dataItem;
      if (item.groupId) {
        const targetGroup = newData.find((d) => d.groupId === item.groupId);
        if (targetGroup) {
          targetGroup.expanded = event.value;
          setDataResult({
            ...dataResult,
            data: newData,
          });
        }
      } else {
        item.expanded = event.value;
        setDataResult({
          ...dataResult,
          data: newData,
        });
      }
    },
    [dataResult]
  );
  const setSelectedValue = (data) => {
    let newData = data.map((item) => {
      if (item.items) {
        return {
          ...item,
          items: setSelectedValue(item.items),
        };
      } else {
        return {
          ...item,
          ["selected"]: currentSelectedState[idGetter(item)],
        };
      }
    });
    return newData;
  };
  const newData = setExpandedState({
    data: setSelectedValue(resultState.data),
    collapsedIds: [],
  });
  const onHeaderSelectionChange = React.useCallback(
    (event) => {
      const checkboxElement = event.syntheticEvent.target;
      const checked = checkboxElement.checked;
      const newSelectedState = {};
      data.forEach((item) => {
        newSelectedState[idGetter(item)] = checked;
      });
      setCurrentSelectedState(newSelectedState);
      const newData = data.map((item) => ({
        ...item,
        [SELECTED_FIELD]: checked,
      }));
      const newDataResult = processWithGroups(newData, dataState);
      setDataResult(newDataResult);
    },
    [data, dataState]
  );
  const onSelectionChange = (event) => {
    const selectedProductId = event.dataItem.id;
    const newData = data.map((item) => {
      if (item.id === selectedProductId) {
        item.selected = !item.selected;
      }
      return item;
    });
    setCurrentSelectedState((prevState) => ({
      ...prevState,
      [selectedProductId]: !prevState[selectedProductId],
    }));
    const newDataResult = processWithGroups(newData, dataState);
    setDataResult(newDataResult);
  };
  const getNumberOfItems = (data) => {
    let count = 0;
    data.forEach((item) => {
      if (item.items) {
        count = count + getNumberOfItems(item.items);
      } else {
        count++;
      }
    });
    return count;
  };
  const getNumberOfSelectedItems = (data) => {
    let count = 0;
    data.forEach((item) => {
      if (item.items) {
        count = count + getNumberOfSelectedItems(item.items);
      } else {
        count = count + (item.selected == true ? 1 : 0);
      }
    });
    return count;
  };
  const checkHeaderSelectionValue = () => {
    let selectedItems = getNumberOfSelectedItems(newData);
    return newData.length > 0 && selectedItems == getNumberOfItems(newData);
  };
  let _pdfExport;
  const exportExcel = () => {
    _export.save();
  };
  let _export;
  const exportPDF = () => {
    _pdfExport.save();
  };
  return (
    <div className="card-container grid main-content" id="Dashboard">
    <div className="card-component">
      <ExcelExport
        data={adventures}
        ref={(exporter) => {
          _export = exporter;
        }}
      >
        <Grid
          style={{
            height: "500px",
          }}
          pageable={{
            pageSizes: true,
          }}
          data={dataResult}
          sortable={true}
          total={resultState.total}
          onDataStateChange={dataStateChange}
          {...dataState}
          onExpandChange={onExpandChange}
          expandField="expanded"
          dataItemKey={DATA_ITEM_KEY}
          selectedField={SELECTED_FIELD}
          onHeaderSelectionChange={onHeaderSelectionChange}
          onSelectionChange={onSelectionChange}
          groupable={true}
          size={"small"}
        >
          <GridToolbar>
            <Input
              value={filterValue}
              onChange={onFilterChange}
              style={{
                border: "2px solid #ccc",
                boxShadow: "inset 0px 0px 0.5px 0px rgba(0,0,0,0.0.1)",
                width: "170px",
                height: "30px",
                marginRight: "10px",
              }}
              placeholder="Search in all columns..."
            />
            <div className="export-btns-container">
              <Button onClick={exportExcel}>Export to Excel</Button>
              <Button onClick={exportPDF}>Export to PDF</Button>
            </div>
          </GridToolbar>
          <Column
            filterable={false}
            field={SELECTED_FIELD}
            width={50}
            headerSelectionValue={checkHeaderSelectionValue()}
          />

          <Column title="Adventure">
            <Column
              field="full_name"
              title="Things I've done"
              columnMenu={ColumnMenu}
              cell={AdventureCell}
            />

            <Column
              field={"country"}
              title={localizationService.toLanguageString("custom.country")}
              columnMenu={ColumnMenu}
              width={100}
              cell={FlagCell}
            />
          </Column>
          <Column
            title={localizationService.toLanguageString("custom.performance")}
          >
            <Column
              field={"rating"}
              title={localizationService.toLanguageString("custom.rating")}
              columnMenu={ColumnMenu}
              width={110}
              cell={RatingCell}
              filter={"numeric"}
            />

            <Column
              field="target"
              title="Engagement"
              cell={EngagementCell}
              columnMenu={ColumnMenu}
            />
            <Column
              field={"budget"}
              title={localizationService.toLanguageString("custom.budget")}
              columnMenu={ColumnMenu}
              width={100}
              cell={CurrencyCell}
              filter={"numeric"}
            />
          </Column>
          <Column
            title={localizationService.toLanguageString("custom.contacts")}
          >
            <Column
              field={"address"}
              title={localizationService.toLanguageString("custom.address")}
              columnMenu={ColumnMenu}
              width={200}
            />
          </Column>
        </Grid>
      </ExcelExport>
      <GridPDFExport
        ref={(element) => {
          _pdfExport = element;
        }}
        margin="1cm"
      >
        <Grid
          style={{
            height: "500px",
          }}
          pageable={{
            pageSizes: true,
          }}
          data={dataResult}
          sortable={true}
          total={resultState.total}
          onDataStateChange={dataStateChange}
          {...dataState}
          onExpandChange={onExpandChange}
          expandField="expanded"
          dataItemKey={DATA_ITEM_KEY}
          selectedField={SELECTED_FIELD}
          onHeaderSelectionChange={onHeaderSelectionChange}
          onSelectionChange={onSelectionChange}
          groupable={true}
          size={"small"}
        >
          <GridToolbar>
            <Input
              value={filterValue}
              onChange={onFilterChange}
              style={{
                border: "2px solid #ccc",
                boxShadow: "inset 0px 0px 0.5px 0px rgba(0,0,0,0.0.1)",
                width: "170px",
                height: "30px",
                marginRight: "10px",
              }}
              placeholder="Search in all columns..."
            />
            <div className="export-btns-container">
              <Button onClick={exportExcel}>Export to Excel</Button>
              <Button>Export to PDF</Button>
            </div>
          </GridToolbar>

          <Column
            filterable={false}
            field={SELECTED_FIELD}
            width={50}
            headerSelectionValue={checkHeaderSelectionValue()}
          />
          <Column title="Employee">
            <Column
              field="full_name"
              title="Adventure"
              columnMenu={ColumnMenu}
              cell={AdventureCell}
              width="250px"
            />

            <Column
              field="flag"
              title="Country"
              filter="numeric"
              cell={FlagCell}
              columnMenu={ColumnMenu}
              width="100px"
            />
            
          </Column>
          <Column title="Perforamnce">
            <Column
              field="rating"
              title="Rating"
              cell={RatingCell}
              columnMenu={ColumnMenu}
              width="230px"
            />
            <Column
              field="target"
              title="Engagement"
              cell={EngagementCell}
              columnMenu={ColumnMenu}
             
            />
            <Column
              field={"budget"}
              title={localizationService.toLanguageString("custom.budget")}
              columnMenu={ColumnMenu}
              width={100}
              cell={CurrencyCell}
              filter={"numeric"}
            />
          </Column>
          <Column
            title={localizationService.toLanguageString("custom.contacts")}
          >
            <Column
              field={"address"}
              title={localizationService.toLanguageString("custom.address")}
              columnMenu={ColumnMenu}
              width={200}
            />
          </Column>
        </Grid>
      </GridPDFExport>
    </div>
    </div>
  );
};
export default Dashboard;
