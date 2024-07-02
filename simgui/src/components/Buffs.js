// Buffs.js

import React, { useState, useEffect } from "react";
import Switch from "./switch"; // Adjust the path accordingly
import "./Buffs.css"; // Import the CSS file for Buffs

const Buffs = ({ rounded, onSwitchToggle, onGetBuffs }) => {
  const initialBuffsData = [
    { id: 1, label: "Empowering Rift", value: 20, active: false },
    { id: 2, label: "Radiant", value: 25, active: false },
    { id: 3, label: "Well of Radiance", value: 25, active: false },
    { id: 4, label: "Weapons of Light", value: 25, active: false },
    { id: 5, label: "Blessing of the Sky", value: 35, active: false },
    { id: 6, label: "No Backup Plans", value: 35, active: false },
    { id: 7, label: "Banner Shield", value: 40, active: false },
    // Add more switches as needed
  ];

  const [buffsData, setBuffsData] = useState(initialBuffsData);
  //const [currentLargestValue, setCurrentLargestValue] = useState(0);

  useEffect(() => {
    console.log("buffsData:", buffsData);
    // Calculate the current largest value when activeBuffs changes
    const largestBuff = buffsData.reduce((max, buff) => (buff.active && buff.value > max ? buff.value : max), 0);
    console.log("largestBuff:", largestBuff);

    //setCurrentLargestValue(largestBuff);
    //setLargestBuff(largestBuff);// Send it back to App.js
  
    //(Fixed but didn't change anything)I have no idea why this update incorrectly with 4 buttons when the console log is actually correct
    onGetBuffs(largestBuff);
  }, [buffsData, onGetBuffs]);

  const handleSwitchToggle = (buffId, isToggled) => {
    setBuffsData((prevBuffsData) =>
      prevBuffsData.map((buff) =>
        buff.id === buffId ? { ...buff, active: !buff.active } : buff
      )
    );

    // Call the callback function passed from App.js
    onSwitchToggle(buffId, isToggled, !isToggled); // Pass the opposite of the current toggle state
  };

  //console.log(buffsData)

  return (
    <div className="buffs-container">
      {buffsData.map((buff) => (
        <Switch
          key={buff.id}
          rounded={rounded}
          TestText={buff.label}
          onToggle={(isToggled) => handleSwitchToggle(buff.id, isToggled)}
        />
      ))}
    </div>
  );
};

export default Buffs;
