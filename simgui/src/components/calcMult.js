
let globalBuff;
let globalDebuff;
let enviromentSurge;
let ArmourSurgesPercent;


export const setBuff = (newValue) => {
    globalBuff = newValue;
};

export const setDebuff = (newValue) => {
  globalDebuff = newValue;
};

export const setEnvSurge = (newValue) => {
  enviromentSurge = newValue;
};

export const setASPercent = (newValue) => {
  //ArmourSurgesPercent = newValue;
  ArmourSurgesPercent = newValue === null ? undefined : newValue;
};

export function getASPercent()  {
  return ArmourSurgesPercent;
};

export function getBuff()  {
  return globalBuff;
};


export function CalcMult(element, type) {
  let matchingElement = null;
  if(ArmourSurgesPercent !== undefined && element !== undefined && element instanceof String){
    matchingElement = ArmourSurgesPercent.find(
      (surge) => surge.label.toLowerCase() === element.toLowerCase()
    );
  }

  console.log("element, type", element, type)
  //console.log("element, type   types", typeof(element), typeof(type))
  //console.log("conditional",  "sdftype" instanceof String )
  console.log("envsurge", enviromentSurge)
  let Overcharged = null;
  if( element !== undefined && type !== undefined && typeof(element) === "string" &&  typeof(type) === "string"){
    Overcharged = enviromentSurge.find(
      (overcharge) => 
      overcharge.API.toLowerCase() === element.toLowerCase() || 
      overcharge.API.toLowerCase() === type.toLowerCase()
    );
  }

  console.log("overcharged?", Overcharged)

  let damageMultiplier = 1;
  if(globalBuff !== 0){
    damageMultiplier = damageMultiplier * (1 + globalBuff/100);
  }
  if(globalDebuff !== 0){
    damageMultiplier = damageMultiplier * (1 + globalDebuff/100);
  }
  // If matching element is found, calculate the damage multiplier
  if (matchingElement) {
    const elementValue = matchingElement.value;
    if(elementValue !== 0){
      damageMultiplier = damageMultiplier * (1 + elementValue/100);
    }
  }

  if(Overcharged){
    damageMultiplier = damageMultiplier * 1.2;
  }

  if(element === "Kinetic"){
    damageMultiplier = damageMultiplier * 1.15;
    //Kinetic weapons have an innate 15% dmg bonus
  }

  // Return dmgMultiplier, 1 if no buffs active
  // this.dmgMultiplyer =  damageMultiplier;
  return damageMultiplier;
}


export function calculateCritMultiplier(char, canCrit) {//check if wea
  switch(char){
   case "m": {//miss
     return 0;
   }
   case "h": {//hit
     return 1;
   }
   case "c": {//crit hit
     if(canCrit){
       return 1.5;
     }// can set in the future a 2x for special bosses if a switch is selected
     return 1;
   }
   default: {
     return 1;
   }
  }
}

export { globalBuff };