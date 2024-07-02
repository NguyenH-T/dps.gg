// Debuffs.js

import React, { useState, useEffect } from "react";
import Switch from "./switch"; // Adjust the path accordingly
import "./Debuffs.css"; // Import the CSS file for Debuffs

const Debuffs = ({ rounded, onSwitchToggle, onGetDebuffs }) => {
  const initialDebuffsData = [
    { id: 1, label: "Weaken", value: 15, active: false },
    { id: 2, label: "Divinity", value: 15, active: false },
    { id: 3, label: "Tether", value: 30, active: false },
    { id: 4, label: "Tractor", value: 30, active: false },
    { id: 5, label: "Felwinters", value: 30, active: false },
    // Add more switches as needed
  ];

  const [debuffsData, setDebuffsData] = useState(initialDebuffsData);
  //const [currentLargestValue, setCurrentLargestValue] = useState(0);

  useEffect(() => {
    // Calculate the current largest value when activeBuffs changes
    const largestDebuff = debuffsData.reduce((max, debuff) => (debuff.active && debuff.value > max ? debuff.value : max), 0);
    //setCurrentLargestValue(largestDebuff);
    //setLargestDebuff(largestDebuff);// Send it back to App.js
    onGetDebuffs(largestDebuff);
  }, [debuffsData, onGetDebuffs]);

  const handleSwitchToggle = (debuffId, isToggled) => {
    setDebuffsData((prevDebuffsData) =>
      prevDebuffsData.map((debuff) =>
        debuff.id === debuffId ? { ...debuff, active: !debuff.active } : debuff
      )
    );

    // Call the callback function passed from App.js
    onSwitchToggle(debuffId, isToggled, !isToggled); // Pass the opposite of the current toggle state
  };

  //console.log(debuffsData)

  return (
    <div className="debuffs-container">
      {debuffsData.map((debuff) => (
        <Switch
          key={debuff.id}
          rounded={rounded}
          TestText={debuff.label}
          onToggle={(isToggled) => handleSwitchToggle(debuff.id, isToggled)}
        />
      ))}
    </div>
  );
};

export default Debuffs;

