import "./sim.css";
import SidePanel from "./sidePanel.js";
import { useState, createContext, useRef, useEffect, useContext } from 'react';
import Tile from './simTile.js'
import Xarrow, { Xwrapper } from 'react-xarrows'
import { AllTilesContext, AllTilesDispatchContext } from "./data.js";
import FireIcon from "../constants/Fire.png"
import ReloadIcon from "../constants/Reload.png"
import Swap1Icon from "../constants/Swap1.png"
import Swap2Icon from "../constants/Swap2.png"
import Swap3Icon from "../constants/Swap3.png"
import WaitIcon from "../constants/Wait.png"
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import Draggable from "react-draggable";

export const ArrowKey = createContext(null); //Think of this like a global variable
export const CanvasDimension = createContext(null);
export const ScaleSetting = createContext(1)

const scaleValues = [1, 0.85, 0.75, 0.6]

export default function Sim() {
    const AllTiles = useContext(AllTilesContext);
    const AllTilesDispatch = useContext(AllTilesDispatchContext);

    const CanvasRef = useRef(null);
    const [canvasRect, setCanvasRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [positionX, setPositionX] = useState(600)
    const [positionY, setPositionY] = useState(500)

    const BorderRef = useRef(null);
    const [borderRect, setBorderRect] = useState({ x: 0, y: 0, width: 0, height: 0 })

    const [scale, setScale] = useState(0)

    const tileSize = 50;

    const [activeTile, setActiveTile] = useState(0)
    const [showTileData, setShowTileData] = useState(false)
    const [showTilePath, setShowTilePath] = useState(false)
    const [activeTilePath, setActiveTilePath] = useState(new Map())

    /*
    Checks if a point x, y is within a tile's space
    Tile positions are determined by their upper left corner.
    */
    function checkCollision(originID, x, y) {
        console.log("mouse at: ", x, y)
        console.log(AllTiles)
        AllTiles.forEach((value) => {
            if (x >= value.position.x && x <= value.position.x + tileSize
                && y >= value.position.y && y <= value.position.y + tileSize) {
                if (originID !== value.id && AllTilesDispatch != null) {
                    AllTilesDispatch({
                        type: "add-connection",
                        startID: originID,
                        endID: value.id
                    });
                }
            }
        })
    }

    /*
        Spawns a tile given at the center of the canvas.
        color: color of tile
        type: type of tile
        swap: indicates what type of swap if the tile is a swap tile
    */
    function spawnTile(color, type, swap = -1) {
        const spawnX = (25 - (positionX % 25)) + positionX
        const spawnY = (25 - (positionY % 25)) + positionY
        AllTilesDispatch({
            type: "add",
            color: color,
            tiletype: type,
            x: (spawnX + 800),
            y: (spawnY + 400),
            swap: swap
        })
    }

    /*
        Given the id of a start tile. Finds a path to the tile that doesn't have a prev
        Often times this will be the Origin Tile.
        id: start id
        path: a list representing a path
    */
    function DFS(id, path) {
        if (AllTiles.get(id).prev === -1) {
            return id;
        }
        let prevConnect = AllTiles.get(id).prev;
        path.set(DFS(prevConnect, path), id);
        return id;
    }


    /*
        Driver function for DFS
    */
    function pathSearch(id) {
        let pathToRoot = new Map();
        DFS(id, pathToRoot);
        return pathToRoot
    }

    /*
        Sets the activeTile to a specific ID
        Also sets the path from that tile to the origin
        Then shows the path and tile
    */
    function activeTileHandler(id, showData, showPath) {
        let path = pathSearch(id)
        setActiveTilePath(path);
        setActiveTile(id);
        setShowTileData(showData)
        setShowTilePath(showPath)
    }

    /*
        deletes the given tile
    */
    function deleteTileHandler(id) {
        setShowTileData(false)
        if (AllTilesDispatch != null) {
            AllTilesDispatch({
                type: "delete",
                id: id
            })
        }
    }

    /*
        Sets the canvas in focus unfocusing the sidepanel and returning it to the main menu
    */
    const mouseDownHandler = (e) => {
        setShowTileData(false);
        setShowTilePath(false);
    }

    /*
        Keeps track of the position of the canvas. Used later to calculate where to spawn new tiles
    */
    function handleStopDrag(e, data) {
        setPositionX(-data.x)
        setPositionY(-data.y)
    }

    /*
        Handles scrolling on canvas to move the zoom value
    */
    const handleScroll = (e) => {
        if (e.deltaY < 0) {
            if (scale > 0) {
                setScale(scale - 1)
            }
        }
        else if (e.deltaY > 0) {
            if (scale < scaleValues.length - 1) {
                setScale(scale + 1)
            }
        }
    }

    //checks canvas' pos and size values
    //This is mainly so that we can move it around and it will take care of it's own dimensions
    useEffect(() => {
        setCanvasRect({
            x: CanvasRef.current.offsetLeft,
            y: CanvasRef.current.offsetTop,
            width: CanvasRef.current.clientWidth,
            height: CanvasRef.current.clientHeight
        });

        setBorderRect({
            x: BorderRef.current.offsetLeft,
            y: BorderRef.current.offsetTop,
            width: BorderRef.current.clientWidth,
            height: BorderRef.current.clientHeight
        })
    }, []);


    /*
        Sets the tile's Icon image when drawing
    */
    function setDisplay(tileData) {
        switch (tileData.type) {
            case ("fire"):
                return (
                    <img className="TileImage" src={FireIcon} alt='fire' style={{ height: "80%", width: "85%", paddingTop: "5px", paddingLeft: "4px" }} />
                )
            case ("reload"):
                return (
                    <img className="TileImage" src={ReloadIcon} alt='reload' />
                )
            case ("swap"):
                switch (tileData.weapon) {
                    case (0):
                        return (
                            <img className="TileImage" src={Swap1Icon} alt='swap1' />
                        )
                    case (1):
                        return (
                            <img className="TileImage" src={Swap2Icon} alt='swap2' />
                        )
                    case (2):
                        return (
                            <img className="TileImage" src={Swap3Icon} alt='swap3' />
                        )
                    default:
                        return ""
                }
            case ("wait"):
                return (
                    <img className="TileImage" src={WaitIcon} alt='wait' />
                )
            case ("origin"):
                return (
                    <KeyboardArrowRightOutlinedIcon style={{position:"relative", fontSize:"50px"}}/>
                )
            default:
                return ""
        }
    }

    /*
        Puts all tiles into an array to be drawn
    */
    function createTiles() {
        let tiles = [];
        AllTiles.forEach((value, key) => {
            if (key < 0) { //skip rendering dummy tile
                return;
            }
            tiles.push(<Tile
                key={value.id}
                id={value.id}
                checkCollisionFunc={checkCollision}
                setActiveTileData={() => activeTileHandler(value.id, true, true)}
                deleteHandler={deleteTileHandler}
                position={value.position}
                color={value.color}
                img={setDisplay(value)}
            />);
        })
        return tiles;
    }

    /*
    This creates an array of React component declarations for every connection between two tiles.
    */
    function createArrows() {
        let arrows = [];
        let highlight = []
        for (let [key, value] of (AllTiles ?? new Map())) {
            for (let i = 0; i < value.next.length; i++) {
                //console.log("checking for: " + value.id + " -> " + activeTilePath.get(value.id))
                if (value.next[i] === activeTilePath.get(value.id) && showTilePath) {
                    highlight.push(<Xarrow
                        key={"" + value.id + value.next[i]}
                        start={value.id.toString()}
                        end={value.next[i].toString()}
                        path={"grid"}
                        headSize={4}
                        strokeWidth={3 * scaleValues[scale]}
                        lineColor="#46838b"
                        headColor="#46838b"
                        divContainerStyle={{scale:"" + (1 / scaleValues[scale])}}
                    />);
                }
                else {
                    arrows.push(<Xarrow
                        key={"" + value.id + value.next[i]}
                        start={value.id.toString()}
                        end={value.next[i].toString()}
                        path={"grid"}
                        headSize={4}
                        strokeWidth={3 * scaleValues[scale]}
                        lineColor="#5a5d5d"
                        headColor="#5a5d5d"
                        divContainerStyle={{scale:"" + (1 / scaleValues[scale])}}
                    />);
                }
            }
        }

        arrows.push(highlight);
        return arrows;
    }

    return (
        <div className="Sim">
            <ArrowKey.Provider value={"A"}>
                <CanvasDimension.Provider value={canvasRect}>
                    <ScaleSetting.Provider value={scaleValues[scale]}>
                        <div
                            className="CanvasBorder"
                            ref={BorderRef}
                            onWheel={handleScroll}
                        >
                            <Draggable
                                cancel="canvasNoDrag"
                                onStop={handleStopDrag}
                                bounds={{
                                    left: -canvasRect.width + borderRect.width,
                                    top: -canvasRect.height + borderRect.height,
                                    right: 0 + (canvasRect.width * (1 - scaleValues[scale])),
                                    bottom: 0 + (canvasRect.height * (1 - scaleValues[scale]))
                                }}
                                defaultPosition={{ x: -600 * scaleValues[scale], y: -500 * scaleValues[scale] }}
                                scale={scaleValues[scale]}
                            >
                                <div
                                    className="Canvas"
                                    onPointerDown={mouseDownHandler}
                                    ref={CanvasRef}
                                    style={{scale: "" + scaleValues[scale], transformOrigin:"top left"}}
                                >
                                    <Xwrapper>
                                        {createArrows()}
                                        {createTiles()}
                                    </Xwrapper>
                                </div>
                            </Draggable>
                        </div>
                    </ScaleSetting.Provider>
                </CanvasDimension.Provider>
            </ArrowKey.Provider>
            <SidePanel
                display={showTileData}
                activeID={activeTile}
                spawnFunc={spawnTile}
                highlightFunc={activeTileHandler}
                showTilePath={showTilePath}
            />
        </div>
    );
}