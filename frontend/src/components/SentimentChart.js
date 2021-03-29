import { values } from 'lodash';
import React from 'react';
import { Line, defaults } from 'react-chartjs-2';

defaults.global.defaultFontColor = '#1a1e2c';
defaults.global.defaultFontFamily = 'Poppins';

const SentimentChart = ({
  sentimentScores,
  firstYearIndex,
  lastYearIndex,
  sources,
}) => {
  const colors = [
    '#0346f2',
    '#a522d9',
    '#e200b6',
    '#ff008f',
    '#ff1369',
    '#ff5547',
    '#ff8126',
    '#ffa600',
  ];

  const labels = [
    '2000',
    '2001',
    '2002',
    '2003',
    '2004',
    '2005',
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
  ].slice(firstYearIndex, lastYearIndex);

  const datasets = [];
  let colorIndex = 0;
  for (const source in sentimentScores) {
    if (sources.has(source)) {
      datasets.push({
        label: source,
        data: sentimentScores[source].slice(firstYearIndex, lastYearIndex),
        fill: false,
        backgroundColor: colors[colorIndex],
        borderColor: colors[colorIndex++] + '55',
        yAxisID: 'y-axis-1',
      });
    }
  }

  const graphData = {
    labels,
    datasets,
  };

  const options = {
    scales: {
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-1',
        },
      ],
    },
  };

  return <Line data={graphData} options={options} />;
};

export default SentimentChart;
