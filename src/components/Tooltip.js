import React from "react";

const Tooltip = ({ feature }) => {
  const { id } = feature.properties;
  
  return (
    <div id={`tooltip-${id}`}>
      <strong>Source Layer:</strong> {feature.layer["source-layer"]}
      <br />
      <strong>Layer ID:</strong> {feature.layer.id}
      <br />
      <strong>Marker type? :</strong> {feature.properties.featureType}
    </div>
  );
};

export default Tooltip;
