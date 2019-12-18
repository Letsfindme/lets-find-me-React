import React, { useState, useEffect, Fragment } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import mapStyles from "./mapStyles";

const Map = props => {
  const [selectedPark, setSelectedPark] = useState(null);
  const [lat, setLat] = useState(null);
  const [lang, setLang] = useState(null);

  useEffect(() => {
    setLang(parseFloat(props.lang));
    setLat(parseFloat(props.lat));
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedPark(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <Fragment>
      {lat != null && (
        <GoogleMap
          defaultZoom={17}
          defaultCenter={{ lat: lat, lng: lang }}
          //   defaultOptions={{ styles: mapStyles }} lat: props.lat, lng: props.lang
        >
          <Marker position={{ lat: lat, lng: lang }} />
          {/* {parkData.features.map(park => (
        <Marker
          key={park.properties.PARK_ID}
          position={{
            lat: park.geometry.coordinates[1],
            lng: park.geometry.coordinates[0]
          }}
          onClick={() => {
            setSelectedPark(park);
          }}
          icon={{
            url: `/skateboarding.svg`,
            scaledSize: new window.google.maps.Size(25, 25)
          }}
        />
      ))} */}

          {selectedPark && (
            <InfoWindow
              onCloseClick={() => {
                setSelectedPark(null);
              }}
              position={{
                lat: selectedPark.geometry.coordinates[1],
                lng: selectedPark.geometry.coordinates[0]
              }}
            >
              <div>
                <h2>{selectedPark.properties.NAME}</h2>
                <p>{selectedPark.properties.DESCRIPTIO}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </Fragment>
  );
};

const MapWrapped = withScriptjs(withGoogleMap(Map));

export default MapWrapped;
