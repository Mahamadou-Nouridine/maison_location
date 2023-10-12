import React, { useEffect } from 'react';
import LocationEnCours from './LocationEnCours';
import MaisonForm from './MaisonForm';
import MaisonCard from './MaisonCard';
import M from 'materialize-css';

const UserMaison = ({ user, stopLocation, setSelectedMaison, refresh }) => {
    useEffect(() => {
        var el = document.querySelectorAll('.tabs');
        M.Tabs.init(el)
    }, [user])




    return (
        <>
            {
                user
                    ? <div class="row" style={{ marginTop: 100 }}>
                        <div class="col s12">
                            <ul class="tabs">
                                <li class="tab col s3"><a class="active" href="#test1">Mes Maisons de location</a></li>
                                <li class="tab col s3"><a href="#test2">Ma location en cours</a></li>
                                <li class="tab col s3"><a href="#test3">Ajouter Maison</a></li>
                            </ul>
                        </div>
                        <div id="test1" class="col s12">
                            {
                                
                                Array.from(user.maisons).length
                                    ? <div className='row' style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                                        {/* <div className="row" > */}
                                            {
                                                user.maisons.map((maison, key) => <MaisonCard refresh={refresh} setSelectedMaison={setSelectedMaison} id={user.user._id} position = {key} key={key} maison={maison} />)
                                            }
                                        {/* </div> */}
                                    </div>
                                    : <div style={{ height: 'calc(100vh - 300px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <h1>
                                            Vous n'avez aucune maison enregistrée...
                                        </h1>
                                    </div>
                            }

                        </div>
                        <div id="test2" class="col s12">
                            {
                                user.location
                                    ? <LocationEnCours stopLocation={stopLocation} maison={user.location.maison} />
                                    : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 300px)' }}>
                                        <h1>Vous n'avez pas de location en cours...</h1>
                                    </div>
                            }
                        </div>
                        <div id="test3" class="container">
                            <MaisonForm refresh={refresh} id={user?user.user._id:null}/>

                        </div>
                    </div>
                    : <div style={{ height: 'calc(100vh - 140px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h1>
                            Veuillez vous connecter d'abord...
                        </h1>
                    </div>
            }
        </>
    );
};

export default UserMaison;