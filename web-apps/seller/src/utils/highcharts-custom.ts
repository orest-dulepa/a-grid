import { formatDaysAgo } from '@/utils/index';
import Highcharts from 'highcharts';

export const EMPTY_CHART_VALUE = 3.5;

export const DefaultChartOptions = (categories: string[]): Highcharts.Options => {
  return {
    chart: {
      type: 'spline',
      styledMode: true,
      marginLeft: 0,
      marginRight: 0,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          symbol: 'circle',
          fillColor: '#ffffff',
        },
      },
    },
    title: {
      text: '',
    },
    legend: {
      enabled: false,
    },
    yAxis: {
      tickAmount: 4,
      title: {
        text: '',
      },
      labels: {
        enabled: false,
      },
    },
    xAxis: {
      title: {
        text: '',
      },
      labels: {
        y: 44,
        formatter(this: Highcharts.AxisLabelsFormatterContextObject<number>): string {
          return formatDaysAgo(this.value);
        },
      },
      categories,
    },
    tooltip: {
      shared: true,
      useHTML: true,
      borderRadius: 20,
      padding: 4,

      shadow: {
        width: 4,
        offsetX: 0,
        offsetY: 1,
        opacity: 0.15,
      },
    },
  };
};

export const TooltipFormatter = (self: Highcharts.TooltipFormatterContextObject): string => {
  return `<div class="highcharts-tooltip__container">
          <span class="highcharts-tooltip__x">${formatDaysAgo(self.x, true)}</span>
          ${(self.points || [])
            .map(
              (point: Highcharts.TooltipFormatterContextObject) => `
          <div class="highcharts-tooltip__series">
            <span class="highcharts-tooltip__bullet highcharts-color-${point.colorIndex}">●</span>
            <div class="highcharts-tooltip__series-text">
              <span class="highcharts-tooltip__series-value">
                ${point.point.options.text ? point.point.options.text : ''}
              </span>
              <span class="highcharts-tooltip__series-name">${point.series.name}</span>
            </div>
          </div>`
            )
            .join('')}
          </div>`;
};

export const ShowPlotBandOnHover = (size: number): Highcharts.PointEventsOptionsObject => {
  let addPlotBandTimeoutId: number | null = null;
  let removePlotBandTimeoutId: number | null = null;

  const id = 'hover-plot-band';
  return {
    mouseOver() {
      if (addPlotBandTimeoutId) clearTimeout(addPlotBandTimeoutId);
      addPlotBandTimeoutId = setTimeout(() => {
        if (this.series)
          this.series.xAxis.addPlotBand({
            from: this.x - size,
            to: this.x + size,
            id,
          });
      }, 50);
    },
    mouseOut() {
      if (removePlotBandTimeoutId) clearTimeout(removePlotBandTimeoutId);

      removePlotBandTimeoutId = setTimeout(() => {
        if (this.series) this.series.xAxis.removePlotBand(id);
      }, 40);
    },
  };
};

export const FormatLabelsXAxis = (size: number): Highcharts.XAxisLabelsOptions => {
  if (size <= 15) {
    return {
      y: 44,
      autoRotation: [0],
      staggerLines: 1,
      formatter(this: Highcharts.AxisLabelsFormatterContextObject<number>): string {
        return formatDaysAgo(this.value);
      },
    };
  }
  return {
    y: 44,
    autoRotation: [0],
    staggerLines: 2,
    formatter(this: Highcharts.AxisLabelsFormatterContextObject<number>): string {
      if (this.value % 2) {
        return '';
      }
      return formatDaysAgo(this.value);
    },
  };
};
