import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiamVubmlmZXJzc3MiLCJhIjoiY2p5Z3Nubm14MDQ2ZTNjbnh0cjltY3BzbCJ9.sxWTPorEuNxJB9RSWmG89g";

const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(118.8015);
  const [lat, setLat] = useState(31.9485);
  const [zoom, setZoom] = useState(10.15);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/jennifersss/ckrotr6i50nmh18kichu13o4k",
      center: [118.8015, 31.9485],
      zoom: 10.15,
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // map.on("load", function () {
    //   // Add source
    //   map.addSource("covid-nj-20210728", {
    //     type: "vector",
    //     url: "mapbox://jennifersss.ckrosq09a0hmj22npwli3795h-1ros8",
    //   });

    //   // Add covid data layer
    //   map.addLayer({
    //     id: "covid-nj-20210728-layer",
    //     type: "fill",
    //     source: {
    //       type: "vector",
    //       url: "mapbox://jennifersss.ckrosq09a0hmj22npwli3795h-1ros8",
    //     },
    //     "source-layer": "covid-nj-20210728",
    //   });
    // });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="sidebarStyle">
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
