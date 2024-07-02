import Sim from "./components/simGUI.js";
import './simPage.css';
import Modifiers from './components/Modifiers.js'
import { useState,  createContext, useReducer, useContext } from "react"; 
import { AllTilesDispatchContext } from "./components/data.js";

export const ModPopup = createContext(null)

export const PopupDispatchContext = createContext(null)

class PopupState {
    constructor(shown = false, display = (<></>)) {
        this.shown = shown
        this.display = display
    }  
}

function PopupReducer(popup, action) {
    switch (action.type) {
        case "change-display": {
            let newState = new PopupState(true, action.display)
            return newState
        }
        case "show": {
            let newState = new PopupState(true, popup.display)
            return newState
        }
        case "hide": {
            let newState = new PopupState(false, popup.display)
            return newState
        }
        default: {
            return popup
        }
    }
}


export default function Page() {
    const [modPopup, setModPopup] = useState(false)
    const [Popup, PopupDispatch] = useReducer(PopupReducer, new PopupState())
    const AllTilesDispatch = useContext(AllTilesDispatchContext)


    function handleDisplayMod() {
        if (modPopup) {
            return { opacity: 1, pointerEvents:"all" }
        }
        return { opacity: 0, pointerEvents:"none" }
    }

    //Modifiers Popup is a hackjob to ensure that data isn't removed when popup disappears
    return (
        <div className="Page">
            <ModPopup.Provider value={setModPopup}>
                <PopupDispatchContext.Provider value={PopupDispatch}>
                    <Sim />
                </PopupDispatchContext.Provider>
            </ModPopup.Provider>
            {modPopup ?
                <div className="PopupBackground" onClick={() => { 
                    setModPopup(false) 
                    AllTilesDispatch({
                        type: 'update-all'
                    })
                }} />
                :null
            }
            <div className="AdditionalOptionsPopup" style={handleDisplayMod()}>
                <Modifiers />
            </div>   
            {Popup.shown ?
                <>
                    {Popup.display}
                    <div className="PopupBackground" onClick={() => {PopupDispatch({type: 'hide'})}}/>
                </>
                : null
            }

        </div>
    )
}