import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import type { BurialCoordinates } from "../types";

interface MapProps {
  coordinates: BurialCoordinates;
}

export const MyMap = ({ coordinates }: MapProps) => (
  <YMaps query={{ apikey: "1e5de437-9e1f-4f36-9320-f087e6465c04" }}>
    <Map
      defaultState={{
        center: [coordinates.latitude, coordinates.longitude],
        zoom: 9,
      }}
      width="100%"
      height="500px"
    >
      <Placemark geometry={[coordinates.latitude, coordinates.longitude]} />
    </Map>
  </YMaps>
);
