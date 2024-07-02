import './simTile.css'
import { ArrowKey, CanvasDimension, ScaleSetting } from './simGUI.js'
import { useState, useContext, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import Xarrow, { useXarrow } from 'react-xarrows'
import { AllTilesDispatchContext } from './data.js';



function ArrowHead({ tileID, checkCollisionFunc, setDrag, tileBoundOffset, tileDragOffset, tileDim, show }) {
    const updateXarrow = useXarrow();
    const arrowID = useContext(ArrowKey) + tileID;
    
    const scale = useContext(ScaleSetting)

    const canvasDim = useContext(CanvasDimension);
    const arrowRef = useRef(null);
    const [arrowDim, setArrowDim] = useState({x: 42, y: 19, width: 12, height: 12});
    
    /*
        Determines whether the mouse is currently inside of another tile by calling the Sim
        Rerenders the arrow causing it to disappear as the element would have been removed at this point
    */
    const saveMousePos = (e, data) => {
        checkCollisionFunc(
            tileID,
            data.x + arrowDim.x + tileDragOffset.x + (arrowDim.width / 2),
            data.y + arrowDim.y + tileDragOffset.y + (arrowDim.height / 2)
        );
        updateXarrow(); //rerender the arrow
        setDrag(false); //notify the parent tile that we are done creating an arrow
    }
    
    /*
        rerenders the arrow as we are dragging it around
    */
    const dragHandler = () => {
        updateXarrow(); //rerender the arrow
        setDrag(true); //notify the parent tile that we are creating an arrow
    }

    //Since react reruns every render. The final render (happens after stop dragging) will cause this component to return to its default position.
    return (
        <nondrag>
            <Draggable
                onStop={saveMousePos}
                onDrag={dragHandler}
                position={{ x: 0, y: 0 }}
                bounds={{
                    left: -tileBoundOffset.x + arrowDim.width,
                    top: -tileBoundOffset.y + arrowDim.height,
                    right: canvasDim.width - tileBoundOffset.x,
                    bottom: canvasDim.height - tileBoundOffset.y
                }}
                scale={scale}
            >
                <div
                    className="ArrowHead"
                    onPointerDown={(e) => {e.stopPropagation()}}
                    id={arrowID}
                    ref={arrowRef}
                    style={show ? {} : {opacity: 0}}
                >
                </div>
            </Draggable>
        </nondrag>
    );
}

export default function Tile({ id, checkCollisionFunc, deleteHandler, setActiveTileData, position = { x: 0, y: 0 }, color, img }) {
    const AllTilesDispatch = useContext(AllTilesDispatchContext);

    //States for Arrows
    const updateXarrow = useXarrow();
    const canvasDim = useContext(CanvasDimension);
    const [arrowIsDragging, setArrowDragging] = useState(false);
    const arrowID = useContext(ArrowKey) + id;

    //States for Tile
    const tileRef = useRef(null);
    const [tileDimDOM, setTileDimDOM] = useState({ x: 0, y: 0, width: 50, height: 50 });
    const [tileDragPos, setTileDragPos] = useState({ x: position.x, y: position.y });
    
    const scale = useContext(ScaleSetting)

    //States for TileDeleteButton
    const [buttonShow, setButtonShow] = useState(false);
    const [isActiveAction, setActiveAction] = useState(false);

    /*
        Saves the current tile position into Data.js
    */
    function stopHandler(e, data) {
        //there are two positions. This one is the position of the DOM element which doesn't move when dragged
        if (AllTilesDispatch != null) {
            AllTilesDispatch({
                type: "set-tile-pos",
                id: id,
                x: data.x,
                y: data.y
            })   
        }

        //this is the position of the dragged element that has moved. It's very weird how CSS transform works
        setTileDragPos({ x: data.x, y: data.y });
        updateXarrow(); //rerender any connecting arrows
        setButtonShow(true);
        setActiveAction(false);
    }

    /*
        Updates the arrows to rerender
        Disables any other action from being done such as hovering
    */
    const dragHandler = () => {
        updateXarrow(); //rerender any connecting arrows
        setButtonShow(false);
        setActiveAction(true);
    }

    /*
        Sets the active tile to this tile
    */
    function pointerDownHandler() {
        setActiveTileData();
    }

    /*
        Shows the hover button options. Otherwise doesn't show if some tile is currently being dragged.
    */
    const pointerEnterHandler = () => {
        if (!isActiveAction) { //prevents the button showing if something else is happening such as a drag
            setButtonShow(true);
        }
    }
    
    /*
        Hides the hover button options.
    */
    const pointerLeaveHandler = () => {
        setButtonShow(false);
    }

    /*
        Receives dragging state of the arrow
    */
    function arrowDragHandler(isDragging) {
        if (isDragging) {
            setArrowDragging(true);
            setActiveAction(true);
            setButtonShow(false);
        }
        else {
            setActiveAction(false);
            setArrowDragging(false);
        }
    }

    //the additional 4 offset is to account for the border
    return (
        <canvasNoDrag>
            <Draggable
                grid={[25, 25]}
                defaultPosition={position}
                cancel="nondrag"
                onStop={stopHandler}
                onDrag={dragHandler}
                bounds={{
                    left: 0,
                    top: 0,
                    right: canvasDim.width - tileDimDOM.width - 4,
                    bottom: canvasDim.height - tileDimDOM.height
                }}
                scale={scale}
            >
                <div
                    className="Tile"
                    id={id}
                    ref={tileRef}
                    onPointerEnter={pointerEnterHandler}
                    onPointerLeave={pointerLeaveHandler}
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        pointerDownHandler();
                    }}
                >
                    { img }
                    <ArrowHead
                        tileID={id}
                        checkCollisionFunc={checkCollisionFunc}
                        setDrag={arrowDragHandler}
                        tileBoundOffset={{
                            x: canvasDim.x - tileDimDOM.x + tileDragPos.x + tileDimDOM.width + 5,
                            y: canvasDim.y - tileDimDOM.y + tileDragPos.y + tileDimDOM.height - 18,
                            width: tileDimDOM.width,
                            height: tileDimDOM.height
                        }}
                        tileDragOffset={tileDragPos}
                        tileDim={{width: tileDimDOM.width, height: tileDimDOM.height}}
                        show={buttonShow}
                    >
                    </ArrowHead>
                    {arrowIsDragging ? <Xarrow
                        start={id.toString()}
                        end={arrowID}
                        path={"grid"}
                        headSize={4}
                        strokeWidth={3}
                        lineColor="#5a5d5d"
                        headColor="#5a5d5d"
                        divContainerStyle={{scale:"" + (1 / scale)}}
                    /> : null}
                    {id !== 0 ? <button
                        className="TileDeleteButton"
                        onClick={(e) => {
                            e.stopPropagation()
                            deleteHandler(id)
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation()   
                        }}
                        disabled={!buttonShow}
                        style={(buttonShow) ? {} : {opacity: "0.0"}}
                    >
                    </button>
                        : null}
                </div>
            </Draggable>
        </canvasNoDrag>
    );
}