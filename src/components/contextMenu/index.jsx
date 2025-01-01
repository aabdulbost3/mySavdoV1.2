import React, { useState } from 'react';
import "./style.css"

export default function CustomContextMenu (event) {
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setMenuPosition({ x: event.pageX, y: event.pageY });
    setIsVisible(true);
  };

  const handleClick = () => {
    setIsVisible(false);
  };

  const handleOptionClick = (option) => {
    console.log(`${option} clicked`);
    setIsVisible(false);
  };

  return (
    <div className='ContextMenu' onContextMenu={handleContextMenu} onClick={handleClick}>
      {isVisible && (
        <div
          style={{top: menuPosition.y, left: menuPosition.x}}>
          <ul>
            <li onClick={() => handleOptionClick('Option 1')}>
              Option 1
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};