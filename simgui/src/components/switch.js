import React from "react";
import './switch.css'
import cx from "classnames"

const Switch = ({ rounded = false, isToggled, onToggle, TestText }) => {
  const sliderCX = cx('slider', {
    'rounded': rounded
  });

  //   const TestText = "Testing what ever buff";
  //const textCX = cx('text-white'); 

  return (
    <label className="switch">
      <input type="checkbox" checked={isToggled} onChange={onToggle} />
      <span className={sliderCX} />
      <span style={{ color: 'white' }}>{TestText}</span>
    </label>
  );
};

export default Switch;
