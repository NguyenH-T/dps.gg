import TileData from './tilesData.js'
//import dmage mod or weapon or something
import DamageMod from './DamageMod.js'
import { useReducer, createContext } from "react"
import stateObject from './stateObject.js'
import { getBuff, CalcMult, calculateCritMultiplier } from './calcMult.js'
import Perk from './perks.js'
import Weapon from './WeaponObject.js'

//Class that stores TilesData, Counter, prev / next stacks
class AllTilesData {
    constructor() {
        this.count = 1
        this.data = new Map()
    }
} 

const initialTiles = new AllTilesData()
const origin = new TileData(0, "#969696", 1100, 850, 'origin', 0)
origin.disconnected = false
initialTiles.data.set(0, origin)

const undoLimit = 50

export const AllTilesContext = createContext(initialTiles)
export const AllTilesDispatchContext = createContext(null)

/*
    Helper method that copies all the tiles from a given AllTilesData class to a new class
    that will later be rerendered in raect

    toCopy: the AllTilesData class to copy from
*/
function CopyAllTilesData(toCopy) {
    let newCopy = new AllTilesData()
    
    newCopy.count = toCopy.count
    newCopy.data = new Map(toCopy.data)

    return newCopy
}

/*
    Brute force search of every previous connected tile checking for cycles

    current: tile currently being accessed
    memory: the hashset of tiles that have currently been found
    TileData: the hashmap of all Tiles
*/
function HasCycle(current, memory, TilesData) {
    if (memory.has(current.id)) {
        return true
    }
    else {
        memory.set(current.id)
        let cycle = false
        if (current.prev !== -1) {
            cycle = HasCycle(TilesData.get(current.prev), memory, TilesData)
        }
        return cycle
    }
}

function AllTilesReducer(AllTiles, action) {
    let newTilesData = CopyAllTilesData(AllTiles)
    switch (action.type) {
        case "add": { //inputs: id, color, x, y, tiletype, swap
            newTilesData.data.set(newTilesData.count, new TileData(newTilesData.count++, action.color, action.x, action.y, action.tiletype, action.swap));
            break
        }
        case "delete": { //inputs: id
            let toDelete = newTilesData.data.get(action.id);

            let prevTile = newTilesData.data.get(toDelete.prev);
            if(prevTile != null){
                let indexDelete = prevTile.next.indexOf(toDelete.id)
                if (indexDelete >= 0) { //React environment runs things twice whenever doing anything. This is a safety mechanism
                    prevTile.next.splice(indexDelete, 1);   
                }
            }

            //for each of next elements for the to be deleted tile
            //set their previous tile to -1 representing empty
            toDelete.next.forEach((element) => {
                let nextTile = newTilesData.data.get(element);
                nextTile.prev = -1;
            })

            //for each of the next elements for the to be deleted tile
            //update their DPS calculations
            if (toDelete.next.length !== 0) {
                toDelete.next.forEach((element) => {
                    iterateUpdate(undefined, newTilesData.data.get(element), newTilesData.data);

                });
            }
            
            newTilesData.data.delete(action.id)

            break
        }
        case "add-connection": { //inputs: startID, endID
            let startTile = newTilesData.data.get(action.startID);
            let endTile = newTilesData.data.get(action.endID);
            let memory = new Map()
            memory.set(endTile.id)
            if (startTile.next.indexOf(action.endID) === -1 && endTile.id > 0 && !HasCycle(startTile, memory, newTilesData.data)) { //if action.endID is not already added and endTile is not origin
                startTile.next.push(action.endID);

                //removing existing connection if it exists
                if (endTile.prev !== -1) {
                    let override = newTilesData.data.get(endTile.prev);
                    override.next.splice(override.next.indexOf(endTile.id), 1);
                }

                endTile.prev = action.startID;

                //propogates the connection state to the connected tile.
                if (!startTile.disconnected) {
                    endTile.disconnected = false;
                }

                iterateUpdate(startTile, endTile, newTilesData.data);
            }
            break
        }
        case "set-tile-pos": { //inputs: id, x, y
            newTilesData.data.get(action.id).position.x = action.x;
            newTilesData.data.get(action.id).position.y = action.y;
            break
        }
        case "change-origin": { //inputs: givenLoadout
            newTilesData.data.get(0).currState.weaponArr = action.givenLoadout;
            break
        }
        case "change-tile-data": { //inputs: id, setTo
            newTilesData.data.set(action.id, action.setTo)
            break
        }
        case "set-weapon": { //inputs: id, setTo
            newTilesData.data.get(action.id).weapon = action.setTo
            //if a user changes the start weapon then it would need to update everything after so call your inherit thing here
            break
        }
        case "update-all": {
            iterateUpdate(undefined, newTilesData.data.get(0), newTilesData.data)
            break
        }
        default: {
            throw Error("Unknown action for AllTilesDispatch: " + action.type)
        }
    }
    return newTilesData
}

/*
This component is called by add connection, or by tiles than need it like firing tiles when their string is changed and updates the current tiles state based on the previous tile
*/
export function UpdateTileState(prevTile, currTile){
    if (prevTile === undefined || prevTile.disconnected && !currTile.id === 0) {// if there is no prev tile a.k.a connection removed update state stuff to default
        // console.log("inside null check")
        currTile.disconnected = true;
        currTile.currState.totalDMG = 0;
        currTile.currState.time = 0;
        return;
    }

    currTile.currState = JSON.parse(JSON.stringify(prevTile.currState));//deep copy the previous tiles state object to inherit damage total, time, and weapons
   
    if(currTile.weapon === -1){//inherits the previous tile weapon if not set by Swap tile already
        currTile.weapon = prevTile.weapon;
    }
    switch(currTile.type){
        case "wait":{
            currTile.currState.time += currTile.waitTime;
            return currTile
        }
        case "fire":{// need to update both damage and time here, will likly need to do dps caluation and perk activations here
            currTile.convertedSequence = currTile.userFiringSequence.toLowerCase();
            currTile.convertedSequence.replace(/[^chm]/g, '');

            // maybe iterate through each char in hits and do calculation that way
            for (let i = 0; i < currTile.convertedSequence.length; i++) {
                if(currTile.currState.weaponArr[currTile.weapon].magSizeCurrent === 0){
                    currTile.convertedSequence = currTile.convertedSequence.substring(0, i);
                    return currTile; // return currtile and updated sequence so that we know what parts of the firing sequence to grey out/get rid of
                }
                
                currTile.currState.weaponArr[currTile.weapon].magSizeCurrent -= 1;//remove shot fired
                currTile.currState.weaponArr[currTile.weapon].hits.concat(currTile.convertedSequence[i]);//concatonate weapon hits with curr tile hits

                if(currTile.convertedSequence[i] === 'h' || currTile.convertedSequence[i] === 'c'){ //add damage done during tile to totalDMG if hit/crit hit
                    currTile.currState.totalDMG += (currTile.currState.weaponArr[currTile.weapon].baseDamage * 
                        CalcMult(currTile.currState.weaponArr[currTile.weapon].element, currTile.currState.weaponArr[currTile.weapon].type) * 
                        calculateCritMultiplier(currTile.convertedSequence[i], currTile.currState.weaponArr[currTile.weapon].canCrit)
                        );// perk damage calc will need function call
                }

                if(currTile.currState.weaponArr[currTile.weapon].chargeRate !== 0){// use this value for weapons with charge time else use timePenaltyFire
                    currTile.currState.time += currTile.currState.weaponArr[currTile.weapon].chargeRate;//may need to be modified temporarily by perks
                }
                
                else{// no time penalty for the first shot since it only between shots
                    if(i !== 0 || prevTile.type === "fire"){
                        currTile.currState.time += currTile.currState.weaponArr[currTile.weapon].timePenaltyFire;//may need to be modified temporarily by perks
                    }
                }

                //for every shot update the perks for all weapons in currstate weaponArr, to update timers i.e. frenzy
                
            }

        

            return currTile
        }
        case "reload":{
            currTile.currState.time += currTile.currState.weaponArr[currTile.weapon].timePenaltyReload;//incrementing state time 
            currTile.currState.weaponArr[currTile.weapon].magSizeCurrent = currTile.currState.weaponArr[currTile.weapon].magSize;//refilling mag to default max
            currTile.currState.weaponArr[currTile.weapon].hits = "";//resetting hit counter

            //will need to reset some perks here i.e. focused fury

            return currTile
        }
        case "swap":{
            currTile.currState.time += currTile.currState.weaponArr[currTile.weapon].timePenaltySwap; //update time (might need to include time based on both weaopns)
            // the weapon that is swapped to should be set on tile creation

            //will need to reset some perks here i.e. focused fury

            return currTile
        }
        default: {
            throw Error("Unknown Tile Action, only wait, fire, reload, swap");
        }
    }

    //return currTile
}


export function iterateUpdate(prevTile, currTile, newTilesData){
    UpdateTileState(prevTile, currTile);
    
    if(currTile.next.length !== 0){
        currTile.next.forEach((element) => {
            iterateUpdate(currTile, newTilesData.get(element), newTilesData);
        });
    }
}

/*
This component is just a wrapper component that holds all the data for it's children
*/
export default function Data(props) { 
    const { children } = props;
    const [AllTiles, AllTilesDispatch] = useReducer(AllTilesReducer, initialTiles);

    return (
        <AllTilesContext.Provider value={AllTiles.data}>
            <AllTilesDispatchContext.Provider value={AllTilesDispatch}>
                {children}
            </AllTilesDispatchContext.Provider>
        </AllTilesContext.Provider>
    )
}