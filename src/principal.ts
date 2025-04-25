import { Scene } from "phaser";
import Map, { LatLngExpression } from "leaflet";

import "leaflet/dist/leaflet.css";

export class Principal extends Scene {
  map: Map.Map = Map.map("game-container").setView([0, 0], 18);

  constructor() {
    super("Principal");
  }

  create() {
    Map.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    const userMarker = Map.circleMarker([0, 0], {
      radius: 8,
      fillColor: "#3388ff",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    }).addTo(this.map);

    const pathCoords: LatLngExpression[] = [];
    const pathLine = Map.polyline(pathCoords, {
      color: "red",
      weight: 3,
      opacity: 0.7,
    }).addTo(this.map);

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          console.log(lat, lng, accuracy);

          // Update marker position
          userMarker.setLatLng([lat, lng]);

          // Add to path
          pathCoords.push([lat, lng] as LatLngExpression);
          pathLine.setLatLngs(pathCoords);

          // Center map on user with some padding
          this.map.setView([lat, lng], 18, {
            animate: true,
            duration: 1,
          });
        },
        () => {},
        options,
      );
    }
  }
}
