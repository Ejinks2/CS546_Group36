const monthRef = {"01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June", "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December"};

function updateChartB (crimeData, chartElem, chart, borough, crimesList) {
  const boroughCrimes = {};
  crimesList.forEach(crime => {
    boroughCrimes[crime] = 0; // make sure each crime appears in chart even if not in passed data
  })
  crimeData.forEach(crime => {
    boroughCrimes[crime.offense] = (boroughCrimes[crime.offense] || 0) + 1;
  });

  if (chart) chart.destroy(); // destroy existing chart before making new one

  let label = "Number of Crimes by type";
  if (borough !== "ALL") label = "Number of Crimes in " + borough + " by type";

  return new Chart(chartElem, { // charts derived from examples at chartjs.org
    type: 'bar',
    data: {
      labels: crimesList,
      datasets: [{
        label: "Crime Count",
        data: Object.values(boroughCrimes),
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: label
        }
      },
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

function updateChartC (crimeData, chartElem, chart, offense, boroughsList) {
  const boroughCrimes = {};
  boroughsList.forEach(borough => {
    boroughCrimes[borough] = 0;
  })
  crimeData.forEach(crime => {
    boroughCrimes[crime.borough] = (boroughCrimes[crime.borough] || 0) + 1;
  });

  if (chart) chart.destroy();

  let label = "Number of Crimes per borough";
  if (offense !== "ALL") label = "Number of " + offense + " crimes per borough";

  return new Chart(chartElem, {
    type: 'bar',
    data: {
      labels: boroughsList,
      datasets: [{
        label: "Crime Count",
        data: Object.values(boroughCrimes),
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: label
        }
      },
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

function updateChartT (crimeData, chartElem, chart, month, crimesList) {
  const boroughCrimes = {};
  crimesList.forEach(crime => {
    boroughCrimes[crime] = 0;
  })
  crimeData.forEach(crime => {
    boroughCrimes[crime.offense] = (boroughCrimes[crime.offense] || 0) + 1;
  });

  if (chart) chart.destroy();

  let label = "Number of Crimes in " + monthRef[month] + " by type";
  if (month === "ALL") label = "Number of Crimes by type";

  return new Chart(chartElem, {
    type: 'bar',
    data: {
      labels: crimesList,
      datasets: [{
        label: "Crime Count",
        data: Object.values(boroughCrimes),
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: label
        }
      },
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

