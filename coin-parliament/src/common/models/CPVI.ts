export enum ChartTimeFrames {
  HOUR = "Hour",
  DAY = "Day",
  MONTH = "Month",
  YEAR = "Year",
}

export const ChartTimeFramesInDays = {
  [ChartTimeFrames.HOUR]: 1 / 24,
  [ChartTimeFrames.DAY]: 1,
  [ChartTimeFrames.MONTH]: 30,
  [ChartTimeFrames.YEAR]: 365,
};
