import { Container, Paper } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import Calendar from 'react-calendar';
import { getTypeColor } from '../layouts/Colors';
import { PracticeCalendarContext } from './contexts/PracticeCalendarContext';
import { PracticesContext } from './contexts/PracticesContext';
import FormatDate from './functions/FormatDate';
import '/src/assets/css/Calendar.css';

export default function PracticeCalendar() {

    const { practices, setPractices } = useContext(PracticesContext);
    const { calendarValue, setCalendarValue } = useContext(PracticeCalendarContext);

    const tileContent = ({ date, view }) => {
        const practice = practices.find((p) => p.date === FormatDate(date));
        if (practice) {
            return (
                <Paper
                    elevation={2}
                    style={{
                        backgroundColor: getTypeColor(practice.typeId)[500],
                        color: '#fff'

                    }}>
                    {practice.typeName.charAt(0)}
                </Paper>
            );
        }
        return null;
    };

    const handleChange = (newDate) => {
        setCalendarValue(newDate);
    }

    useEffect(() => {
    }, [calendarValue]);

    return (
        <Container className="practiceCalendar" >
            <Calendar
                value={calendarValue}
                onChange={handleChange}
                tileContent={tileContent} />
        </Container>
    );
}