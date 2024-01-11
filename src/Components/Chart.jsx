
import {
  Chart,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartTitle,
} from "@progress/kendo-react-charts";

import "hammerjs";

const series = [
  { category: "html/css", value: 0.2545 },
  { category: "Javascript", value: 0.1552 },
  { category: "React/Next.Js", value: 0.4059 },
  { category: "Wordpress", value: 0.0911 },
  { category: "Java", value: 0.0933 },
];

const labelContent = (props) => {
  let formatedNumber = Number(props.dataItem.value).toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 2,
  });
  return `${props.dataItem.category} : ${formatedNumber}`;
};

function ChartContainer() {
  return (
    <Chart>
      <ChartTitle text="Olena's Skills" />
      <ChartLegend position="bottom" />
      <ChartSeries>
        <ChartSeriesItem
          type="pie"
          data={series}
          field="value"
          categoryField="category"
          labels={{ visible: true, content: labelContent }}
        />
      </ChartSeries>
    </Chart>
  );
}

export default ChartContainer;
