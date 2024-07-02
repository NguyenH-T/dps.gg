import stateObject from './stateObject.js'
export default class TileData {
    constructor(id = -1, color = "#ff2bca", x = 0, y = 0, type = "fire", swapTo) {
        this.id = id
        this.color = color
        this.position = { x: x, y: y }
        this.prev = -1
        this.next = []
        this.userFiringSequence = ""
        this.convertedSequence = ""
        this.type = type //wait, fire, reload or swap
        this.notes = ""

        this.disconnected = true;//if disconnected from origin at some point set to true

        //added by Jacob
        //this.prevState = stateObject
        this.currState = new stateObject();

        if (swapTo > -1) {
            this.weapon = swapTo //currently equipped weapon# 0,1,2, weapon object is in state object
        }
        else {
            //sets to -1 so update know to inherit prev weapon
            this.weapon = -1
        }
        //this.action = ""//wait, fire, reload or swap (0,1,2,3), is now this.type = type
        this.waitTime = 0; //milliseconds to wait
       // this.hits = "" //hhm - hit 2 miss last 1, is now this.convertedSequence = ""
    }
}