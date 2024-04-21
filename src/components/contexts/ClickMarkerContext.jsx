import React, { createContext, useState } from 'react';

const ClickMarkerContext = createContext();

const ClickMarkerProvider = ({ children }) => {
  const [clickMarker, setClickMarker] = useState()

  return (
    <ClickMarkerContext.Provider value={{ clickMarker, setClickMarker }}>
      {children}
    </ClickMarkerContext.Provider>
  );
};

export { ClickMarkerContext, ClickMarkerProvider };