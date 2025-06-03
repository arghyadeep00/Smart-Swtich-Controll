import * as React from "react";
import { Gauge } from "@mui/x-charts/Gauge";

export default function GaugeComponent({ value, valueMax }) {
  return (
    <Gauge
      value={value}
      startAngle={-110}
      endAngle={110}
      valueMax={valueMax}
      sx={{
        "& .MuiGauge-valueText": {
          fontSize: 20,
        },
      }}
      text={({ value, valueMax }) => `${value} / ${valueMax}`}
    />
  );
}
