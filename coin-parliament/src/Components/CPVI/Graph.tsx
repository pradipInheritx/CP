import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BusinessDay,
  ChartOptions,
  createChart,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  LineData,
  LineSeriesPartialOptions,
  UTCTimestamp,
} from "lightweight-charts";
import { Totals } from "../../Contexts/CoinsContext";
import styled from "styled-components";
import moment from "moment";
import Bear from "../icons/Bear";
import Bull from "../icons/Bull";

type GraphProps = {
  data: LineData[];
  totals: { [key: string]: Totals };
  symbol: string;
  width?: number;
};

const CPVI = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-17) / var(--line-spacing-10) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-ffffff);
  text-align: left;
  opacity: 1;
  line-height: 24px;
`;

const Total = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-12) / var(--line-spacing-10) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-ffffff);
  text-align: left;
  opacity: 1;
  line-height: 24px;
`;

const Tick = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal) 9px /
    var(--line-spacing-10) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-f2f2f2);
  text-align: left;
  opacity: 1;
  position: absolute;
`;

const TickLeft = styled(Tick)`
  left: ${(props: { padding: number }) => `-${props.padding}px`};
  text-align: right;
  width: ${(props: { padding: number }) => `${props.padding}px`};
`;

const TickRight = styled(Tick)`
  right: ${(props: { padding: number }) => `-${props.padding}px`};
  text-align: left;
  width: ${(props: { padding: number }) => `${props.padding}px`};
`;

const Legend = styled.div`
  position: absolute;
  top: 0;
  z-index: 1;
  color: var(--color-d4d0f3);
  font-size: 10px;
  background: var(--black);
  left: 1px;
  padding: 1px;
`;

const Icon = styled.div`
  width: 41px;
  height: 37px;
  & svg {
    width: 100%;
    height: 100%;
  }
  
`;

const GraphContainer = styled.div`
  background: transparent
    linear-gradient(
      180deg,
      var(--color-6352e8) 0%,
      var(--color-6352e8) 58%,
      #3712b3 100%,
      #130331 100%
    )
    0 0 no-repeat padding-box;
  border: 1px solid var(--color-6352e8);
  box-shadow: 0 3px 6px #00000029;
  border-radius: 6px;
  opacity: 1;
`;
var lineSeries:any;
const Graph = ({ data, totals, symbol, width = 294 }: GraphProps) => {
  const chartElement = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [series, setSeries] = useState<ISeriesApi<"Line"> | null>(null);
  const [legend, setLegend] = useState("");
  const { total } = totals[symbol] || ({} as Totals);

  const options: DeepPartial<ChartOptions> = useMemo(() => {
    return {
      handleScroll: false,
      handleScale: false,
      localization: {
        locale: "en-US",
      },
      layout: {
        backgroundColor: "transparent",
        color: "#d1d4dc",
      },
      timeScale: {
        visible: false,
        timeVisible: true,
        secondsVisible: false,
        autoScale: true,
        tickMarkFormatter: (time: UTCTimestamp | BusinessDay) => {
          return moment(Number(time) * 1000).format("DD/MM/yy hh:mm");
        },
      },
      crosshair: {
        horzLine: {
          visible: false,
        },
        vertLine: {
          visible: false,
        },
      },
      rightPriceScale: {
        autoScale: false,
        visible: false,
        alignLabels: false,
      },
      leftPriceScale: {
        autoScale: false,
        visible: false,
        alignLabels: false,
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: true,
        },
      },
    };
  }, []);

  const lineOptions: LineSeriesPartialOptions = useMemo(() => {
    return {
      priceFormat: {
        type: "custom",
        formatter: (val: number) => Number(Number(val).toFixed(2)) + "%",
      },
      autoscaleInfoProvider: () => ({
        priceRange: {
          minValue: 10,
          maxValue: 80,
        },
        margins: {
          above: 1,
          below: 1,
        },
      }),
      // lastValueVisible: false,
    };
  }, []);

  const height = useMemo(() => 130, []);
  const padding = useMemo(() => 21, []);
  

  useEffect(() => {
    
    if (!chartElement.current) return;
    const chart1 = createChart(chartElement.current, { width: width, height: height,...options });
     lineSeries = chart1.addLineSeries({color:'#6352E8',lineWidth:1,...lineOptions,crosshairMarkerVisible: true,lastPriceAnimation:1,lastValueVisible:true});
    lineSeries.setData(data);
   
    
    // setChart(
    //   createChart(chartElement.current, {
    //     width,
    //     height,
    //     ...options,
    //   })
    // );
    
  
  
  }, [width, chartElement, height, options]);

  useEffect(() => {
    if (!chart) return;

    setSeries(
      chart.addLineSeries({
        ...lineOptions,
      })
    );
  }, [chart, lineOptions]);

  useEffect(() => {
    let updateData = data[data?.length-1]
    
    
    
    if (lineSeries && updateData?.value!=0) {            
      // lineSeries.update(updateData);
    }
    if (!series) return;
    series.setData(data);
    
    const timeScale = chart?.timeScale();
    timeScale?.fitContent();

    chart?.subscribeCrosshairMove((param) => {
      if (param.time && series) {
        const price = param.seriesPrices.get(series);
        setLegend(Number(price).toFixed(2));
      } else {
        setLegend("");
      }
    });
  }, [series, chart, data]);


  return (
    <GraphContainer
      style={{
       
        width: width + padding * 2,
        padding: `12px ${padding}px 22px`,
        margin: "0 auto",
      }}
    >
      
      <div className="d-flex justify-content-between align-items-center mb-1">
        <CPVI>SVI</CPVI>
        <Total>{total} Votes</Total>
      </div>
      <div
        className="position-relative d-flex align-items-center justify-content-center"
        style={{ height }}
      >
        <Legend>{legend}</Legend>
        <div ref={chartElement} />
        <div  className="position-absolute top-0 w-100" style={{ left: 0 }}>
          <div
            className="position-relative w-100"
            style={{ height, zIndex: 0, width }}
          >
            <div
              className="position-absolute top-0 h-100"
              style={{ zIndex: 1, width: padding, right: -5 }}
            >
              <div className="position-relative h-100">
                <TickRight {...{ padding }} className="bottom-0">
                  0
                </TickRight>
                <TickRight
                  {...{ padding }}
                  className="bottom-50"
                  style={{ marginBottom: -5 }}
                >
                  50
                </TickRight>
                <TickRight {...{ padding }} className="top-0">
                  100
                </TickRight>
              </div>
            </div>
            <div
              className="position-absolute top-0 h-100"
              style={{ zIndex: 1, width: padding, left: -5 }}
            >
              <div className="position-relative h-100">
                <TickLeft {...{ padding }} className="bottom-0">
                  0
                </TickLeft>
                <TickLeft
                  {...{ padding }}
                  className="bottom-50"
                  style={{ marginBottom: -5 }}
                >
                  50
                </TickLeft>
                <TickLeft {...{ padding }} className="top-0">
                  100
                </TickLeft>
              </div>
            </div>
          </div>
        </div>
        <div
          className="d-flex align-items-center justify-content-center position-absolute top-0"
          style={{ height, zIndex: 0, width }}
        >
          <div
            className="d-flex flex-column w-100"
            style={{ height, zIndex: 0, width }}
          >
            <div
              className="h-50 w-100 d-flex justify-content-center align-items-center"
              style={{ background: "var(--color-e3e3e3)", width }}
            >
              <Icon>
                <Bull />
              </Icon>
            </div>
            <div
              className="h-50 w-100 d-flex justify-content-center align-items-center"
              style={{ background: "var(--color-f2f2f2)", width }}
            >
              <Icon>
                <Bear />
              </Icon>
            </div>
          </div>
        </div>
      </div>
    </GraphContainer>
  );
};

export default Graph;
