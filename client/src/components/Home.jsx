import React, { useEffect } from 'react';
import Maison from './maison/MaisonCard';
import { useNavigate } from 'react-router-dom'
import M from 'materialize-css';



const Home = ({ maisons, setSelectedMaison, user, refresh }) => {

    useEffect(() => {

        var elems = document.querySelectorAll('.slider');
        M.Slider.init(elems);

        var elems1 = document.querySelectorAll('.modal');
        M.Modal.init(elems1);
    }, [])

    const navigate = useNavigate();

    return (
        <>

            <div className='row' style={{ height: '100vh', }}>
                <div className="slider fullscreen" style={{ marginTop: 65 }}>
                    <ul className="slides">
                        <li>
                            <img src="https://a0.muscache.com/im/pictures/miso/Hosting-5264493/original/10d2c21f-84c2-46c5-b20b-b51d1c2c971a.jpeg?im_w=1200"
                                alt="" />
                            <div className="caption center-align">
                                <h3>take your dream vaccation</h3>
                                <h5 className="light grey-text text-lighten-2">Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                                    Perspiciatis dicta veniam illo odio qui eni</h5>

                            </div>
                        </li>
                        <li>
                            <img src="https://a0.muscache.com/im/pictures/miso/Hosting-5264493/original/bc9fdbba-a126-4357-946b-4d5f5581ca0f.jpeg?im_w=1440"
                                alt="" />
                            <div className="caption left-align">
                                <h3>We work with all budgets</h3>
                                <h5 className="light grey-text text-lighten-2">Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                                    Perspiciatis dicta veniam illo odio qui eni</h5>

                            </div>
                        </li>
                        <li>
                            <img src="https://a0.muscache.com/im/pictures/miso/Hosting-5264493/original/858b29eb-53f3-4707-87a6-444f4375f888.jpeg?im_w=1440"
                                alt="" />
                            <div className="caption right-align">
                                <h3>Groups and individual Gateways</h3>
                                <h5 className="light text-grey test-lighten-2">Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                                    Perspiciatis dicta veniam illo odio qui eni</h5>

                            </div>
                        </li>
                    </ul>
                </div>

            </div>

            <div className='row' style={{ marginTop: 100, position: 'relative', }}>


                <div className="row teal " style={{ marginTop: -30 }}>
                    <div className="row  lighten-3" style={{ maxWidth: 1000 }}>
                        <h3 className="center-align text-white">Search Destinations</h3>
                        <div className="input-field">
                            <input type="search" id="autocomplete" className="autocomplete white" placeholder="Niamey, Maradi, etc..." />
                        </div>
                    </div>
                </div>
                <div className="row grey lighten-5 " style={{ display: 'flex', justifyContent: 'center', padding: 20, marginTop: -20 }}>
                    <div className="row center-align"
                        style={{ maxWidth: '90%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>

                        <div className="card" style={{ maxWidth: '32%', minWidth: 350 }}>
                            <div className="card-content ">
                                <i className="material-icons large">location_on</i>
                                <h4>Pick Where</h4>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                            </div>
                        </div>

                        <div className="card" style={{ maxWidth: '32%', minWidth: 350, marginLeft: 20, marginRight: 20 }}>
                            <div className="card-content">
                                <i className="material-icons large">
                                    store_mall_directory
                                </i>
                                <h4>Travel Shop</h4>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                            </div>
                        </div>

                        <div className="card " style={{ maxWidth: "32%", minWidth: 350 }}>
                            <div className="card-content ">
                                <i className="material-icons large">flight</i>
                                <h4>Fly Cheap</h4>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="row"
                    style={{ display: 'flex', justifyContent: 'center', padding: 20, marginTop: -20, flexDirection: 'column' }}>
                    <h3 className="center-align"><span className="teal-text">Popular</span> Places</h3>
                    <div className="row"
                        style={{ maxWidth: '90%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', padding: 20 }}>

                        {
                            
                            maisons.slice(0,3).map((item, key) => <Maison refresh={refresh} id={user?user._id:null} setSelectedMaison={setSelectedMaison} maison={item} key={key} position={key} />)
                        }



                    </div>
                    <button onClick={() => navigate('/maisons')} href="" className="btn  waves-effect grey darken-4 waves-light valign-wrapper" style={{ width: 300, margin: 'auto' }}><i className="material-icons">
                        send
                    </i>Voir plus</button>
                </div>

            </div>
        </>
    );

}

export default Home;