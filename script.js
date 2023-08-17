class Weather {
    constructor(location, tempC, tempF, desc) {
        this.location = location;
        this.tempC = tempC;
        this.tempF = tempF;
        this.desc = desc;
        this.forecastC = [];
        this.forecastF = [];
        this.forecastDates = [];
        this.forecastConds = [];
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
        this.forecastC = [];
        for (let i = 1; i < newForecast.length; i++) {
            this.forecastC.push(newForecast[i].day.avgtemp_c);
        }
    }
    getForecastF() {
        return this.forecastF;
    }
    setForecastF(newForecast) {
        this.forecastF = [];
        for (let i = 1; i < newForecast.length; i++) {
            this.forecastF.push(newForecast[i].day.avgtemp_f);
        }
    }
    getForecastDates() {
        return this.forecastDates;
    }
    setForecastDates(dates) {
        this.forecastDates = [];
        for (let i = 1; i < dates.length; i++) {
            this.forecastDates.push(dates[i].date);
        }
    }
    getForecastConds() {
        return this.forecastConds;
    }
    setForecastConds(conds) {
        this.forecastConds = [];
        for (let i = 1; i < conds.length; i++) {
            this.forecastConds.push(conds[i].day.condition.text);
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
let degree = "C";

document.addEventListener("DOMContentLoaded", () => {
    getData("Sydney");
})

locationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const locationInput = document.getElementById("location-input");
    const newLocation = locationInput.value;
    locationForm.reset();
    getData(newLocation);
})

async function getData(location) {
    const response = await fetch("https://api.weatherapi.com/v1/forecast.json?key=4a2e287a71bf400a9e5111702231508&q=" + location + "&days=8&aqi=no&alerts=no");
    const weatherData = await response.json();
    currLocation.setLocation(weatherData.location.name);
    currLocation.setTempC(weatherData.current.temp_c);
    currLocation.setTempF(weatherData.current.temp_f);
    currLocation.setDesc(weatherData.current.condition.text);
    currLocation.setForecastC(weatherData.forecast.forecastday);
    currLocation.setForecastF(weatherData.forecast.forecastday);
    currLocation.setForecastDates(weatherData.forecast.forecastday);
    currLocation.setForecastConds(weatherData.forecast.forecastday);
    displayData(currLocation, degree);
    displayForecast(currLocation, degree);
}

function displayData(weatherObj, deg) {
    locationEle.innerText = weatherObj.getLocation();
    descEle.innerText = weatherObj.getDesc();
    if (deg == "C") {
        tempEle.innerText = weatherObj.getTempC()  + " °C";
    } else if (deg == "F") {
        tempEle.innerText = weatherObj.getTempF()  + " °F";
    }
}

function displayForecast(weatherObj, deg) {
    const forecastEle = document.getElementById("forecast");
    let forecast = [];
    if (deg == "C") {
        forecast = weatherObj.getForecastC();
    } else if (deg == "F") {
        forecast = weatherObj.getForecastF();
    }
    const forecastDates = weatherObj.getForecastDates();
    const forecastConds = weatherObj.getForecastConds();
    while (forecastEle.firstChild) {
        forecastEle.removeChild(forecastEle.firstChild);
    }
    for (let i = 0; i < forecast.length; i++) {
        const ele = document.createElement("div");
        ele.className = "forecast-day";
        const dayEle = document.createElement("div");
        const tempEle = document.createElement("div");
        const condEle = document.createElement("div");
        const date = new Date(forecastDates[i]);
        let day = weekday[date.getDay()];
        dayEle.innerText = day;
        if (deg == "C") {
            tempEle.innerText = forecast[i] + " °C";
        } else if (deg == "F") {
            tempEle.innerText = forecast[i] + " °F";
        }
        condEle.innerText = forecastConds[i];
        ele.appendChild(dayEle);
        ele.appendChild(tempEle);
        ele.appendChild(condEle);
        forecastEle.appendChild(ele);
    }
}

const toggle = document.getElementById("toggle");
toggle.addEventListener("click", () => {
    if (degree == "C") {
        degree = "F";
        displayData(currLocation, degree);
        displayForecast(currLocation, degree);
    } else if (degree == "F") {
        degree = "C";
        displayData(currLocation, degree);
        displayForecast(currLocation, degree);
    }
})