import React, { useContext, useState } from 'react';
import Calendar from 'react-calendar';
import '/src/assets/css/Calendar.css';
import { PracticesContext } from './PracticesContext';
import { getTypeColor } from '../layouts/Colors';
import { Container, Typography } from '@mui/material';
import { format } from 'date-fns';
import { ContentPasteSearchOutlined } from '@mui/icons-material';

export default function PracticeCalendar() {
    const [value, onChange] = useState(new Date());

    const { practices, setPractices } = useContext(PracticesContext);

    const tileContent = ({ date, view }) => {
        console.log(date);
        const practice = practices.find((p) => p.date === format(date, 'yyyy-MM-dd'));
        if (practice) {
            console.log(practice);
            return (
                <Typography style={{
                    backgroundColor: getTypeColor(practice.typeId)[500],
                    color: '#fff'
                }}>
                    {practice.typeName.charAt(0)}
                </Typography>
            );
        }
        console.log("here")
        return null;
    };


    return (
        <Container className="calendar" sx={{ marginTop: 5 }}>
            <Calendar onChange={onChange} value={value} navigationLabel={null} tileContent={tileContent} />
        </Container>
    );
}