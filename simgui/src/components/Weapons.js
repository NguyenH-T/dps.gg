import React, { useState } from "react";
import DamageMod from "./DamageMod";

const Weapons = () => {
  const [weapons, setWeapons] = useState([//hypothetical weapons, will be dynamically set in future
    {
      name: 'Weapon1',
      element: 'DefultElement',
      weaponType: 'DefaultType',
      DMGBuff: 0
    },
    {
      name: 'Weapon2',
      element: 'DefultElement',
      weaponType: 'DefaultType',
      DMGBuff: 0
    },
    {
      name: 'Weapon3',
      element: 'DefultElement',
      weaponType: 'DefaultType',
      DMGBuff: 0
    }
  ]);

  const updateDMGBuff = (weaponIndex, newDMGBuff) => {
    setWeapons((prevWeapons) => {
      const updatedWeapons = [...prevWeapons];
      updatedWeapons[weaponIndex].DMGBuff = newDMGBuff;
      return updatedWeapons;
    });
  };

  return (
    <div>
   
    </div>
  );
};

export default Weapons;
