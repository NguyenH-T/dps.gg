export default class stateObject {
    constructor(totalDMG = 0, time = 0) {
        this.totalDMG = totalDMG//prev DMG + current DMG
        this.time = time //prev Time + action time penalty
        // this.weapon = 0 //currently equipped weapon# 0,1,2, weapon object is in state object
        this.weaponArr = []//weapon array filled but starting tile by loadout 0,1,2 by slot
    }
}