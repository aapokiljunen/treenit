import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LocationsContext } from './contexts/LocationsContext';
import { useContext, useState, useEffect } from 'react';
import { ClickMarkerContext } from './contexts/ClickMarkerContext';

export default function LocationsMap({ position, zoom, size }) {
    const { locations } = useContext(LocationsContext);
    const [loading, setLoading] = useState(true);
    const { clickMarker, setClickMarker } = useContext(ClickMarkerContext);

    useEffect(() => {
        if (locations && locations.length > 0) {
            setLoading(false);
        }
    }, [locations]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const ClickMarker = () => {
        useMapEvents({
            click(e) {
                console.log(e)
                const { lat, lng } = e.latlng;
                setClickMarker({ lat, lng });
                console.log(clickMarker)
            }
        })
        return false;
    }


    return (
        <MapContainer
            center={position || [60.2, 24.9]}
            zoom={zoom || 11}
            style={size || { width: 400, height: 400 }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((location, index) => {
                const position = [location.latitude, location.longitude];
                return (
                    <Marker position={position} key={index}>
                        <Popup>
                            {location.name}
                        </Popup>
                    </Marker>
                );
            })}
            {clickMarker && (
                <Marker position={[clickMarker.lat, clickMarker.lng]} />)}
            {!position && <ClickMarker />}
        </MapContainer>
    );
}