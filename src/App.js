import logo from "./logo.svg";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import data from "./bg.json";
function App() {
  const positions = [
    [42.698334, 23.319941], // Sofia
    [42.133611, 24.745278], // Plovdiv
    [43.21405, 27.914733], // Varna
    [42.504821, 27.462636], // Burgas
    [43.848588, 25.954951], // Ruse
  ];
  // this is your list of positions
  return (
    <div className="App">
      <MapContainer center={[42.35, 25.12]} zoom={7.5} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.map((position) => (
          <Marker key={position} position={position}>
            <Popup>
              Marker for position: {position[0]}, {position[1]}
            </Popup>
          </Marker>
        ))}
        <GeoJSON data={data} style={myStyle} />
      </MapContainer>
    </div>
  );
}
const myStyle = {
  color: "purple",
  weight: 2,
  opacity: 0.5,
};

export default App;
