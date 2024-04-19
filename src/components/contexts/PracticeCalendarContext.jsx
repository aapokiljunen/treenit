import React, { createContext, useState } from 'react';

const PracticeCalendarContext = createContext();

const PracticeCalendarProvider = ({ children }) => {
  const [calendarValue, setCalendarValue] = useState(new Date());

  return (
    <PracticeCalendarContext.Provider value={{ calendarValue, setCalendarValue }}>
      {children}
    </PracticeCalendarContext.Provider>
  );
};

export { PracticeCalendarContext, PracticeCalendarProvider };