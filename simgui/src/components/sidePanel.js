import './sidePanel.css';
import { AllTilesContext, AllTilesDispatchContext } from './data.js';
import { ModPopup, PopupDispatchContext } from '../simPage.js';
import { iterateUpdate } from './data.js';
import { useContext, useEffect, useState } from 'react';
import FireIcon from "../constants/Fire.png"
import ReloadIcon from "../constants/Reload.png"
import Swap1Icon from "../constants/Swap1.png"
import Swap2Icon from "../constants/Swap2.png"
import Swap3Icon from "../constants/Swap3.png"
import WaitIcon from "../constants/Wait.png"
import TuneIcon from '@mui/icons-material/Tune'
import SaveIcon from '@mui/icons-material/Save'

function TileMenu({ activeID }) {
    let AllTiles = useContext(AllTilesContext)
    let AllTilesDispatch = useContext(AllTilesDispatchContext)
    let activeData = AllTiles.get(activeID)

    //these serve 2 reasons
    //fix a bug that copies values when swapping to different tiles directly
    //allows updating without submit button later
    const [userSeq, setUserSeq] = useState(activeData.userFiringSequence)
    const [userNote, setUserNote] = useState(activeData.notes)
    const [userWait, setUserWait] = useState(activeData.waitTime)

    /*
        This pulls all the tile states into a React state object.
    */
    useEffect(() => {
        setUserSeq(AllTiles.get(activeID).userFiringSequence)
        setUserNote(AllTiles.get(activeID).notes)
        setUserWait(AllTiles.get(activeID).waitTime)
    }, [AllTiles, activeID])

    /*
        Overrides the <Form> submit handler to update a specific tile.
    */
    function handleSubmit(e) {
        e.preventDefault() //this function calls a server by default.

        const formData = new FormData(e.target)
        activeData.userFiringSequence = formData.get("firingSeq") ?? "" //?? is an operator that checks whether the left is Null and uses the right if left is null
        activeData.waitTime = +formData.get('waitTime') ?? 0
        activeData.notes = formData.get("notes")
        AllTilesDispatch({
            type: "change-tile-data",
            id: activeData.id,
            setTo: activeData
        })

        if(activeData.type === "fire" ||activeData.type === "wait"  ){
            //console.log("alltiles", AllTiles)
            //UpdateTileState( AllTiles.get(activeData.prev), activeData);
            iterateUpdate(AllTiles.get(activeData.prev), activeData, AllTiles);
        }
    }

    /*
        Sets the start weapon given user input
    */
    function setStartWeapon(id, setTo) {
        if (AllTilesDispatch != null) {
            AllTilesDispatch({
                type: "set-weapon",
                id: id,
                setTo: setTo
            })
        }
    }

    /*
        Gets the current weapon of a tile given the id of the tile.
    */
    function getCurrentWeapon(id) {
        let tile = AllTiles.get(id)
        if (tile != null) {
            return tile.weapon
        }
        return 0
    }

    /*
        Switch case that determines which menu to display according to tile type
    */
    function showTile() {
        switch (activeData.type) {
            case 'fire':
                return (
                    <div className='TileDataDisplay'>
                        <h2 className='TileDataTitle'>{"TileData - Fire"}</h2>
                        <ul className='TileDataFireUL'>
                            <li className='TileDataCellKey'>
                                Weapon:
                            </li>
                            <li className='TileDataCellValue'>
                                {"x" /* these are the actual values */}
                            </li>
                            <li className='TileDataCellKey'>
                                Current Time:
                            </li>
                            <li className='TileDataCellValue'>
                                {activeData.currState.time}
                            </li>
                            <li className='TileDataCellKey'>
                                Current DMG: 
                            </li>
                            <li className='TileDataCellValue'>
                                {activeData.currState.totalDMG}
                            </li>
                            <li className='TileDataCellKey'>
                                Current DPS: 
                            </li>
                            <li className='TileDataCellValue'>
                                {Number(Math.round((activeData.currState.totalDMG / activeData.currState.time)+'e2')+'e-2')}
                            </li>
                        </ul>
                        <hr className='SideBarDivider' />
                        <form className='TileDataFireForm' method='post' onSubmit={handleSubmit}>
                            <span style={{ fontWeight: 600 }}>Firing Sequence:</span>
                            <label className='TileDataFormLabel'>
                                <textarea
                                    className='TextArea'
                                    name='firingSeq'
                                    onChange={(e) => { setUserSeq(e.target.value) }}
                                    placeholder=' H - Hit shot
                                    M - Miss shot
                                    C - Headshot'
                                    value={userSeq}
                                    spellCheck='false'
                                />
                                <span style={{ fontWeight: 600 }}>Notes:</span>
                                <textarea
                                    className='TextArea'
                                    name='notes'
                                    onChange={(e) => { setUserNote(e.target.value) }}
                                    placeholder='Anything you want to remember'
                                    value={userNote}
                                    spellCheck='false'
                                />
                                <button className='SubmitButton' type='submit'>Save</button>
                            </label>
                        </form>
                    </div>
                )
            case 'reload':
                return (
                    <div className='TileDataDisplay'>
                        <h2 className='TileDataTitle'>{"TileData - Reload"}</h2>
                        <ul className='TileDataFireUL' style={{ paddingBottom: "9%" }}>
                            <li className='TileDataCellKey'>
                                Current Time:
                            </li>
                            <li className='TileDataCellValue'>
                                {activeData.currState.time}
                            </li>
                            <li className='TileDataCellKey'>
                                Current DMG: 
                            </li>
                            <li className='TileDataCellValue'>
                                {activeData.currState.totalDMG}
                            </li>
                            <li className='TileDataCellKey'>
                                Current DPS: 
                            </li>
                            <li className='TileDataCellValue'>
                                {Number(Math.round((activeData.currState.totalDMG / activeData.currState.time)+'e2')+'e-2')}
                            </li>
                        </ul>
                        <hr className='SideBarDivider' />
                        <form className='TileDataFireForm' method='post' onSubmit={handleSubmit}>
                            <span style={{ fontWeight: 600 }}>Notes:</span>
                            <label>
                                <textarea
                                    className='TextArea'
                                    name='notes'
                                    onChange={(e) => { setUserNote(e.target.value) }}
                                    value={userNote}
                                    spellCheck='false'
                                />
                                <button className='SubmitButton' type='submit'>Save</button>
                            </label>
                        </form>
                    </div>
                )
            case 'swap':
                return (
                    <div className='TileDataDisplay'>
                        <h2 className='TileDataTitle'>{"TileData - Swap"}</h2>
                        <ul className='TileDataFireUL' style={{paddingBottom:"18%"}}>
                            <li className='TileDataCellKey'>
                                Swapping To:
                            </li>
                            <li className='TileDataCellValue'>
                                {"weapon " + (activeData.weapon + 1)}
                            </li>
                            <li className='TileDataCellKey'>
                                Current Time:
                            </li>
                            <li className='TileDataCellValue'>
                                {activeData.currState.time}
                            </li>
                            <li className='TileDataCellKey'>
                                Current DMG: 
                            </li>
                            <li className='TileDataCellValue'>
                                {activeData.currState.totalDMG}
                            </li>
                            <li className='TileDataCellKey'>
                                Current DPS: 
                            </li>
                            <li className='TileDataCellValue'>
                                {Number(Math.round((activeData.currState.totalDMG / activeData.currState.time)+'e2')+'e-2')}
                            </li>
                        </ul>
                        <hr className='SideBarDivider' />
                        <form className='TileDataFireForm' method='post' onSubmit={handleSubmit}>
                            <span style={{ fontWeight: 600 }}>Notes</span>
                            <label>
                                <textarea
                                    className='TextArea'
                                    name='notes'
                                    onChange={(e) => { setUserNote(e.target.value) }}
                                    value={userNote}
                                    spellCheck='false'
                                />
                                <button className='SubmitButton' type='submit'>Save</button>
                            </label>
                        </form>
                    </div>
                )
            case 'wait':
                return (
                    <div className='TileDataDisplay'>
                        <h2 className='TileDataTitle'>{"TileData - Wait"}</h2>
                        <ul className='TileDataFireUL' style={{ paddingBottom: '9%' }}>
                            <li className='TileDataCellKey'>
                                Current Time:
                            </li>
                            <li className='TileDataCellValue'>
                                {activeData.currState.time}
                            </li>
                            <li className='TileDataCellKey'>
                                Current DMG: 
                            </li>
                            <li className='TileDataCellValue'>
                                {activeData.currState.totalDMG}
                            </li>
                            <li className='TileDataCellKey'>
                                Current DPS: 
                            </li>
                            <li className='TileDataCellValue'>
                                {Number(Math.round((activeData.currState.totalDMG / activeData.currState.time)+'e2')+'e-2')}
                            </li>
                        </ul>
                        <hr className='SideBarDivider' />
                        <form className='TileDataFireForm' method='post' onSubmit={handleSubmit}>
                            <span style={{ fontWeight: 600 }}>Wait Time</span>
                            <label className='TileDataFormLabel'>
                                <input
                                    className='WaitInput'
                                    name='waitTime'
                                    value={userWait}
                                    onChange={(e) => { setUserWait(e.target.value) }}
                                />
                            <span style={{ fontWeight: 600, display: 'block', paddingTop: '3%' }}>Notes</span>
                                <textarea
                                    className='TextArea'
                                    name='notes'
                                    onChange={(e) => { setUserNote(e.target.value) }}
                                    defaultValue={activeData.notes}
                                    spellCheck='false'
                                />
                                <button className='SubmitButton' type='submit'>Save</button>
                            </label>
                        </form>
                    </div>
                )
            default:
                return (
                    <div className='TileDataDisplay'>
                        <h2 className='TileDataTitle'>{"TileData - Origin"}</h2>
                        <h3 style={{ fontWeight: '400' }}>
                            Set the starting weapon
                        </h3>
                        <div className='SelectWeaponContainer'>
                            <button className='OriginStartWeaponButton'
                                disabled={getCurrentWeapon(activeID) === 0 ? true : false}
                                onClick={() => { setStartWeapon(activeID, 0) }}
                            >
                                1
                            </button>
                            <button className='OriginStartWeaponButton'
                                disabled={getCurrentWeapon(activeID) === 1 ? true : false}
                                onClick={() => { setStartWeapon(activeID, 1) }}
                            >
                                2
                            </button>
                            <button className='OriginStartWeaponButton'
                                disabled={getCurrentWeapon(activeID) === 2 ? true : false}
                                onClick={() => { setStartWeapon(activeID, 2) }}
                            >
                                3
                            </button>
                        </div>
                    </div>
                )
        }
    }
    
    return (
        <div className="SideBar" style={{ whiteSpace: "pre-line", textAlign: "center" }} >
            {showTile()}
        </div>
    )
}

/*
    Individual path buttons
*/
function PathButton({ data, highlightFunc, setActivePath, activePath, showTilePath }) {

    /*
        Highlights the path that is selected
    */
    function highlightTile() {
        setActivePath()
        highlightFunc(data.id, false, true)
    }

    return (
        <li
            className={activePath === data.id && showTilePath ? "active PathButton" : "PathButton"}
            onClick={(e) => {
            e.stopPropagation()
            highlightTile()
            }}
        >
            <div className='PathButtonDisplayContainer'>
                <div className='PathButtonTextContainer'>
                    <span className='PathDMGText'>
                        Total Damage: 
                    </span>
                    <span className='PathDMGNumber'>
                        {data.currState.totalDMG}
                    </span>
                </div>
                <div className='PathButtonTextContainer'>
                    <span className='PathDMGText'>
                        DPS:
                    </span>
                    <span className='PathDMGNumber'>
                        {Number(Math.round((data.currState.totalDMG / data.currState.time) + 'e2') + 'e-2')}
                    </span>
                </div>
            </div>
        </li>
    )
}

/*
    Popup window for saving
*/
function SaveCodePopup() {
    let AllTiles = useContext(AllTilesContext)
    const [text, setText] = useState("put the share code here. Don't worry the user can't edit this at all, but they can ctrl-a and ctrl-c")

    /*
        Updates the copyable text to 
    */
    function changeTextHandler() {
        var currentWeaponArray = AllTiles.get(0).currState.weaponArr
        var shareCode = ""
        console.log(currentWeaponArray)
        for(var curr in [0,1,2])
        {
            //console.log(curr)
            if(typeof currentWeaponArray[curr] ==='undefined'){
                shareCode += "0"
            }else{
            var hash = parseFloat(currentWeaponArray[curr].itemHash)
            if(hash === -1 ){
                shareCode += "0"
            }
            else
            {
                shareCode += hash.toString(16);
            }
        }
            if(curr < 2){
                shareCode+="&"
            }
        }
        setText(shareCode)
    }

    return (
        <div className='SavePopupContainer'>
            <h2 className='SavePopupTitle'>Share Code</h2>
            <textarea
                className='SavePopupTextarea'
                value={text}
                spellCheck='false'
            />
            <button className='SavePopupGenButton' onClick={changeTextHandler}>
                Create Code
            </button>
        </div>
    )
}

/*
    The option buttons on the bottom of the sidepanel
*/
function OptionsButton({clickhandler, text, children}) {

    return (
        <button className='ModifiersButton' onClick={clickhandler}>
            <span className='ModifiersButtonIcon'>
                {children}
            </span>
            <span className='ModifiersButtonText'>
                {text}
            </span>
        </button>
    )
}

function TileSpawner({ spawnFunc, highlightFunc, showTilePath }) {
    const AllTiles = useContext(AllTilesContext)
    const PopupDispatch = useContext(PopupDispatchContext)
    const [activePath, setActivePath] = useState(0)
    const setModPopup = useContext(ModPopup)

    /*
        Sets the popup state of the additional settings popup
    */
    function additionalOptionsHandler() {
        if (setModPopup !== null) {
            setModPopup(true)   
        }
    }

    /*
        Sets the popup state of the save popup
    */
    function saveHandler() {
        const popupLayout = (
            <SaveCodePopup />
        )

        PopupDispatch({
            type: 'change-display',
            display: popupLayout,
        })
    }

    /*
        Gets all the endpoints from AllTilesData.
        Orders the endpoints by highest to lowest DPS
        Creates buttons and save into a list to be displayed
    */
    function displayEndpoints() {
        let allEndpoints = []
        AllTiles.forEach(value => {
            if (value.next.length === 0 && !value.disconnected) {
                allEndpoints.push(value)
            }
        });
        allEndpoints.sort((a, b) => {
            let a_dps = Number(Math.round((a.currState.totalDMG / a.currState.time) + 'e2') + 'e-2')
            let b_dps = Number(Math.round((b.currState.totalDMG / b.currState.time) + 'e2') + 'e-2')
            if (a_dps > b_dps) {
                return -1
            }
            if (a_dps < b_dps) {
                return 1
            }
            return 0
        })

        let toDisplay = []
        allEndpoints.forEach((i) => {
            if (i.type !== "origin") {
                toDisplay.push(
                    <PathButton
                        data={i}
                        key={i.id}
                        highlightFunc={highlightFunc}
                        setActivePath={() => {
                            setActivePath(i.id)
                        }}
                        activePath={activePath}
                        showTilePath={showTilePath}
                    />
                )   
            }
        })

        return (
            <ul style={{paddingLeft:"0px"}}>
                {toDisplay}
            </ul>
        )
    }

    return (
        <div className="SideBar">
            <div className='TileSpawnerContainer'>
                <ul style={{paddingLeft: "28px", paddingRight: "28px"}}>
                    <li className="TileButtonRow">
                        <button className="TileSpawnButton" onClick={() => spawnFunc("#454545", "fire")} >
                            <img src={FireIcon} alt="fire" style={{width:"90%", height:"85%", alignContent:'center', paddingTop:"4px"}} />
                        </button>
                        <button className="TileSpawnButton" onClick={() => spawnFunc("#454545", "reload")} >
                            <img src={ReloadIcon} alt='reload' style={{width:"100%", height:"85%", alignContent:"center", paddingTop:"2px"}}/>
                        </button>
                        <button className="TileSpawnButton" onClick={() => spawnFunc("#454545", "swap", 0)} >
                            <img src={Swap1Icon} alt='swap1' style={{ width: "100%", height: "85%", alignContent: "center", paddingTop:"1px"}} />
                        </button>
                    </li>
                    <li className="TileButtonRow">
                        <button className='TileSpawnButton' onClick={() => spawnFunc("#454545", "swap", 1)} >
                            <img src={Swap2Icon} alt='swap2' style={{width:"100%", height:"85%", alignContent:"center", paddingTop:"1px"}}/>
                        </button>
                        <button className='TileSpawnButton' onClick={() => spawnFunc("#454545", "swap", 2)} >
                            <img src={Swap3Icon} alt='swap3' style={{width:"100%", height:"85%", alignContent:"center", paddingTop:"1px"}}/>
                        </button>
                        <button className='TileSpawnButton' onClick={() => spawnFunc("#454545", "wait")} >
                            <img src={WaitIcon} alt='wait' style={{width:"100%", height:"90%", alignContent:"center", paddingTop:"1px"}} />
                        </button>
                    </li>
                </ul>
            </div>
            <div className='PathContainer'>
                <h3 style={{fontWeight: "600", textAlign:"center"}}>
                    DPS paths
                </h3>
                <div>
                    {displayEndpoints()}
                </div>
            </div>
            <div className='AdditionalOptionsContainer'>
                <OptionsButton clickhandler={additionalOptionsHandler} text={"Settings"}>
                    <TuneIcon style={{ color: "#c9c9c9" }} />
                </OptionsButton>
                <OptionsButton clickhandler={saveHandler} text={"Save"}>
                    <SaveIcon style={{ color: "#c9c9c9" }} />
                </OptionsButton>
                <OptionsButton>

                </OptionsButton>
            </div>
        </div>
    )
}

export default function SidePanel({ display, activeID, spawnFunc, highlightFunc, showTilePath }) {

    return (
        <>
            {(display) ?
                <TileMenu activeID={activeID} /> :
                <TileSpawner
                    spawnFunc={spawnFunc}
                    highlightFunc={highlightFunc}
                    showTilePath={showTilePath}
                />
            }
        </>
    );
}