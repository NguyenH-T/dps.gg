import React, { useState, useEffect } from "react";
import Buffs from "./Buffs"; // Adjust the path accordingly
import Debuffs from "./Debuffs";
import OverchargeSurges from "./OverchargeSurge";
import ArmourSurge from "./ArmourSurge";
import Weapon from "./WeaponObject";
import { setBuff, setDebuff, setEnvSurge, setASPercent } from "./calcMult";

import Perk from "./perks";


const DamageMod = ({ rounded, onSwitchToggle, weaponsAR, onDMGBuffUpdate  }) => {
    const [globalBuff, setglobalBuff] = useState(0);
    const [globalDebuff, setglobalDebuff] = useState(0);
    const [enviromentSurge, setEnviromentSurge] = useState([]);

    const [ArmourSurgesPercent, setArmourSurgesPercent] = useState([
      { id: 1, label: "Arc", value: 0 },
      { id: 2, label: "Solar", value: 0 },
      { id: 3, label: "Void", value: 0 },
      { id: 4, label: "Stasis", value: 0 },
      { id: 5, label: "Strand", value: 0 },
      { id: 6, label: "Kinetic", value: 0 },
    ]);

    
    
    const getPercentFromBuffs = (buffsValue) => {
        setglobalBuff(buffsValue);
        setBuff(buffsValue);
    };
    const getPercentFromDebuffs = (debuffsValue) => {
        setglobalDebuff(debuffsValue);
        setDebuff(debuffsValue);
    };
    const getActiveEnviromentSurgeAndCharges = (EnvSurgeArray) => {
        setEnviromentSurge(EnvSurgeArray);
        setEnvSurge(EnvSurgeArray);
        // console.log("Surges array", enviromentSurge)//isn't getting set right away due to state asynchronicity 
        // console.log("Surges array2", EnvSurgeArray)
    };

    const handleArmourSurgeChange = (sliderId, numStacks) => {
      // Handle changes in ArmourSurge sliders
      console.log(`Slider ${sliderId} changed to ${numStacks}`);
      setArmourSurgesPercent((PrevSurges) => {
        const updatedSurges = PrevSurges.map((surge) => 
          surge.id === sliderId+1//adjusting index to modify correct buff, may be better way
          ? {...surge, value: surgeBuffPercent(numStacks)}
          : surge
        );
        // console.log(`Slider ${sliderId} changed to ${numStacks}`);
        // console.log("Updated ArmourSurgesPercent array", updatedSurges);
        setASPercent(updatedSurges);
        return updatedSurges;
      });
    };

    const surgeBuffPercent = (sliderValue) => {
      switch (sliderValue) {
        case 0:
          return 0;
        case 1:
          return 10;
        case 2:
          return 17;
        case 3:
          return 22;
        case 4:
          return 25;
        default:
          return 0;
      }
    };

    
    
    return (
      <div>
        {/* <h2>Damage Modifiers</h2> */}
        <Buffs
          rounded={rounded}
          onSwitchToggle={onSwitchToggle}
          onGetBuffs={getPercentFromBuffs} // Pass the function to Buffs to receive percent
        />
        <Debuffs
          rounded={rounded}
          onSwitchToggle={onSwitchToggle}
          onGetDebuffs={getPercentFromDebuffs} // Pass the function to Buffs to receive percent
        />
        <OverchargeSurges
          rounded={rounded}
          onGetOverchargeSurges={getActiveEnviromentSurgeAndCharges} // Pass the function to OverchargeSurges to receive data
        />
        <ArmourSurge
          rounded={rounded}
          onSliderChange={handleArmourSurgeChange}
        />

        <p style={{ color: 'white' }}> Buff value displayed from DamageMod: {globalBuff}</p>
        <p style={{ color: 'white' }}> Debuff value displayed from DamageMod: {globalDebuff}</p>
        {/* <p>x value in DamageMod: {x}</p> */}
      </div>
    );
  };

export default DamageMod;
