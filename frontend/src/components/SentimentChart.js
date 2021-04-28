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
  entities,
  groupSources
}) => {
  const colors = [
    '#0346f2',
    '#a522d9',
    '#ff008f',
    '#ff1369',
    '#ff5547',
    '#ff8126',
    '#ffa600',
    '#e200b6',
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
  for (const entity in sentimentScores) {
    if (entities.has(entity)){
      if (groupSources){
        const sentiments = [];
        for (const source in sentimentScores[entity]){
          if (sources.has(source)){
            sentiments.push(sentimentScores[entity][source].slice(firstYearIndex, lastYearIndex));
          }
        }
        if (sentiments.length > 0){
          const finalSentimentos = [];
          for (let i = 0; i < sentiments[0].length; i++){
            var cur = 0;
            for (let j = 0; j < sentiments.length; j++){
              cur += sentiments[j][i];
            }
            cur = cur / sentiments.length;
            finalSentimentos.push(cur);
          }
          datasets.push({
            label: entity,
            data: finalSentimentos,
            fill: false,
            backgroundColor: colors[colorIndex],
            borderColor: colors[colorIndex++] + '55',
            yAxisID: 'y-axis-1',
          });
        }
      } else {
        for (const source in sentimentScores[entity]){
          if (sources.has(source)){
            datasets.push({
              label: source,
              data: sentimentScores[entity][source].slice(firstYearIndex, lastYearIndex),
              fill: false,
              backgroundColor: colors[colorIndex],
              borderColor: colors[colorIndex++] + '55',
              yAxisID: 'y-axis-1',
            });
          }
        }
      }
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
