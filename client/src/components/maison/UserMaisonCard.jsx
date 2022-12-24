/* eslint-disable jsx-a11y/alt-text */
import React from 'react';

const UserMaisonCard = ({maison}) => {
    return (
        <>
            <div className='col s12 m4' style={{}}>

                <div className="card" style={{}}>
                    <div className="card-image">
                    <img src={`http://localhost:3700/uploads/${maison.images[0].path}`} style={{}}/>
                        <span className="card-title teal-text">{maison.quartier}</span>
                        <span class="new badge blue" data-badge-caption={`${maison.enAttente?'En attente':maison.enLocation?'En location':'Pas en Location'}`}></span>

                    </div>
                    <div className="card-content">
                        <p style={{height:50, overflow: 'scroll'}}>{maison.description}</p>
                    </div>
                    <div className='' style={{ display: 'flex', justifyContent: 'space-around', height: 60 }}>
                        <button className="btn-floating">Voir</button>
                        <button className="btn-floating red"><i className='material-icons'>delete</i></button>
                    </div>
                </div>

            </div>
        </>
    );
};

export default UserMaisonCard;