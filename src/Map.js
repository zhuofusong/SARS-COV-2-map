import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import Tooltip from "./components/Tooltip";
import ReactDOM from "react-dom";

// the following accessToken is generated after the style layer is published and shared in Mapbox Studio
mapboxgl.accessToken =
  "pk.eyJ1IjoiamVubmlmZXJzc3MiLCJhIjoiY2p5Z3Nubm14MDQ2ZTNjbnh0cjltY3BzbCJ9.sxWTPorEuNxJB9RSWmG89g";

const Map = () => {
  const mapContainerRef = useRef(null);
  const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }));

  const [lng, setLng] = useState(118.8015);
  const [lat, setLat] = useState(31.9485);
  const [zoom, setZoom] = useState(10.15);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/jennifersss/ckrotr6i50nmh18kichu13o4k", // the style url is generated after the style layer is published and shared in Mapbox Studio
      center: [118.8015, 31.9485],
      zoom: 10.15,
      attributionControl: false,
    });

    // Add attribution control
    map.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
        customAttribution: "SARS-COV-2 map",
      })
    );

    // Add full screen control
    map.addControl(
      new mapboxgl.FullscreenControl({
        container: document.querySelector("body"),
      })
    );

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add geolocate control control
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    // Add scale control
    var scale = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: "imperial",
    });
    map.addControl(scale);
    scale.setUnit("metric");

    // Add geojson data source
    map.on("load", function () {
      map.addSource("covid-nanjing-20210728", {
        type: "geojson",
        // Use a URL for the value for the `data` property.
        data: "https://raw.githubusercontent.com/zhuofusong/SARS-COV-2-map/main/data/2021-July/Nanjing/data.geojson",
      });

      map.addLayer({
        id: "covid-nanjing-20210728-layer",
        type: "circle",
        source: "covid-nanjing-20210728",
        paint: {
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-color": "red",
          "circle-stroke-color": "white",
        },
      });
    });

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    map.on("click", "covid-nanjing-20210728", function (e) {
      // var coordinates = e.features[0].geometry.coordinates.slice();
      // console.log("aaa");
      // console.log(coordinates);
      // // Ensure that if the map is zoomed out such that multiple
      // // copies of the feature are visible, the popup appears
      // // over the copy being pointed to.
      // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      // }
      // var description = e.features[0].properties.featureType;
      const features1 = map.queryRenderedFeatures(e.point);
      if (features1.length) {
        const feature1 = features1[0];
        var description = feature1.properties.featureType;
        // Create tooltip node
        const tooltipNode1 = document.createElement("div");
        ReactDOM.render(<Tooltip feature={feature1} />, tooltipNode1);

        // Set tooltip on map
        tooltipRef.current
          .setLngLat(e.lngLat)
          .setHTML(description)
          .setDOMContent(tooltipNode1)
          .addTo(map);
      }
    });

    // change cursor to pointer when user hovers over a clickable feature
    map.on("mouseenter", (e) => {
      if (e.features.length) {
        map.getCanvas().style.cursor = "pointer";
      }
    });

    // reset cursor to default when user is no longer hovering over a clickable feature
    map.on("mouseleave", () => {
      map.getCanvas().style.cursor = "";
    });

    // add tooltip when users mouse move over a point
    map.on("mousemove", (e) => {
      const features = map.queryRenderedFeatures(e.point);
      if (features.length) {
        const feature = features[0];

        // Create tooltip node
        const tooltipNode = document.createElement("div");
        ReactDOM.render(<Tooltip feature={feature} />, tooltipNode);

        // Set tooltip on map
        tooltipRef.current
          .setLngLat(e.lngLat)
          .setDOMContent(tooltipNode)
          .addTo(map);
      }
    });

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
