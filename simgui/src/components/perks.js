export default class Perk {// perks of all weapons need to be updated every shot fired 
    constructor() {
        //this.weapon = weapon;
        //track time and hits?

        // let perkTracking = new Map();
        // perkTracking.set("focusedFuryNum", 0);
        // perkTracking.set("focusedFuryTime", -1);
        // perkTracking.set("frenzyPrepTime", -1);
        // perkTracking.set("frenzy12Time", -1);
        this.perkTracking = new Map();
        this.perkTracking.set("focusedFuryNum", 0);
        this.perkTracking.set("focusedFuryTime", -1);
        this.perkTracking.set("frenzyPrepTime", -1);
        this.perkTracking.set("frenzy12Time", -1);
    }

    test(){
        return this.perkTracking;
    }

    //updates perk timers and returns approriate damage for current state
    perkUpdater(weapon, time, hitType){
        //iterathe through perks[] and call relavent switch cases or similair dispatch
        //weapon.element = "element"//place holder
        let perkMult = 1;


        weapon.perks.forEach(perkSlot => {
            switch(perkSlot){
                case "vorpal":{
                    switch(weapon.ammoType){
                        case "primary":{
                            perkMult *= 1.2;
                            break
                        }
                        case "special":{
                            perkMult *= 1.15;
                            break
                        }
                        case "heavy":{
                            perkMult *= 1.1;
                            break
                        }
                    }
                }
                case "focusedFury":{
                    if(hitType === "c"){
                        this.perkTracking.set("focusedFuryNum", this.perkTracking.get("focusedFuryNum") + 1);
                    }
                    if(this.perkTracking.get("focusedFuryNum") >= weapon.magSize){
                        this.perkTracking.set("focusedFuryTime", time);
                        this.perkTracking.set("focusedFuryNum", 0);
                    }
                    if(this.perkTracking.get("focusedFuryTime") === -1){
                        perkMult *= 1;
                    }
                    if((time - this.perkTracking.get("focusedFuryTime")) < 11000){//11 seconds
                        perkMult *= 1.2;
                    }
                   else{
                        this.perkTracking.set("focusedFuryTime", -1);
                   }
                   break
                }
                case "firingLine":{
                    if(hitType === "c"){
                        perkMult *= 1.2;
                    }
                    break
                }
                case "frenzy":{
                    //track timer and refresh, take away, or grant buff depending
                    if(hitType === "c" || hitType === "h"){
                        if(this.perkTracking.get("frenzy12Time") === -1 && this.perkTracking.get("frenzy5Time") === -1){
                            this.perkTracking.set("frenzy12Time", time);//start 12 second timer
                        }
                        else if(this.perkTracking.get("frenzy12Time") !== -1 && this.perkTracking.get("frenzy5Time") === -1){
                            if(time - this.perkTracking.get("frenzy12Time") >= 12000){//over 12 seconds start buff and 5 second timer
                                this.perkTracking.set("frenzy5Time", time);
                                this.perkTracking.set("frenzy12Time", -1);//deactivate 12 timer
                                perkMult *= 1.15;//return buff
                                //also need to return reload increase
                            }
                        }
                        if(this.perkTracking.get("frenzy12Time") === -1 || this.perkTracking.get("frenzy5Time") !== -1){
                            if((time - this.perkTracking.get("frenzy5Time")) >= 5000){//over 5 seconds activate
                                this.perkTracking.set("frenzy12Time", time);
                            }
                        }

                    }
                    break
                }
                default:{
                    //dont change mult
                }
            }
        });

        return perkMult;
    }
}