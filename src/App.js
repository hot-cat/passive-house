import logo from './logo.svg';
import './App.css';
import { MapContainer, TileLayer, useMap, Marker , Popup } from 'react-leaflet';
function App() {
  return (
    <div className="App">
      <MapContainer center={[ 42.35, 25.12]} zoom={7.5} scrollWheelZoom={false}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[ 42.35, 25.12]}>
    <Popup>
      This is prototype of Passive House <br /> Example Location
    </Popup>
  </Marker>
</MapContainer>
    </div>

  );
}

export default App;
