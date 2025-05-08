function updateChartb (crimeData, chartElem, chart) {
  const boroughCrimes = {};
  crimeData.forEach(crime => {
    boroughCrimes[crime.offense] = (boroughCrimes[crime.offense] || 0) + 1;
  });

  if (chart) chart.destroy();

  return new Chart(chartElem, {
    type: 'bar',
    data: {
      labels: Object.keys(boroughCrimes),
      datasets: [{
        label: 'Number of Crimes',
        data: Object.values(boroughCrimes),
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Offenses'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Crime'
          }
        }
      }
    }
  });
}

function updateChartc (crimeData, chartElem, chart) {
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
        label: 'Number of Crimes',
        data: Object.values(boroughCrimes),
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Offenses'
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