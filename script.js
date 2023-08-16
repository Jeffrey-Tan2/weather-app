class Weather {
    constructor(location, tempC, tempF, desc) {
        this.location = location;
        this.tempC = tempC;
        this.tempF = tempF;
        this.desc = desc;
        this.forecastC = [];
        this.forecastF = [];
        this.forecastDates = [];
    }
    getLocation() {
        return this.location;
    }
    setLocation(newLocation) {
        this.location = newLocation;
    }
    getTempC() {
        return this.tempC;
    }
    setTempC(newTemp) {
        this.tempC = newTemp
    }
    getTempF() {
        return this.tempF;
    }
    setTempF(newTemp) {
        this.tempF = newTemp;
    }
    getDesc() {
        return this.desc;
    }
    setDesc(newDesc) {
        this.desc = newDesc;
    }
    getForecastC() {
        return this.forecastC;
    }
    setForecastC(newForecast) {
        for (let i = 1; i < newForecast.length; i++) {
            this.forecastC.push(newForecast[i].day.avgtemp_c);
        }
    }
    getForecastF() {
        return this.forecastF;
    }
    setForecastF(newForecast) {
        for (let i = 1; i < newForecast.length; i++) {
            this.forecastF.push(newForecast[i].day.avgtemp_f);
        }
    }
    getForecastDates() {
        return this.forecastDates;
    }
    setForecastDates(dates) {
        for (let i = 1; i < dates.length; i++) {
            this.forecastDates.push(dates[i].date);
        }
    }
}

const locationForm = document.getElementById("location-form");
const tempEle = document.getElementById("temp");
const locationEle = document.getElementById("location");
const descEle = document.getElementById("desc");
const forecastEle = document.getElementById("forecast");
const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

let currLocation = new Weather();

document.addEventListener("DOMContentLoaded", () => {
    getData("Sydney");
})

locationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const locationInput = document.getElementById("location-input");
    const newLocation = locationInput.value;
    locationForm.reset();
    console.log(newLocation);
    getData(newLocation);
})

async function getData(location) {
    const response = await fetch("https://api.weatherapi.com/v1/forecast.json?key=4a2e287a71bf400a9e5111702231508&q=" + location + "&days=8&aqi=no&alerts=no");
    const weatherData = await response.json();
    console.log(weatherData);
    currLocation.setLocation(weatherData.location.name);
    currLocation.setTempC(weatherData.current.temp_c);
    currLocation.setTempF(weatherData.current.temp_f);
    currLocation.setDesc(weatherData.current.condition.text);
    currLocation.setForecastC(weatherData.forecast.forecastday);
    currLocation.setForecastF(weatherData.forecast.forecastday);
    currLocation.setForecastDates(weatherData.forecast.forecastday);
    displayData(currLocation);
    displayForecast(currLocation);
}

function displayData(weatherObj) {
    console.log("Location: " + weatherObj.getLocation());
    locationEle.innerText = weatherObj.getLocation();
    console.log("Temp (C): " + weatherObj.getTempC());
    tempEle.innerText = weatherObj.getTempC()  + " °C";
    console.log("Temp (F): " + weatherObj.getTempF());
    descEle.innerText = weatherObj.getDesc();
}

function displayForecast(weatherObj) {
    const forecastEle = document.getElementById("forecast");
    const forecast = weatherObj.getForecastC();
    const forecastDates = weatherObj.getForecastDates();
    for (let i = 0; i < forecast.length; i++) {
        const ele = document.createElement("div");
        ele.className = "forecast-day";
        const dayEle = document.createElement("div");
        const tempEle = document.createElement("div");
        const date = new Date(forecastDates[i]);
        let day = weekday[date.getDay()];
        dayEle.innerText = day;
        tempEle.innerText = forecast[i] + " °C";
        ele.appendChild(dayEle);
        ele.appendChild(tempEle);
        forecastEle.appendChild(ele);
    }
}