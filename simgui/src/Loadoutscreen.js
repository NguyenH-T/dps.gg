import React, { useEffect } from 'react'
import styled from "styled-components";
import './Loadoutscreen.css';
import BootsIcon from './constants/BootsIcon.svg'
import ChestIcon from './constants/ChestIcon.svg'
import ClassIcon from './constants/ClassIcon.svg'
import EnergyIcon from './constants/EnergyIcon.svg'
import GlovesIcon from './constants/GlovesIcon.svg'
import HeavyIcon from './constants/HeavyIcon.svg'
import HelmetIcon from './constants/HelmetIcon.svg'
import PrimaryIcon from './constants/PrimaryIcon.svg'
import { useContext, useState } from 'react';
import { AllTilesDispatchContext, AllTilesContext } from './components/data';
import Weapon from './components/WeaponObject';


const Button = styled.button`
  background-color: white;
  color: black;
  font-size: 20px;
  padding: 20px 60px;
  border-radius: 10px;
  margin: 10px 0px;
  cursor: pointer;
`;

function Loadout() {

  let RandomItem = "";
  let ClassItemURL = "";
  let BootItemURL = "";
  let ChestpieceItemURL = "";
  let GauntletsItemURL = "";
  let HelmetItemURL = "";
  let HeavyItemURL = "";
  let EnergyItemURL = "";
  let KineticItemURL = "";

  let KineticAmmoType = 0;
  let EnergyAmmoType = 0;
  let HeavyAmmoType = 0;

  let KineticElement = "";
  let EnergyElement = "";
  let HeavyElement = "";
  let KineticHash = -1;
  let EnergyHash = -1;
  let HeavyHash = -1;

  let ClassItemName = "Class Item: ";
  let BootName = "Boots: ";
  let ChestpieceName = "Chestpiece: ";
  let GauntletsName = "Gauntlets: ";
  let HelmetName = "Helmet: ";
  let HeavyName = "Tertiary: ";
  let EnergyName = "Secondary: ";
  let KineticName = "Primary: ";

  let KineticAttack = 0;
  let KineticRPM = 0;
  let KineticMag = 0;
  let KineticReload = 0;
  let KineticSwapSpeed = 0;

  let EnergyAttack = 0;
  let EnergyRPM = 0;
  let EnergyMag = 0;
  let EnergyReload = 0;
  let EnergySwapSpeed = 0;

  let HeavyAttack = 0;
  let HeavyRPM = 0;
  let HeavyMag = 0;
  let HeavyReload = 0;
  let HeavySwapSpeed = 0;

  let KineticDataName = "";
  let EnergyDataName = "";
  let HeavyDataName = "";

  let KineticStats = [];
  let EnergyStats = [];
  let HeavyStats = [];

  let KineticWeaponType = "";
  let EnergyWeaponType = "";
  let HeavyWeaponType = "";

  let kineticWeapon = new Weapon("Default Primary", 1, 6, 1, 1, 1600, 500, 30, 60, 75,-1)
  let energyWeapon = new Weapon("Default Special", 3, 9, 2, 1, 1600, 50, 6, 40, 45,-1)
  let heavyWeapon = new Weapon("Default Heavy", 7, 3, 3, 1, 1600, 30, 1, 50, 50,-1)
   
  const [classImageSrc, setClassImageSrc] = useState(ClassIcon);
  const [bootImageSrc, setBootImageSrc] = useState(BootsIcon);
  const [chestpieceImageSrc, setChestpieceImageSrc] = useState(ChestIcon);
  const [gauntletsImageSrc, setGauntletsImageSrc] = useState(GlovesIcon);
  const [helmetImageSrc, setHelmetImageSrc] = useState(HelmetIcon);
  const [heavyImageSrc, setHeavyImageSrc] = useState(HeavyIcon);
  const [energyImageSrc, setEnergyImageSrc] = useState(EnergyIcon);
  const [kineticImageSrc, setKineticImageSrc] = useState(PrimaryIcon);
  
  const [classItemText, setClassItemText] = useState(ClassItemName);
  const [bootText, setBootText] = useState(BootName);
  const [chestpieceText, setChestpieceText] = useState(ChestpieceName);
  const [gauntletsText, setGauntletsText] = useState(GauntletsName);
  const [helmetText, setHelmetText] = useState(HelmetName);
  const [heavyText, setHeavyText] = useState(HeavyName);
  const [energyText, setEnergyText] = useState(EnergyName);
  const [kineticText, setKineticText] = useState(KineticName);

  const [KineticWeaponTextInputHidden,setKineticWeaponTextInputHidden] = useState(false)
  const [HelmetTextInputHidden,setHelmetTextInputHidden] = useState(false)
  const [EnergyWeaponTextInputHidden,setEnergyWeaponTextInputHidden] = useState(false)
  const [GauntletsTextInputHidden,setGauntletsTextInputHidden] = useState(false)
  const [ChestpieceTextInputHidden,setChestpieceTextInputHidden] = useState(false)
  const [BootTextInputHidden,setBootTextInputHidden] = useState(false)
  const [ClassItemTextInputHidden,setClassItemTextInputHidden] = useState(false)
  const [HeavyWeaponTextInputHidden,setHeavyWeaponTextInputHidden] = useState(false)

  const [KineticWeaponManual, setKineticWeaponManual] = useState("")
  const [EnergyWeaponManual, setEnergyWeaponManual] = useState("")
  const [HeavyWeaponManual, setHeavyWeaponManual] = useState("")
  const [HelmetManual, setHelmetManual] = useState("")
  const [GauntletsManual, setGauntletsManual] = useState("")
  const [ChestpieceManual, setChestpieceManual] = useState("")
  const [BootsManual, setBootsManual] = useState("")
  const [ClassItemManual, setClassItemManual] = useState("")

  let currLoadout = new Array(3);

  let AllTiles = useContext(AllTilesContext)
  const AllTilesDispatch = useContext(AllTilesDispatchContext);

  useEffect(() => {
    var currentWeaponArray = AllTiles.get(0).currState.weaponArr
    if(currentWeaponArray.length === 0){
    currLoadout[0] = kineticWeapon
    currLoadout[1] = energyWeapon
    currLoadout[2] = heavyWeapon
    AllTilesDispatch({type: "change-origin", givenLoadout: currLoadout})
    }
    else{
      currLoadout[0] = currentWeaponArray[0]
      currLoadout[1] = currentWeaponArray[1]
      currLoadout[2] = currentWeaponArray[2]
    }
  })

/**
 * This function will automatically pull the inventory of their in-game character
 * by grabbing the armor they are wearing and weapons + stats our their items.
 * This will also display that loadout to the page when finished.
 */
  const displayEquipment = async () => 
  {
    HeavyName = "Tertiary: ";
    EnergyName = "Secondary: ";
    KineticName = "Primary: ";
    ClassItemName = "Class Item: ";
    var past = ""
    RandomItem = ""
    var data = ""
    var flag = false
    while(!flag){
    const response = await fetch(`/getItems`,{headers : {
      'MID': sessionStorage.getItem('MID')
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    }
    var temp = RandomItem.replace("[","")
    temp = temp.replace("]","")
    temp = temp.split(",")
    
    // Class Item
    var response = await fetch(`/getItemName`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-9]
    }}).then(function(response) {
      return response.text();
      }).then(function(data){
      RandomItem = data
      if(past === RandomItem)
      flag = true
      past = RandomItem
      if(RandomItem.includes("error") !== true){
      ClassItemName = ClassItemName + RandomItem
      }
    }).catch(function(error)
    {
      ClassItemName = "Class Item: "
    })
    
    // Class Item Image
    response = await fetch(`/getItemImage`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-9]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    
    // Boots
    ClassItemURL = RandomItem.replaceAll("\"","")
    response = await fetch(`/getItemName`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-10]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    if(RandomItem.includes("error") !== true)
    BootName = BootName + RandomItem
    BootName = BootName.replace(/\\/g, '')
    
    // Boots Image
    response = await fetch(`/getItemImage`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-10]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    BootItemURL = RandomItem.replaceAll("\"","")
    
    // Chestpiece
    response = await fetch(`/getItemName`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-11]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    if(RandomItem.includes("error") !== true)
    ChestpieceName = ChestpieceName + RandomItem

    // Chestpiece Image
    response = await fetch(`/getItemImage`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-11]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    ChestpieceItemURL = RandomItem.replaceAll("\"","")

    // Gauntlets
    response = await fetch(`/getItemName`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-12]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    GauntletsName = GauntletsName + RandomItem

    // Gauntlets Image
    response = await fetch(`/getItemImage`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-12]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    GauntletsItemURL = RandomItem.replaceAll("\"","")

    // Helmet
    response = await fetch(`/getItemName`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-13]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    HelmetName = HelmetName + RandomItem
    

    // Helmet Image
    response = await fetch(`/getItemImage`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-13]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    HelmetItemURL = RandomItem.replaceAll("\"","")

    // Heavy
    response = await fetch(`/getItemName`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-14]
    }}).then(function(response) {
      return response.text();
      }).then(function(data){
      RandomItem = data
      if(past === RandomItem)
      flag = true
      past = RandomItem
      if(RandomItem.includes("error") !== true)
    HeavyName = HeavyName + RandomItem
    HeavyDataName = RandomItem.replaceAll("\"","")
    }).catch(function(error)
    {
      HeavyDataName = ""
    })

    //Heavy Hash
    response = await fetch(`/getItemHash`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-14]
    }})
    data = await response.text();
    RandomItem = data
    HeavyHash = RandomItem

    // Heavy Image
    response = await fetch(`/getItemImage`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-14]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    HeavyItemURL = RandomItem.replaceAll("\"","")

    // Energy
    response = await fetch(`/getItemName`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-15]
    }}).then(function(response) {
      return response.text();
      }).then(function(data){
      RandomItem = data
      if(past === RandomItem)
      flag = true
      past = RandomItem
      if(RandomItem.includes("error") !== true)
    EnergyName = EnergyName + RandomItem
    EnergyDataName = RandomItem.replaceAll("\"","")
  }).catch(function(error)
  {
    EnergyDataName = ""
  })

    //Energy Hash
    response = await fetch(`/getItemHash`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-15]
    }})
    data = await response.text();
    RandomItem = data
    EnergyHash = RandomItem

    // Energy Image
    response = await fetch(`/getItemImage`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-15]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    EnergyItemURL = RandomItem.replaceAll("\"","")

    // Kinetic
    response = await fetch(`/getItemName`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-16]
    }}).then(function(response) {
    return response.text();
    }).then(function(data){
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    if(RandomItem.includes("error") !== true)
    KineticName = KineticName + RandomItem
    KineticDataName = RandomItem.replaceAll("\"","")
    }).catch(function(error)
    {
      KineticDataName = ""
    })

    //Kinetic Hash
    response = await fetch(`/getItemHash`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-16]
    }})
    data = await response.text();
    RandomItem = data
    KineticHash = RandomItem

    // Kinetic Image 
    response = await fetch(`/getItemImage`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-16]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    KineticItemURL = RandomItem.replaceAll("\"","")

    // Kinetic Weapon Stats
    response = await fetch(`/getItemStats`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-16]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem

    var KineticStatsHash = data.replace("[","")
    KineticStatsHash = KineticStatsHash.replace("]","")
    KineticStatsHash = KineticStatsHash.split(",")
    KineticStats = Array(KineticStatsHash.length)
    for (var stat in KineticStatsHash)
    {
      response = await fetch(`/getItemStatValue`,{headers : {
        'MID': sessionStorage.getItem('MID'),
        'iid': temp[temp.length-16],
        'stathash': KineticStatsHash[stat]
      }})
      data = await response.text()
      if ((parseInt(KineticStatsHash[stat].replaceAll("\"","")) == 1480404414)) {
        KineticAttack = data
      } else if ((parseInt(KineticStatsHash[stat].replaceAll("\"","")) == 4284893193)) {
        KineticRPM = data
      } else if ((parseInt(KineticStatsHash[stat].replaceAll("\"","")) == 3871231066)) {
        KineticMag = data
      } else if ((parseInt(KineticStatsHash[stat].replaceAll("\"","")) == 4188031367)) {
        KineticReload = data
      } else if ((parseInt(KineticStatsHash[stat].replaceAll("\"","")) == 943549884)) {
        KineticSwapSpeed = data
      }
    }

    // Energy Weapon Stats
    response = await fetch(`/getItemStats`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-15]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    
    var EnergyStatsHash = data.replace("[","")
    EnergyStatsHash = EnergyStatsHash.replace("]","")
    EnergyStatsHash = EnergyStatsHash.split(",")
    EnergyStats = Array(EnergyStatsHash.length)
    for (var stat in EnergyStatsHash)
    {
      response = await fetch(`/getItemStatValue`,{headers : {
        'MID': sessionStorage.getItem('MID'),
        'iid': temp[temp.length-15],
        'stathash': EnergyStatsHash[stat]
      }})
      data = await response.text()
      if ((parseInt(EnergyStatsHash[stat].replaceAll("\"","")) == 1480404414)) {
        EnergyAttack = data
      } else if ((parseInt(EnergyStatsHash[stat].replaceAll("\"","")) == 4284893193)) {
        EnergyRPM = data
      } else if ((parseInt(EnergyStatsHash[stat].replaceAll("\"","")) == 3871231066)) {
        EnergyMag = data
      } else if ((parseInt(EnergyStatsHash[stat].replaceAll("\"","")) == 4188031367)) {
        EnergyReload = data
      } else if ((parseInt(EnergyStatsHash[stat].replaceAll("\"","")) == 943549884)) {
        EnergySwapSpeed = data
      }
    }

    // Heavy Weapon Stats
    response = await fetch(`/getItemStats`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-14]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem

    var HeavyStatsHash = data.replace("[","")
    HeavyStatsHash = HeavyStatsHash.replace("]","")
    HeavyStatsHash = HeavyStatsHash.split(",")
    HeavyStats = Array(HeavyStatsHash.length)
    for (var stat in HeavyStatsHash)
    {
      response = await fetch(`/getItemStatValue`,{headers : {
        'MID': sessionStorage.getItem('MID'),
        'iid': temp[temp.length-14],
        'stathash': HeavyStatsHash[stat]
      }})
      data = await response.text()
      if ((parseInt(HeavyStatsHash[stat].replaceAll("\"","")) == 1480404414)) {
        HeavyAttack = data
      } else if ((parseInt(HeavyStatsHash[stat].replaceAll("\"","")) == 4284893193)) {
        HeavyRPM = data
      } else if ((parseInt(HeavyStatsHash[stat].replaceAll("\"","")) == 3871231066)) {
        HeavyMag = data
      } else if ((parseInt(HeavyStatsHash[stat].replaceAll("\"","")) == 4188031367)) {
        HeavyReload = data
      } else if ((parseInt(HeavyStatsHash[stat].replaceAll("\"","")) == 943549884)) {
        HeavySwapSpeed = data
      }
    }

    // Kinetic Ammo Type
    response = await fetch(`/getItemAmmoType`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-16]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    KineticAmmoType = RandomItem

    // Energy Ammo Type
    response = await fetch(`/getItemAmmoType`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-15]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    EnergyAmmoType = RandomItem

    // Heavy Ammo Type
    response = await fetch(`/getItemAmmoType`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-14]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    HeavyAmmoType = RandomItem

    // Kinetic Element
    response = await fetch(`/getItemDamageType`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-16]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    KineticElement = RandomItem

    // Energy Element
    response = await fetch(`/getItemDamageType`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-15]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    EnergyElement = RandomItem

    // Heavy Element
    response = await fetch(`/getItemDamageType`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-14]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    HeavyElement = RandomItem

    // Kinetic Weapon Type
    response = await fetch(`/getItemSubType`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-16]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    KineticWeaponType = RandomItem

    // Energy Weapon Type
    response = await fetch(`/getItemSubType`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-15]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    EnergyWeaponType = RandomItem

    // Heavy Weapon Type
    response = await fetch(`/getItemSubType`,{headers : {
      'MID': sessionStorage.getItem('MID'),
      'iid': temp[temp.length-14]
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    HeavyWeaponType = RandomItem

    var kineticWeapon = new Weapon(KineticDataName, KineticElement, KineticWeaponType.replaceAll("\"",""), KineticAmmoType, 1, KineticAttack, KineticRPM, KineticMag, KineticReload, KineticSwapSpeed,KineticHash)
    var energyWeapon = new Weapon(EnergyDataName, EnergyElement, EnergyWeaponType.replaceAll("\"",""), EnergyAmmoType, 1, EnergyAttack, EnergyRPM, EnergyMag, EnergyReload, EnergySwapSpeed, EnergyHash)
    var heavyWeapon = new Weapon(HeavyDataName, HeavyElement, HeavyWeaponType.replaceAll("\"",""), HeavyAmmoType, 1, HeavyAttack, HeavyRPM, HeavyMag, HeavyReload, HeavySwapSpeed, HeavyHash)
    currLoadout[0] = kineticWeapon;
    currLoadout[1] = energyWeapon;
    currLoadout[2] = heavyWeapon;
    AllTilesDispatch({type: "change-origin", givenLoadout: currLoadout})
    changeClassImageSrc(); 
    changeBootImageSrc(); 
    changeChestpieceImageSrc();
    changeGauntletsImageSrc(); 
    changeHelmetImageSrc(); 
    changeHeavyImageSrc(); 
    changeHeavyImageSrc(); 
    changeEnergyImageSrc(); 
    changeKineticImageSrc();
    changeClassItemText(); 
    changeBootText(); 
    changeChestpieceText(); 
    changeGauntletsText(); 
    changeHelmetText(); 
    changeHeavyText(); 
    changeEnergyText(); 
    changeKineticText();
  }

  /**
   * This function changes the image for the class item.
   */
  const changeClassImageSrc = () => {
    setClassImageSrc(ClassItemURL);
  }

  /**
   * This function changes the image for the boots item.
   */
  const changeBootImageSrc = () => {
    setBootImageSrc(BootItemURL);
  }

  /**
   * This function changes the image for the chestpiece item.
   */
  const changeChestpieceImageSrc = () => {
    setChestpieceImageSrc(ChestpieceItemURL);
  }

  /**
   * This function changes the image for the gauntlets item.
   */
  const changeGauntletsImageSrc = () => {
    setGauntletsImageSrc(GauntletsItemURL);
  }

  /**
   * This function changes the image for the Helmet item.
   */
  const changeHelmetImageSrc = () => {
    setHelmetImageSrc(HelmetItemURL);
  }

  /**
   * This function changes the image for the Heavy item.
   */
  const changeHeavyImageSrc = () => {
    setHeavyImageSrc(HeavyItemURL);
  }

  /**
   * This function changes the image for the Energy item.
   */
  const changeEnergyImageSrc = () => {
    setEnergyImageSrc(EnergyItemURL);
  }

  /**
   * This function changes the image for the Kinetic item.
   */
  const changeKineticImageSrc = () => {
    setKineticImageSrc(KineticItemURL);
  }


  /**
   * This function changes the name for the class item.
   */
  const changeClassItemText = () => {
    setClassItemText(ClassItemName);
  }

  /**
   * This function changes the name for the boot item.
   */
  const changeBootText = () => {
    setBootText(BootName);
  }

  /**
   * This function changes the name for the chest item.
   */
  const changeChestpieceText = () => {
    setChestpieceText(ChestpieceName);
  }

  /**
   * This function changes the name for the gauntlet item.
   */
  const changeGauntletsText = () => {
    setGauntletsText(GauntletsName);
  }
  
  /**
   * This function changes the name for the helmet item.
   */
  const changeHelmetText = () => {
    setHelmetText(HelmetName);
  }

  /**
   * This function changes the name for the heavy item.
   */
  const changeHeavyText = () => {
    setHeavyText(HeavyName);
  }

  /**
   * This function changes the name for the energy item.
   */
  const changeEnergyText = () => {
    setEnergyText(EnergyName);
  }

  /**
   * This function changes the name for the kinetic item.
   */
  const changeKineticText = () => {
    setKineticText(KineticName);
  }

  /**
   * This function determines whether to hide or show the text box below the kinetic item
   */
  const changeKineticTextInputHidden = () => {
    setKineticWeaponTextInputHidden(!KineticWeaponTextInputHidden);
  }

  /**
   * This function determines whether to hide or show the text box below the hemlet item
   */
  const changeHelmetTextInputHidden = () => {
    setHelmetTextInputHidden(!HelmetTextInputHidden);
  }

  /**
   * This function determines whether to hide or show the text box below the energy item
   */
  const changeEnergyTextInputHidden = () => {
    setEnergyWeaponTextInputHidden(!EnergyWeaponTextInputHidden);
  }

  /**
   * This function determines whether to hide or show the text box below the heavy item
   */
  const changeHeavyTextInputHidden = () => {
    setHeavyWeaponTextInputHidden(!HeavyWeaponTextInputHidden);
  }

  /**
   * This function determines whether to hide or show the text box below the gauntlets item
   */
  const changeGauntletTextInputHidden = () => {
    setGauntletsTextInputHidden(!GauntletsTextInputHidden);
  }

  /**
   * This function determines whether to hide or show the text box below the chestpiece item
   */
  const changeChestPieceTextInputHidden = () => {
    setChestpieceTextInputHidden(!ChestpieceTextInputHidden);
  }  

  /**
   * This function determines whether to hide or show the text box below the class item
   */
  const changeClassItemTextInputHidden = () => {
    setClassItemTextInputHidden(!ClassItemTextInputHidden);
  }

  /**
   * This function determines whether to hide or show the text box below the boot item
   */
  const changeBootTextInputHidden = () => {
    setBootTextInputHidden(!BootTextInputHidden);
  }

  /**
   * This button allows users to manually push loadouts created on our page to the simulator
   * allowing users to create theoretical loadouts and use the simulator even if they do not
   * own Destiny 2 or have a Bungie login
   */
  const pushCurrentWeapons = () => {
    AllTilesDispatch({type: "change-origin", givenLoadout: currLoadout})
  }

  /**
   * This function handles the searching and grabbing of kinetic weapons when inputted
   * manually into the simulator page.
   */
  const handleManualKinetic = async () => {
   var past = ""
   var flag = false
   var response = await fetch(`/searchItem`,{headers : {
      'term': KineticWeaponManual
    }})
    var data = await response.text();
    var dataJSON = JSON.parse(data)
    KineticItemURL = ("https://www.bungie.net" + dataJSON.results[0].displayProperties.icon)
    KineticName = ("Primary: \"" + dataJSON.results[0].displayProperties.name + "\"")
    var KineticDataName = dataJSON.results[0].displayProperties.name
    changeKineticImageSrc();
    changeKineticText();

     response = await fetch(`/getItemInfo`,{headers : {
      'iid': dataJSON.results[0].hash
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem

    response = await fetch(`/getItemStats`,{headers : {
      'iid': dataJSON.results[0].hash
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    KineticHash = dataJSON.results[0].hash
    var KineticStatsHash = data.replace("[","")
    KineticStatsHash = KineticStatsHash.replace("]","")
    KineticStatsHash = KineticStatsHash.split(",")
    KineticStats = Array(KineticStatsHash.length)

    for (var stat in KineticStatsHash)
    {
      response = await fetch(`/getItemStatName`,{headers : {
        'iid': dataJSON.results[0].hash,
        'stathash': KineticStatsHash[stat]
      }})
      data = await response.text()
    }

    for (var stat in KineticStatsHash)
    {
      response = await fetch(`/getItemStatValue`,{headers : {
        'iid': dataJSON.results[0].hash,
        'stathash': KineticStatsHash[stat]
      }})
      data = await response.text()
      if ((parseInt(KineticStatsHash[stat].replaceAll("\"","")) == 1480404414)) {
        KineticAttack = data
      } else if ((parseInt(KineticStatsHash[stat].replaceAll("\"","")) == 4284893193)) {
        KineticRPM = data
      } else if ((parseInt(KineticStatsHash[stat].replaceAll("\"","")) == 3871231066)) {
        KineticMag = data
      } else if ((parseInt(KineticStatsHash[stat].replaceAll("\"","")) == 4188031367)) {
        KineticReload = data
      } else if ((parseInt(KineticStatsHash[stat].replaceAll("\"","")) == 943549884)) {
        KineticSwapSpeed = data
      }
    }

    response = await fetch(`/getItemSubType`,{headers : {
      'iid': dataJSON.results[0].hash
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    var KineticWeaponType = RandomItem

    response = await fetch(`/getItemDamageType`,{headers : {
      'iid': dataJSON.results[0].hash
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    var KineticElement = RandomItem

    response = await fetch(`/getItemAmmoType`,{headers : {
      'iid': dataJSON.results[0].hash
    }})
    data = await response.text();
    RandomItem = data

    if(past === RandomItem)
    flag = true
    past = RandomItem
    var KineticAmmoType = RandomItem


    var kineticWeapon = new Weapon(KineticDataName, KineticElement, KineticWeaponType.replaceAll("\"",""), KineticAmmoType, 1, KineticAttack, KineticRPM, KineticMag, KineticReload, KineticSwapSpeed,KineticHash)
    currLoadout[0] = (kineticWeapon);
    AllTilesDispatch({type: "change-origin", givenLoadout: currLoadout})
   }

   /**
   * This function handles the searching and grabbing of energy weapons when inputted
   * manually into the simulator page.
   */
  const handleManualEnergy = async () => {
    var past = ""
    var flag = false
    var response = await fetch(`/searchItem`,{headers : {
       'term': EnergyWeaponManual
     }})
     var data = await response.text();
     var dataJSON = JSON.parse(data)
     EnergyItemURL = ("https://www.bungie.net" + dataJSON.results[0].displayProperties.icon)
     EnergyName = ("Secondary: \"" + dataJSON.results[0].displayProperties.name + "\"")
     var EnergyDataName = dataJSON.results[0].displayProperties.name
     changeEnergyImageSrc();
     changeEnergyText();

     response = await fetch(`/getItemInfo`,{headers : {
      'iid': dataJSON.results[0].hash
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    EnergyHash = dataJSON.results[0].hash
    response = await fetch(`/getItemStats`,{headers : {
      'iid': dataJSON.results[0].hash
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem

    var EnergyStatsHash = data.replace("[","")
    EnergyStatsHash = EnergyStatsHash.replace("]","")
    EnergyStatsHash = EnergyStatsHash.split(",")
    EnergyStats = Array(EnergyStatsHash.length)
    
    for (var stat in EnergyStatsHash)
    {
      response = await fetch(`/getItemStatValue`,{headers : {
        'iid': dataJSON.results[0].hash,
        'stathash': EnergyStatsHash[stat]
      }})
      data = await response.text()
      if ((parseInt(EnergyStatsHash[stat].replaceAll("\"","")) == 1480404414)) {
        EnergyAttack = data
      } else if ((parseInt(EnergyStatsHash[stat].replaceAll("\"","")) == 4284893193)) {
        EnergyRPM = data
      } else if ((parseInt(EnergyStatsHash[stat].replaceAll("\"","")) == 3871231066)) {
        EnergyMag = data
      } else if ((parseInt(EnergyStatsHash[stat].replaceAll("\"","")) == 4188031367)) {
        EnergyReload = data
      } else if ((parseInt(EnergyStatsHash[stat].replaceAll("\"","")) == 943549884)) {
        EnergySwapSpeed = data
      }
    }

    response = await fetch(`/getItemSubType`,{headers : {
      'iid': dataJSON.results[0].hash
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    var EnergyWeaponType = RandomItem

    response = await fetch(`/getItemDamageType`,{headers : {
      'iid': dataJSON.results[0].hash
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    var EnergyElement = RandomItem

    response = await fetch(`/getItemAmmoType`,{headers : {
      'iid': dataJSON.results[0].hash
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    var EnergyAmmoType = RandomItem


    var energyWeapon = new Weapon(EnergyDataName, EnergyElement, EnergyWeaponType.replaceAll("\"",""), EnergyAmmoType, 1, EnergyAttack, EnergyRPM, EnergyMag, EnergyReload, EnergySwapSpeed, EnergyHash)
    currLoadout[1] = (energyWeapon);
    AllTilesDispatch({type: "change-origin", givenLoadout: currLoadout})
   }

  /**
   * This function handles the searching and grabbing of heavy weapons when inputted
   * manually into the simulator page.
   */
   const handleManualHeavy = async () => {
    var past = ""
    var flag = false
    var response = await fetch(`/searchItem`,{headers : {
       'term': HeavyWeaponManual
     }})
     var data = await response.text();
     var dataJSON = JSON.parse(data)
     HeavyItemURL = ("https://www.bungie.net" + dataJSON.results[0].displayProperties.icon)
     HeavyName = ("Tertiary: \"" + dataJSON.results[0].displayProperties.name + "\"")
     var HeavyDataName = dataJSON.results[0].displayProperties.name
     changeHeavyImageSrc();
     changeHeavyText();

     HeavyHash = dataJSON.results[0].hash
     response = await fetch(`/getItemInfo`,{headers : {
      'iid': dataJSON.results[0].hash
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem

    response = await fetch(`/getItemStats`,{headers : {
      'iid': dataJSON.results[0].hash
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem

    var HeavyStatsHash = data.replace("[","")
    HeavyStatsHash = HeavyStatsHash.replace("]","")
    HeavyStatsHash = HeavyStatsHash.split(",")
    HeavyStats = Array(HeavyStatsHash.length)
    
    for (var stat in HeavyStatsHash)
    {
      response = await fetch(`/getItemStatValue`,{headers : {
        'iid': dataJSON.results[0].hash,
        'stathash': HeavyStatsHash[stat]
      }})
      data = await response.text()
      if ((parseInt(HeavyStatsHash[stat].replaceAll("\"","")) == 1480404414)) {
        HeavyAttack = data
      } else if ((parseInt(HeavyStatsHash[stat].replaceAll("\"","")) == 4284893193)) {
        HeavyRPM = data
      } else if ((parseInt(HeavyStatsHash[stat].replaceAll("\"","")) == 3871231066)) {
        HeavyMag = data
      } else if ((parseInt(HeavyStatsHash[stat].replaceAll("\"","")) == 4188031367)) {
        HeavyReload = data
      } else if ((parseInt(HeavyStatsHash[stat].replaceAll("\"","")) == 943549884)) {
        HeavySwapSpeed = data
      }
    }

    response = await fetch(`/getItemSubType`,{headers : {
      'iid': dataJSON.results[0].hash
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    var HeavyWeaponType = RandomItem

    response = await fetch(`/getItemDamageType`,{headers : {
      'iid': dataJSON.results[0].hash
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    var HeavyElement = RandomItem

    response = await fetch(`/getItemAmmoType`,{headers : {
      'iid': dataJSON.results[0].hash
    }})
    data = await response.text();
    RandomItem = data
    if(past === RandomItem)
    flag = true
    past = RandomItem
    var HeavyAmmoType = RandomItem


    var heavyWeapon = new Weapon(HeavyDataName, HeavyElement, HeavyWeaponType.replaceAll("\"",""), HeavyAmmoType, 1, HeavyAttack, HeavyRPM, HeavyMag, HeavyReload, HeavySwapSpeed, HeavyHash)
    currLoadout[2] = (heavyWeapon);
    AllTilesDispatch({type: "change-origin", givenLoadout: currLoadout})
   }

   /**
   * This function handles the searching and grabbing of helmets when inputted
   * manually into the simulator page.
   */
   const handleManualHelmet = async () => {
    var response = await fetch(`/searchItem`,{headers : {
       'term': HelmetManual
     }})
     var data = await response.text();
     var dataJSON = JSON.parse(data)
     HelmetItemURL = ("https://www.bungie.net" + dataJSON.results[0].displayProperties.icon)
     HelmetName = ("Helmet: " + dataJSON.results[0].displayProperties.name)
     changeHelmetImageSrc();
     changeHelmetText();
   }

   /**
   * This function handles the searching and grabbing of gauntlets when inputted
   * manually into the simulator page.
   */
   const handleManualGauntlets = async () => {
    var response = await fetch(`/searchItem`,{headers : {
       'term': GauntletsManual
     }})
     var data = await response.text();
     var dataJSON = JSON.parse(data)
     GauntletsItemURL = ("https://www.bungie.net" + dataJSON.results[0].displayProperties.icon)
     GauntletsName = ("Gauntlets: " + dataJSON.results[0].displayProperties.name)
     changeGauntletsImageSrc();
     changeGauntletsText();
   }

   /**
   * This function handles the searching and grabbing of chestpieces when inputted
   * manually into the simulator page.
   */
   const handleManualChestpiece = async () => {
    var response = await fetch(`/searchItem`,{headers : {
       'term': ChestpieceManual
     }})
     var data = await response.text();
     var dataJSON = JSON.parse(data)
     ChestpieceItemURL = ("https://www.bungie.net" + dataJSON.results[0].displayProperties.icon)
     ChestpieceName = ("Chestpiece: " + dataJSON.results[0].displayProperties.name)
     changeChestpieceImageSrc();
     changeChestpieceText();
   }

   /**
   * This function handles the searching and grabbing of boots when inputted
   * manually into the simulator page.
   */
   const handleManualBoots = async () => {
    var response = await fetch(`/searchItem`,{headers : {
       'term': BootsManual
     }})
     var data = await response.text();
     var dataJSON = JSON.parse(data)
     BootItemURL = ("https://www.bungie.net" + dataJSON.results[0].displayProperties.icon)
     BootName = ("Boots: " + dataJSON.results[0].displayProperties.name)
     changeBootImageSrc();
     changeBootText();
   }

   /**
   * This function handles the searching and grabbing of class items when inputted
   * manually into the simulator page.
   */
   const handleManualClassItem = async () => {
    var response = await fetch(`/searchItem`,{headers : {
       'term': ClassItemManual
     }})
     var data = await response.text();
     var dataJSON = JSON.parse(data)
     ClassItemURL = ("https://www.bungie.net" + dataJSON.results[0].displayProperties.icon)
     ClassItemName = ("Class Item: " + dataJSON.results[0].displayProperties.name)
     changeClassImageSrc();
     changeClassItemText();
   }

  return (
    <div className="App">
      <div class="weapon-and-class-component">
      <h3 style={{color: 'white'}}>
        Primary Weapon
      </h3>
      <img class="image-border" src={kineticImageSrc} alt="Test" onClick={() => changeKineticTextInputHidden()} height={100} width={100} style={{"pointer-events": "all"}}></img>
      <p style={{color: 'white'}}>{kineticText}</p>
      <div class="div-spacing">
      <input class="search-padding" name="primaryWeaponSearch" type="text" id="KineticWeaponManual" style={{visibility: KineticWeaponTextInputHidden ? "visible" : "hidden" }}
       placeholder="Enter Primary Weapon Name" onChange={(event) => {setKineticWeaponManual(event.target.value)}}></input>
      <button type="submit" style={{visibility: KineticWeaponTextInputHidden ? "visible" : "hidden" }} onClick={handleManualKinetic}>Submit</button>
      </div>
      </div>
      
      
      <div class="armor-component">
      <h3 style={{color: 'white'}}>
        Helmet
      </h3>
      <img class="image-border" src={helmetImageSrc} alt="Test" height={100} width={100}  onClick={() => changeHelmetTextInputHidden()} style={{"pointer-events": "all"}} ></img>
      <p  style={{color: 'white'}}>{helmetText}</p>
      <input class="search-padding" name="helmetSearch" type="text" id="HelmetManual" style={{visibility: HelmetTextInputHidden ? "visible" : "hidden" }}
       placeholder="Enter Helmet Name" onChange={(event) => {setHelmetManual(event.target.value)}}></input>
       <button type="submit" style={{visibility: HelmetTextInputHidden ? "visible" : "hidden" }} onClick={handleManualHelmet}>Submit</button>
      </div>
      
      
      <div class="weapon-and-class-component">
      <h3 style={{color: 'white'}}>
        Secondary Weapon
      </h3>
      <img class="image-border" src={energyImageSrc} alt="Test" height={100} width={100}  onClick={() => changeEnergyTextInputHidden()} style={{"pointer-events": "all"}} ></img>
      <p  style={{color: 'white'}}>{energyText}</p>
      <input class="search-padding" name="energyWeaponSearch" type="text" id="EnergyWeaponManual" style={{visibility: EnergyWeaponTextInputHidden ? "visible" : "hidden" }} 
       placeholder="Enter Energy Weapon Name" onChange={(event) => {setEnergyWeaponManual(event.target.value)}}></input>
      <button type="submit" style={{visibility: EnergyWeaponTextInputHidden ? "visible" : "hidden" }} onClick={handleManualEnergy}>Submit</button>
      </div>
      
      
      <div class="weapon-and-class-component">
      <h3 style={{color: 'white'}}>
        Gauntlets
      </h3>
      <img class="image-border" src={gauntletsImageSrc} alt="Test" height={100} width={100}  onClick={() => changeGauntletTextInputHidden()} style={{"pointer-events": "all"}}></img>
      <p  style={{color: 'white'}}>{gauntletsText}</p>
      <input class="search-padding" name="gauntletsSearch" type="text" id="GauntletsManual" style={{visibility: GauntletsTextInputHidden ? "visible" : "hidden" }}
       placeholder="Enter Gauntlets Name" onChange={(event) => {setGauntletsManual(event.target.value)}}></input>
       <button type="submit" style={{visibility: GauntletsTextInputHidden ? "visible" : "hidden" }} onClick={handleManualGauntlets}>Submit</button>
      </div>
      
      
      <div class="weapon-and-class-component">
      <h3 style={{color: 'white'}}>
       Tertiary Weapon
      </h3>
      <img class="image-border" src={heavyImageSrc} alt="Test" height={100} width={100}  onClick={() => changeHeavyTextInputHidden()} style={{"pointer-events": "all"}}></img>
      <p  style={{color: 'white'}}>{heavyText}</p>
      <input class="search-padding" name="heavyWeaponSearch" type="text" id="HeavyWeaponManual" style={{visibility: HeavyWeaponTextInputHidden ? "visible" : "hidden" }} 
      placeholder="Enter Heavy Weapon Name" onChange={(event) => {setHeavyWeaponManual(event.target.value)}}></input>
      <button type="submit" style={{visibility: HeavyWeaponTextInputHidden ? "visible" : "hidden" }} onClick={handleManualHeavy}>Submit</button>
      </div>
      
      
      <div class="armor-component">
      <h3 style={{color: 'white'}}>
        Chestpiece
      </h3>
      <img class="image-border" src={chestpieceImageSrc} alt="Test" height={100} width={100}  onClick={() => changeChestPieceTextInputHidden()} style={{"pointer-events": "all"}}></img>
      <p  style={{color: 'white'}}>{chestpieceText}</p>
      <input class="search-padding" name="chestpieceSearch" type="text" id="ChestpieceManual" style={{visibility: ChestpieceTextInputHidden ? "visible" : "hidden" }}
       placeholder="Enter Chestpiece Name" onChange={(event) => {setChestpieceManual(event.target.value)}}></input>
       <button type="submit" style={{visibility: ChestpieceTextInputHidden ? "visible" : "hidden" }} onClick={handleManualChestpiece}>Submit</button>
      </div>
      
      
      <div class="weapon-and-class-component">
      <h3 style={{color: 'white'}}>
        Class Item
      </h3>
      <img class="image-border" src={classImageSrc} alt="Test" height={100} width={100} onClick={() => changeClassItemTextInputHidden()} style={{"pointer-events": "all"}}></img>
      <p  style={{color: 'white'}}>{classItemText}</p>
      <div>
      <input class="search-padding" name="classItemSearch" type="text" id="ClassItemManual" style={{visibility: ClassItemTextInputHidden ? "visible" : "hidden" }}
       placeholder="Enter Class Item Name" onChange={(event) => {setClassItemManual(event.target.value)}}></input>
       <button type="submit" style={{visibility: ClassItemTextInputHidden ? "visible" : "hidden" }} onClick={handleManualClassItem}>Submit</button>
      </div>
      </div>
      
      
      <div class="armor-component">
      <h3 style={{color: 'white'}}>
        Boots
      </h3>
      <img class="image-border" src={bootImageSrc} alt="Test" height={100} width={100} onClick={() => changeBootTextInputHidden()} style={{"pointer-events": "all"}}></img>
      <p  style={{color: 'white'}}>{bootText}</p>
      <div>
      <input class="search-padding" name="bootsSearch" type="text" id="BootsManual" style={{visibility: BootTextInputHidden ? "visible" : "hidden" }}
       placeholder="Enter Boots Name" onChange={(event) => {setBootsManual(event.target.value)}}></input>
       <button type="submit" style={{visibility: BootTextInputHidden ? "visible" : "hidden" }} onClick={handleManualBoots}>Submit</button>
      </div>
      </div>
      
      
      <Button onClick={displayEquipment} class="weapon-and-class-component">
      Pull and Display In-Game Loadout
      <div>(Must be signed in to Bungie)</div>
      </Button>
      
      
      <Button onClick={pushCurrentWeapons} class="armor-component">
        Push Current Loadout to the Simulator
        <div>(Weapons Only)</div>
      </Button>
    </div>
  );
}

export default Loadout;
