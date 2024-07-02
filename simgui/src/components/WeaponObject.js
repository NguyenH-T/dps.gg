import Perk from "./perks";
export default class Weapon {
  constructor(name, element, type, ammoType, dmgMultiplyer, baseDamage, fireRate, magSize, timePenaltyReload, timePenaltySwap, itemHash) {
    this.name = name;
    this.element = element;
    this.type = type;
    this.ammoType = ammoType;//primary, special, heavy
    // this.dmgMultiplyer = this.calculateDamageMultiplier();//base multiplyer is 1
    this.dmgMultiplyer = 1;//this will need to be changed at some point
    this.baseDamage = baseDamage;
    //this.perk1 = ""
    //this.perk2 = ""
    this.perks = []// array that has all perks on specific weapon instance, since some like spike nades affect damage can be more than 2
    this.perk = new Perk();
    this.canCrit = true;// set to false for rockets/GL

    //new stuff for tiles 
    this.timePenaltyFire = 60000/fireRate
    this.timePenaltySwap = timePenaltySwap
    this.timePenaltyReload= timePenaltyReload

    this.chargeRate = 0; // is 0 for all weapons except linears/fusions/bows
    this.fireRate = fireRate// might just use firing penalty
    this.magSize = magSize
    this.magSizeCurrent = this.magSize
    this.hits = ""//might only need hits in tiles data, but this would track the previous hits of a weapon if it wasn't reloaded
    this.itemHash = itemHash
    //this.random = "beans"

    //this.typeof = this.typeof(this)

  }

  updatePerks(time, hitType){//update weapon based on perks
    return this.perk.perkUpdater(this, time, hitType);//pass weapon object into perk so that it can modify the fields directly
  }

  test(){

  }


}

//export default Weapon;
//class template to make weapon objects\

// export function updatePerks(time, hitType){//update weapon based on perks
//   return this.perk.perkUpdater(this, time, hitType);//pass weapon object into perk so that it can modify the fields directly
// }

  