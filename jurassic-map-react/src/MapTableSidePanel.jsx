import React, { useState } from 'react';

const MapTableSidePanel = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="sidePanel" onClick={() => setIsActive(!isActive)}>
      <button className="sidePanelCollapseButton" title="Collapse/Exapnd" onClick={() => setIsActive(!isActive)}>{isActive ? '^' : 'Map Controls'}</button>
      {isActive && <div className="mapTableSidePanel">
        <img className="mapTableSidePanelImg" src="mapGuideTop_715x345.png" alt="MapLocationsIndex"/>
        <img className="mapTableSidePanelImg" src="mapGuideMiddle_715x1395.png" alt="DinosaurIndex"/>
      </div>}
    </div>
  );
};

export default MapTableSidePanel;