// OverchargeSurges.js

import React, { useState, useEffect } from "react";
import Switch from "./switch"; 
import "./OverchargeSurge.css"

const OverchargeSurges = ({ rounded, /*onSwitchToggle,*/ onGetOverchargeSurges }) => {
  const initialOverchargeSurgesData = [
    { id: 1, label: "Arc", value: 20, active: false, API: "Arc"},
    { id: 2, label: "Solar", value: 20, active: false, API: "Thermal"},
    { id: 3, label: "Void", value: 20, active: false, API: "Void"},
    { id: 4, label: "Stasis", value: 20, active: false, API: "Statis"},
    { id: 5, label: "Strand", value: 20, active: false, API: "Strand"},
    { id: 6, label: "Kinetic", value: 20, active: false, API: "Kinetic"},
    { id: 7, label: "Auto Rifle", value: 20, active: false, API: "AutoRifle"},
    { id: 8, label: "Scout Rifle", value: 20, active: false, API: "ScoutRifle"},
    { id: 9, label: "Pulse Rifle", value: 20, active: false, API: "PulseRifle"},
    { id: 10, label: "Hand Cannon", value: 20, active: false, API: "HandCannon"},
    { id: 11, label: "Submachine Gun", value: 20, active: false, API: "SubmachineGun"},
    { id: 12, label: "Sidearm", value: 20, active: false, API: "Sidearm"},
    { id: 13, label: "Bow", value: 20, active: false, API: "Bow"},
    { id: 14, label: "Shotgun", value: 20, active: false, API: "Shotgun"},
    { id: 15, label: "Grenade Launcher", value: 20, active: false, API: "GernadeLauncher"},
    { id: 16, label: "Fusion Rifle", value: 20, active: false, API: "FusionRifle"},
    { id: 17, label: "Sniper Rifle", value: 20, active: false, API: "SniperRifle"},
    { id: 18, label: "Trace Rifle", value: 20, active: false, API: "TraceRifle"},
    { id: 19, label: "Glaive", value: 20, active: false, API: "Glaive"},
    { id: 20, label: "Sword", value: 20, active: false, API: "Sword"},
    { id: 21, label: "Rocket Launcher", value: 20, active: false, API: "RocketLauncher"},
    { id: 22, label: "Linear Fusion", value: 20, active: false, API: "FusionRifleLine"},
    { id: 23, label: "Machine Gun", value: 20, active: false, API: "Machinegun"},
    // Add more switches as needed
  ];

  const [overchargeSurgesData, setOverchargeSurgesData] = useState(initialOverchargeSurgesData);

  const handleSwitchToggle = (surgeId/*, isToggled*/) => {
    setOverchargeSurgesData((prevSurgesData) =>
      prevSurgesData.map((surge) =>
        surge.id === surgeId ? { ...surge, active: !surge.active } : surge
      )
    );
  
    // Call the callback function passed from DamageMod.js
    //onSwitchToggle(surgeId, isToggled, !isToggled); // Pass the opposite of the current toggle state
    
  };
  
  useEffect(() => {
    // This will run after the component re-renders with the updated state
    const activeSurges = overchargeSurgesData.filter((surge) => surge.active);
    
    console.log("Surges array from OS", activeSurges);
    onGetOverchargeSurges(activeSurges);//sends back to damage mod but is delayed, need fix
    }, [overchargeSurgesData]
  ); // Run this effect whenever overchargeSurgesData changes
  

  return (
    <div className="overchargeSurge-container">
      {overchargeSurgesData.map((surge) => (
        <Switch
          key={surge.id}
          rounded={rounded}
          TestText={surge.label}
          onToggle={(isToggled) => handleSwitchToggle(surge.id, isToggled)}
        />
      ))}
    </div>
  );
};

export default OverchargeSurges;
