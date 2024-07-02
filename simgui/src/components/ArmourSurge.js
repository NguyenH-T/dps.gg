import React, { useState } from "react";
import Slider from "react-slider";
import "./ArmourSurge.css";

const ArmourSurge = ({ onSliderChange }) => {
  const SurgesArray = [
    { id: 1, label: "Arc", value: 0 },
    { id: 2, label: "Solar", value: 0 },
    { id: 3, label: "Void", value: 0 },
    { id: 4, label: "Stasis", value: 0 },
    { id: 5, label: "Strand", value: 0 },
    { id: 6, label: "Kinetic", value: 0 },
  ];

  const [surgeValues, setSurgeValues] = useState(SurgesArray.map((surge) => surge.value));

  const handleSliderChange = (index, value) => {
    const newSurgeValues = [...surgeValues];
    newSurgeValues[index] = value;
    setSurgeValues(newSurgeValues);
    onSliderChange(index, value);
  };

  return (
    <div className="Armoursurgetest">
      {SurgesArray.map((Surge, index) => (
        <div key={index} className="AS-slider-container">
          <label className="AS-label">{Surge.label}</label>
          <Slider
            className="AS-slider"
            value={surgeValues[index]}
            min={0}
            max={4}
            step={1}
            onChange={(value) => handleSliderChange(index, value)}
          />
        </div>
      ))}
    </div>
  );
};

export default ArmourSurge;

