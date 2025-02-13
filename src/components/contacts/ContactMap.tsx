"use client";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useMemo } from "react";

interface ContactMapProps {
  latitude: number;
  longitude: number;
}

export function ContactMap({ latitude, longitude }: ContactMapProps) {
  console.log("Renderizando mapa com coordenadas:", { latitude, longitude });

  // Use coordenadas padrão se as fornecidas forem inválidas
  const validLatitude = latitude || -25.4284;
  const validLongitude = longitude || -49.2733;

  const center = useMemo(
    () => ({ lat: validLatitude, lng: validLongitude }),
    [validLatitude, validLongitude]
  );

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  return (
    <div className="w-full h-[400px] ">
      <GoogleMap
        mapContainerClassName="w-full h-full rounded-lg "
        center={center}
        zoom={15}
        options={mapOptions}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
}
