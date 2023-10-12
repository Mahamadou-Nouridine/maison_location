import React from 'react';
import { useEffect } from 'react';
import Maison from './MaisonCard';

const Maisons = ({ maisons, setSelectedMaison, id, refresh }) => {
    useEffect(() => {
        console.log(maisons);
    }, [])
    return (
        <>
        {
            maisons.length
            ? <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: 70 }} >
                {
                     maisons.map((item, key)=><Maison refresh={refresh} id={id} setSelectedMaison={setSelectedMaison} maison={item} key={key} position={key}/>)
                }
            </div>
            :<div style={{ height: 'calc(100vh - 140px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h1>
                    Pas de maison de location...
                </h1>
            </div>
        }
        </>
    );
};

export default Maisons;