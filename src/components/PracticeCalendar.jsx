import React, { useContext, useState } from 'react';
import Calendar from 'react-calendar';
import '/src/assets/css/Calendar.css';
import { PracticesContext } from './contexts/PracticesContext';
import { PracticeCalendarContext } from './contexts/PracticeCalendarContext';
import { getTypeColor } from '../layouts/Colors';
import { Container, Typography } from '@mui/material';
import FormatDate from './functions/FormatDate';
import { ContentPasteSearchOutlined } from '@mui/icons-material';

export default function PracticeCalendar() {

    const { practices, setPractices } = useContext(PracticesContext);
    const { calendarValue, setCalendarValue } = useContext(PracticeCalendarContext);

    const tileContent = ({ date, view }) => {
        const practice = practices.find((p) => p.date === FormatDate(date));
        if (practice) {
            return (
                <Typography style={{
                    backgroundColor: getTypeColor(practice.typeId)[500],
                    color: '#fff'
                }}>
                    {practice.typeName.charAt(0)}
                </Typography>
            );
        }
        return null;
    };

    const handleChange = (newDate) => {
        setCalendarValue(newDate);
    }

    return (
        <Container className="practiceCalendar" >
            <Calendar
                value={calendarValue}
                onChange={handleChange}
                tileContent={tileContent} />
        </Container>
    );
}