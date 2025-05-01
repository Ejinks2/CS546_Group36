function updateChartb (crimeData, chartElem, chart) {
  const boroughCrimes = {};
  crimeData.forEach(crime => {
    boroughCrimes[crime.borough] = (boroughCrimes[crime.borough] || 0) + 1;
  });

  if (chart) chart.destroy();

  return new Chart(chartElem, {
    type: 'bar',
    data: {
      labels: Object.keys(boroughCrimes),
      datasets: [{
        label: 'Number of Crimes per Borough',
        data: Object.values(boroughCrimes),
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Crime Count'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Borough'
          }
        }
      }
    }
  });
}