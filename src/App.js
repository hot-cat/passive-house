import logo from "./logo.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMapEvents,
} from "react-leaflet";
import data from "./bg.json";
import pixelsData from "./pvout.json";
import windData from "./wind100.json";
// import geoPixels from "./pi.json";

function LocationMarker() {
  const [positions, setPositions] = useState([
      [42.742, 23.808],
  [42.775, 24.117],
  [43.542, 24.383],
  [43.5, 23.225],
  [43.508, 23.458],
  [43.467, 23.642],
  [43.483, 24.083],
  [43.483, 24.175],
  [43.458, 24.45],
  [42.95, 22.925],
  [43, 22.883],
  [41.833, 23.733],
  [41.775, 23.767],
  [41.725, 23.742],
  [41.7, 23.775],
  [41.642, 23.85],
  [41.55, 24.008],
  [41.533, 24.025]
  ]);
  // this is your list of positions

  const [weatherData, setWeatherData] = useState({});
  const API_KEY = "18c87f85b7a7382d04567f0730cc6333";

  useEffect(() => {
    const requests = positions.map((position) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${position[0]}&lon=${position[1]}&units=imperial&appid=${API_KEY}`;
      return axios.get(url);
    });

    Promise.all(requests)
      .then((responses) => {
        const newWeatherData = {};
        responses.forEach((response, index) => {
          newWeatherData[`${positions[index][0]}_${positions[index][1]}`] =
            response.data;
        });
        setWeatherData(newWeatherData);
        console.log(newWeatherData);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  }, []);

  const map = useMapEvents({
    click(e) {
      const newPosition = [e.latlng.lat, e.latlng.lng];
      setPositions((current) => [...current, newPosition]);

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${newPosition[0]}&lon=${newPosition[1]}&units=imperial&appid=${API_KEY}`;

      axios
        .get(url)
        .then((response) => {
          setWeatherData((currentWeatherData) => ({
            ...currentWeatherData,
            [`${newPosition[0]}_${newPosition[1]}`]: response.data,
          }));
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    },
  });

  // Function to calculate the distance between two points on a sphere
  function haversineDistance(lon1, lat1, lon2, lat2) {
    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
  }

  // Function to find the pixel value for the closest lon and lat
  function findPixelValue(lat, lon) {
    let closestPixel = null;

    let shortestDistance = Infinity;

    pixelsData.forEach((pixel) => {
      const distance = haversineDistance(lon, lat, pixel.lon, pixel.lat);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestPixel = pixel;
      }
    });

    return closestPixel ? closestPixel.value : "No value";
  }

  // Function to find the pixel value for the closest lon and lat
  function findWindValue(lat, lon) {
    let closestPixel = null;

    let shortestDistance = Infinity;

    windData.forEach((pixel) => {
      const distance = haversineDistance(lon, lat, pixel.lon, pixel.lat);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestPixel = pixel;
      }
    });

    return closestPixel ? closestPixel.value : "No value";
  }

  return positions.map((position, index) => (
    <Marker key={index} position={position}>
      <Popup>
        Marker for position: {position[0]}, {position[1]}
        <br />
        Temperature:{" "}
        {(
          ((weatherData[`${position[0]}_${position[1]}`]?.main?.temp - 32) *
            5) /
          9
        ).toFixed(2)}{" "}
        C
        <br />
        Wind: {weatherData[`${position[0]}_${position[1]}`]?.wind?.speed} m/s
        <br />
        Description:{" "}
        {
          weatherData[`${position[0]}_${position[1]}`]?.weather?.[0]
            ?.description
        }
        <br />
        Humidity: {
          weatherData[`${position[0]}_${position[1]}`]?.main?.humidity
        }{" "}
        %
        <br />
        PVOUT: {findPixelValue(position[0], position[1])} kWh/day
        <br />
        Avrg Wind: {findWindValue(position[0], position[1])} m/s
      </Popup>
    </Marker>
  ));
}
const myStyle = {
  color: "purple",
  weight: 2,
  opacity: 0.5,
};

function App() {
  return (
    <div className="App">
      <MapContainer center={[42.35, 25.12]} zoom={7.5} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        <GeoJSON data={data} style={myStyle} />
      </MapContainer>
    </div>
  );
}

export default App;
