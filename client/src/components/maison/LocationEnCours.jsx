import React from 'react';
import mainUrl from '../../mainUrl';

const LocationEnCours = ({ maison, stopLocation }) => {
    return (
        <>
            <div className='' style={{ marginTop: 100, }}>


                <div className="row center" style={{ maxWidth: '90%', margin: 'auto' }}>
                    {
                        maison.images.map((image, index) => (
                            <div className="col s12 m3" style={{ maxWidth: '100%' }}>
                                <img src={`${mainUrl}/uploads/${image.path}`} alt="" style={{ width: '100%' }} />
                            </div>
                        ))
                    }
                </div>

                <div className=" white-text center-align" style={{ with: '', margin: 'auto' }}>
                    <div >
                        <div className="row center-align" style={{ display: 'flex', justifyContent: 'space-around' }}>
                        {
                                maison.piscine && <div className='card col black-text ' style={{ margin: 1 }}>
                                    <div><i class="fas fa-swimming-pool medium"></i></div>
                                    <h5>Piscine</h5>
                                </div>
                            }
                            {
                                maison.terrasse && <div className='card col black-text ' style={{ margin: 1 }}>
                                    <div><i className=" material-icons medium">balcony</i></div>
                                    <h5>Terrasse</h5>
                                </div>
                            }
                            {
                                maison.annexe && <div className='card col black-text ' style={{ margin: 1 }}>
                                    <div><i className=" material-icons medium">other_houses</i></div>
                                    <h5>Annexe</h5>
                                </div>
                            }
                            {
                                maison.wifi && <div className='card col black-text ' style={{ margin: 1 }}>
                                    <div><i className=" material-icons medium">wifi</i></div>
                                    <h5>Wifi</h5>
                                </div>
                            }
                            {
                                maison.jardin && <div className='card col black-text ' style={{ margin: 1 }}>
                                    <div><i className=" material-icons medium">yard</i></div>
                                    <h5>Jardin</h5>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div style={{ margin: 'auto' }}>
                    <div className="row" style={{ maxWidth: '90%', margin: 'auto' }}>
                    <div className="col s12 m6 center-align">
                            <div className="row teal " style={{ maxWidth: '99%' }}>
                                <i className="material-icons large">
                                    mail
                                </i>
                                <h4>Contact us for Booking</h4>
                            </div>
                            <div className="row" style={{ maxWidth: '99.9%', marginTop: -15 }}>
                                <div className="left-align collection" >
                                    <div className="row collection-item valign-wrapper" style={{ maxWeight: 40 }}>
                                        <h6>{maison.region}</h6>
                                    </div>
                                    <div className="row collection-item valign-wrapper" style={{ maxWeight: 40 }}>
                                        <h6>{maison.quartier}</h6>
                                    </div>
                                    <div className="row collection-item valign-wrapper" style={{ maxWeight: 40 }}>
                                        <h6>{maison.contact}</h6>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col s12 m6 grey lighten-3">
                            <h5 style={{ maxWidth: '99%' }}>Arrêter la Location</h5>
                            <div style={{ maxWidth: '99.9%' }}>
                                <button onClick={()=>{stopLocation()}} className='btn-floating red' style={{ width: 50, height: 50 }} ><i className="material-icons medium" >cancel</i> </button>
                            </div>
                        </div>
                    </div>
                </div>




            </div>
        </>
    );
};

export default LocationEnCours;
