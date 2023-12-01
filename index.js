let progressBar = document.querySelector(".circular-progress");
let valueContainer = document.querySelector(".value-container");
let goButton = document.querySelector(".go");
let lastAQI;
let val;
const updateCircle = (val) => {
  let currentIndex = 0;
  let progressValue = 0;
  let progressEndValue = val;
  let speed = 100 / Math.log(progressEndValue);
  let delay = 2000;

  let progress;

  function updateProgress() {
    progressValue++;
    valueContainer.textContent = `${progressValue}%`;
    progressBar.style.background = `conic-gradient(
          ${getProgressColor(progressValue)} ${progressValue * 3.6}deg,
          #cadcff ${progressValue * 3.6}deg
      )`;

    if (progressValue == progressEndValue) {
      clearInterval(progress);

      setTimeout(() => {
        currentIndex++;
        if (currentIndex >= 1) {
          return;
        }

        progressValue = 0;
        progressEndValue = val;
        speed = 100 / Math.log(progressEndValue);
        progress = setInterval(updateProgress, speed);
      }, delay);
    }
  }

  function getProgressColor(value) {
    const colorStart = [7, 127, 212];
    const colorGreen = [19, 147, 228];
    const colorMiddle = [60, 173, 244];
    const colorEnd = [128, 201, 249];
    let color;
    if (value < 40) {
      color = interpolateColors(colorStart, colorGreen, value / 40);
    } else if (value < 50) {
      color = interpolateColors(colorGreen, colorMiddle, (value - 40) / 10);
    } else {
      color = interpolateColors(colorMiddle, colorEnd, (value - 50) / 50);
    }

    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  }

  function interpolateColors(color1, color2, ratio) {
    const r = Math.round(color1[0] * (1 - ratio) + color2[0] * ratio);
    const g = Math.round(color1[1] * (1 - ratio) + color2[1] * ratio);
    const b = Math.round(color1[2] * (1 - ratio) + color2[2] * ratio);
    return [r, g, b];
  }

  progress = setInterval(updateProgress, speed);
};

const probabilities_ctx = document.getElementById("probabilities");
const ultrasonic_ctx = document.getElementById("ultrasonic");
const water_level_ctx = document.getElementById("water-level");
const water_flow_ctx = document.getElementById("water-flow");
const humidity_ctx = document.getElementById("humidity");

const data = {
  datasets: [
    {
      label: "Pressure (Pa)",
      borderColor: "rgba(255, 255, 255, 0.8)",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      pointStyle: "circle",
      pointRadius: 10,
      pointHoverRadius: 15,
    },
  ],
};

let floodProbability = new Chart(probabilities_ctx, {
  type: "doughnut",
  data: {
    labels: [
      "Pressure",
      "Water Level",
      "Soil Moisture",
      "Water Flow",
      "Temperature",
      "Pressure",
      "Humidity",
    ],
    datasets: [
      {
        data: [100, 30, 30, 40, 8, 5, 15],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: () => "Flood Factors",
        color: "rgba(255, 255, 255, 1)", // Title Color
      },
    },
    color: "rgba(255, 255, 255, 1)", // Legend Color
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  },
});

let pressureChart = new Chart(ultrasonic_ctx, {
  type: "line",
  data: data,
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: () => "BMP 280 Readings",
        color: "rgba(255, 255, 255, 1)",
      },
    },
    color: "rgba(255, 255, 255, 1)",
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
    },
  },
});

let AQIChart = new Chart(water_level_ctx, {
  type: "bar",
  data: {
    datasets: [
      {
        label: "AQI",
        backgroundColor: "rgba(6, 128, 213, 0.6)",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: () => "MQ135 Readings",
        color: "rgba(255, 255, 255, 1)",
      },
    },
    color: "rgba(255, 255, 255, 1)",
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
    },
  },
});

let lightIntensityChart = new Chart(water_flow_ctx, {
  type: "line",
  data: {
    datasets: [
      {
        label: "Light Intensity (lumens)",
        borderColor: "rgba(6, 128, 253, 0.7)",
        fill: false,
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: () => "LDR Sensor Readings",
        color: "rgba(255, 255, 255, 1)",
      },
    },
    color: "rgba(255, 255, 255, 1)",
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
    },
  },
});

let humidityChart = new Chart(humidity_ctx, {
  type: "line",
  data: {
    datasets: [
      {
        label: "Humidity (%)",
        yAxisID: "y1",
      },
      {
        label: "Temperature (C)",
        yAxisID: "y2",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: () => "DHT11 Readings",
        color: "rgba(255, 255, 255, 1)",
      },
    },
    color: "rgba(255, 255, 255, 1)",
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "left",
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  },
});
const sensorInfoContainer = document.getElementById("sensorInfo");


let pressureReadings = [];
let airQualityReadings = [];
let temperatureReadings = [];
let humidityReadings = [];
let lightIntensityReadings = [];
let droneHeightReadings = [];
let probabilities = [];
(async function test() {
  const response = await fetch(
    "https://api.thingspeak.com/channels/2365794/feeds.json?results=60"
  );
  const data = await response.json();

  data.feeds.forEach((feed) => {
    let time = new Date(feed.created_at);
    // console.log(time);
    if (feed.field1) temperatureReadings.push([feed.field1, time]);
    if (feed.field2) humidityReadings.push([feed.field2, time]);
    if (feed.field3) pressureReadings.push([feed.field3, time]);
    if (feed.field4) lightIntensityReadings.push([feed.field4, time]);
    if (feed.field5) airQualityReadings.push([feed.field5, time]);
    if (feed.field6) droneHeightReadings.push([feed.field6, time]);
    if (feed.field7) probabilities.push([feed.field7, time]);
  });
  const dataPoints = 10;
  addData(pressureChart, pressureReadings.slice(-dataPoints));
  addData(AQIChart, airQualityReadings.slice(-dataPoints));
  addData(lightIntensityChart, lightIntensityReadings.slice(-dataPoints));
  addData(humidityChart, humidityReadings.slice(-dataPoints));
  addData(humidityChart, temperatureReadings.slice(-dataPoints), 1);
  updateCircle(71);
  console.log(temperatureReadings)
  lastAQI = airQualityReadings.slice(-1)[0][0];
  lastPressure = pressureReadings.slice(-1)[0][0];
  lastHumidity = humidityReadings.slice(-1)[0][0];
  lastTemperature = temperatureReadings.slice(-1)[0][0];
  console.log(lastTemperature)
  lastLight = lightIntensityReadings.slice(-1)[0][0];
  lastHeight = droneHeightReadings.slice(-1)[0][0];
  updateSensorInfo(lastAQI, lastHumidity, lastTemperature, lastHeight);
})();
function updateSensorInfo(AQI, humidity, temp, ht) {
  console.log(temp)
  const aqiElement = document.getElementById("aqiValue");
  aqiElement.textContent = AQI;
  const aqiInfo = document.getElementById("aqiInfo");
  let aqiMessage = "";
  if (AQI < 50) {
    aqiMessage = "Good AQI. Enjoy the fresh air!";
  } else if (AQI <= 100) {
    aqiMessage = "Moderate AQI. No major concerns.";
  } else if (AQI <= 150) {
    aqiMessage = "Unhealthy AQI. Take precautions.";
  } else {
    aqiMessage = "Unhealthy AQI. Limit outdoor activities.";
  }

  // Update the content of the HTML element
  aqiInfo.textContent = aqiMessage;


  const tempElement = document.getElementById("tempValue");
  tempElement.textContent = temp;
  const tempInfo = document.getElementById("tempInfo");
  let messageTemp = "";
  if (temp < 0) {
    messageTemp = "Chilly! Bundle up!";
  } else if (temp >= 0 && temp <= 10) {
    messageTemp = "Cool vibes, grab a jacket!";
  } else if (temp > 10 && temp <= 20) {
    messageTemp = "Perfect weather! Enjoy!";
  } else if (temp > 20 && temp <= 30) {
    messageTemp = "It's warm outside!";
  } else {
    messageTemp = "Hot day! Stay cool!";
  }
  tempInfo.textContent = messageTemp;


  const droneHeight = document.getElementById("droneHeight");
  droneHeight.textContent = ht;

  const humid = document.getElementById("humid");
  humid.textContent = humidity;
  const humidInfo = document.getElementById("humidInfo");
  let humidMessage = "";
  if (humidity < 30) {
    humidMessage = "Low humidity, dry day!";
  } else if (humidity <= 60) {
    humidMessage = "Comfortable humidity. Enjoy!";
  } else if (humidity <= 80) {
    humidMessage = "Moderate humidity. Stay hydrated!";
  } else {
    humidMessage = "High humidity. Keep cool!";
  }
  humidInfo.textContent = humidMessage;



  const feelsLike = document.getElementById("feelsLike");
  const feelsLikeValue = Math.round((temp - 5 + (humidity * 12 / 100)), 2)
  feelsLike.textContent = feelsLikeValue.toString();
  const feelsLikeInfo = document.getElementById("feelsLikeInfo");
  let message = "";
  if (feelsLikeValue < 0) {
    message = "Chilly! Bundle up!";
  } else if (feelsLikeValue >= 0 && feelsLikeValue <= 10) {
    message = "Cool vibes, grab a jacket!";
  } else if (feelsLikeValue > 10 && feelsLikeValue <= 20) {
    message = "Perfect weather! Enjoy!";
  } else if (feelsLikeValue > 20 && feelsLikeValue <= 30) {
    message = "It's warm outside!";
  } else {
    message = "Hot day! Stay cool!";
  }
  feelsLikeInfo.textContent = message;

  const rainChance = document.getElementById("rainChance");
  precipitationChance = Math.round((0.7 * humidity + 0.3 * temp));
  rainChance.textContent = precipitationChance.toString();
  const rainInfo = document.getElementById("rainInfo");
  let rainMessage = "";
  if (precipitationChance === 0) {
    rainMessage = "Dry day, no rain expected!";
  } else if (precipitationChance <= 30) {
    rainMessage = "Slim chance of rain.";
  } else if (precipitationChance <= 60) {
    rainMessage = "Moderate chance of rain. Umbrella time!";
  } else if (precipitationChance <= 90) {
    rainMessage = "Rain likely. Don't forget your umbrella!";
  } else {
    rainMessage = "High chance of rain. Bring a raincoat!";
  }
  rainInfo.textContent = rainMessage;
  val = 15;


}
updateSensorInfo();
function addData(chart, arr, datasetID = 0) {
  let labels_arr = [];
  for (let i = 0; i < arr.length; ++i)
    labels_arr.push(arr[i][1].toLocaleTimeString());
  chart.data.labels = labels_arr;
  data_arr = [];
  for (let i = 0; i < arr.length; ++i) data_arr.push(arr[i][0]);
  chart.data.datasets[datasetID].data = data_arr;
  chart.update();
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}

const setUp = () => {
  goButton.classList.add("up");
  goButton.classList.remove("middle");
  goButton.setAttribute("href", "#landingPage");
};

const setMiddle = () => {
  goButton.classList.add("middle");
  goButton.classList.remove("up");
  goButton.setAttribute("href", "#middlePage");
};

const setDown = () => {
  goButton.classList.remove("up");
  goButton.classList.remove("middle");
  goButton.setAttribute("href", "#dataPage");
};

goButton.addEventListener("click", () => {
  if (goButton.classList.contains("up")) {
    setTimeout(setMiddle, 400);
  } else if (goButton.classList.contains("middle")) {
    setTimeout(setDown, 400);
  } else {
    setTimeout(setUp, 400);
  }
});


progressBar.addEventListener("click", async (e) => {
  // const val = 85 + Math.floor(Math.random() * 11) - 5;
  const res = await fetch(
    `https://api.thingspeak.com/update?api_key=Q9IOSOZ5UP9JIU48&field7=${val}`
  );
  console.log(res);
  const response = await res.json();
  if (response == 0) {
    console.log("Thingspeak Overloaded!");
  } else {
    console.log("Updated value!");
    updateCircle(val);
  }
});

