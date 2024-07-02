
import './Modifiers.css';
import React, {useState, useContext} from 'react';
import DamageMod from './DamageMod';
import {AllTilesDispatchContext} from './data.js';

const Modifiers = () => {
  let AllTilesDispatch = useContext(AllTilesDispatchContext)


  //const [isToggled, setIsToggled] = useState(false);
  // const [largestDebuff, setLargestDebuff] = useState(0);
  // const [largestBuff, setLargestBuff] = useState(0);
  // maxValue = 0;
  //let y = 0
  const [y, setY] = useState(0); // initialize  y

  const handleSwitchToggle = (buffId, isToggled) => {
  };

  //Handler that eventually will get damage modification value(s)
  // const getXFromDamageMod = (xValue) => {
  //   // Store the value of x in y
  //   //y = xValue;
  //   setY(xValue); // Update y using setY
  // };


  return (
    <div className='Modifiers' onClick={(e) => {e.stopPropagation()}}>
      {/* <Switch rounded={true} isToggled={isToggled} onToggle={() => setIsToggled(!isToggled)}/> */}
      {/* <ToggleableCheckbox/> */}
      <DamageMod
        rounded={true}
        onSwitchToggle={handleSwitchToggle}
        // setLargestDebuff={setLargestDebuff}
        // setLargestBuff={setLargestBuff}
        //onGetX={getXFromDamageMod} // Pass the function to DamageMod to receive x
      />
      {/* <p style={{ color: 'white' }}>Largest Current Value on Active Debuffs: {largestDebuff}</p> */}
      {/* <p style={{ color: 'white' }}>y value in Modifiers.js: {y}</p> */}
    </div>
  );
};


export default Modifiers;
