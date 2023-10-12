import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import M from 'materialize-css'

import Stripe from 'react-stripe-checkout'
import { useEffect } from 'react';
import { Button, Upload } from 'antd';

export const MaisonPage = ({ maison, user, refresh, getAllMaison, setSelectedMaison }) => {
    useEffect(()=>{
        var elem = document.querySelectorAll('.modal');
        M.Modal.init(elem);
    })
    const formData = new FormData()

    const deleteMaison = async () => {
        if (maison.locateurId) return alert('maison deja en location')
        if (window.confirm('Are you sure you want to delete')) {
            try {
                const response = await axios.post('http://localhost:3700/maison/delete',
                    {
                        maisonId: maison._id,
                        proprioId: user._id
                    },
                    {
                        headers: { 'Content-Type': 'application/json', Authorization: 'debut ' + localStorage.getItem('accessToken') }
                    }
                )
                if (response.status === 200) {
                    navigate('/account')
                    refresh()

                    // setTimeout(() => window.location.reload(), 900)
                }
            } catch (error) {
                if (error.statusCode === 401) {
                    refresh()
                }
                console.log(error);
            }
        }
    }

    const navigate = useNavigate()
    const [to, setTo] = useState("")
    const handleToken = async (token) => {
        try {
            const response = await axios.post('http://localhost:3700/maison/louer',
                {
                    token: token,
                    amount: maison.price,
                    maisonId: maison._id,
                    locateurId: user._id,
                    to
                },
                {
                    headers: { 'Authorization': 'debut ' + localStorage.getItem('accessToken') },
                }
            )
            if (response.status === 200) {
                console.log("location successful");
                refresh();
                navigate('/')
                // setTimeout(()=>navigate('/'), 1000)
                getAllMaison();
                alert('Location effectué avec succès')
            }
        } catch (err) {
            console.log(err);
        }
        console.log(token);
    }

    const edit = async (imageId, add) => {
        if (add) {
            if (!formData.getAll('maison').length) {
                return alert('veuillez ajoutez des image d\'abord')
            }
        }
        formData.set('maisonId', maison._id)
        formData.set('proprioId', user._id)
        formData.set('add', add)
        formData.set('imageId', imageId)
        try {
            const response = await axios.post('http://localhost:3700/maison/edit',
                formData,
                {
                    headers: { 'Content-Type': 'application/json', Authorization: 'debut ' + localStorage.getItem('accessToken') },
                }
            )
            if (((response.status === 200) && add)) {
                localStorage.setItem('maison', JSON.stringify(response.data[0]))
                setSelectedMaison(response.data[0])
                refresh()
                console.log(response);
            } else {
                localStorage.setItem('maison', JSON.stringify(response.data[0]))
                setSelectedMaison(response.data[0])
                // navigate('/account')
                refresh()
                console.log(response);
                // setTimeout(() =>window.location.reload(), 900)
            }
        } catch (error) {
            if (error.response.status === 401) {
                refresh()
                edit()
            } else console.log(error);
        }
    }

    return (
        <>



            <div style={{ marginTop: 100 }}>


                <div className="row center" style={{ maxWidth: '90%' }}>
                    {
                        maison.images
                            ? <>
                                {
                                    maison.images.map((item, key) => (
                                        <div key={key} className="col s12 m3" style={{ maxWidth: '24%', minWidth: 200 }}>
                                            <img src={`http://localhost:3700/uploads/${item.path}`} alt="" style={{ width: '100%' }} />
                                            {
                                                user
                                                    ? <>
                                                        {
                                                            user._id == maison.proprioId
                                                                ? <button onClick={() => edit(item._id, false)} className='red btn' style={{ width: '100%', height: 20, position: 'relative', top: -5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                    <span class="material-icons">
                                                                        clear
                                                                    </span>
                                                                </button>
                                                                : null
                                                        }
                                                    </>
                                                    : null
                                            }
                                        </div>

                                    ))
                                }

                            </>
                            : <div>la maison n'a aucune photo</div>
                    }

                </div>
                {
                    user
                        ? <>
                            {
                                user._id == maison.proprioId
                                    ? <div className='' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                                        <button className='btn btn-floating modal-trigger waves-effect' href="#modal1">
                                            <i class="material-icons">
                                                add
                                            </i>
                                        </button>
                                    </div>
                                    : null
                            }
                        </>
                        : null
                }

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
                <div>
                    <div className="row" style={{ maxWidth: '90%' }}>
                        <div className="col s12 m6 center-align">
                            <div className="row teal " style={{ maxWidth: '99%' }}>
                                <i className="material-icons large">
                                    mail
                                </i>
                            </div>
                            <div className="row" style={{ maxWidth: '99.9%', marginTop: -15 }}>
                                <div className="left-align collection" >
                                    <div className="row collection-item valign-wrapper teal-text" >
                                        <h6 style={{ fontWeight: 'bold' }}>{maison.price} FCFA</h6>
                                    </div>
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

                            {
                                user
                                    ? <>
                                        {
                                            user._id == maison.proprioId
                                                ? <>
                                                    <h5 style={{ maxWidth: '99%' }}>Statut de location</h5>
                                                    <div style={{ maxWidth: '99.9%' }}>

                                                        {
                                                            maison.enAttente

                                                                ? <div className="teal center" style={{ width: 150, padding: 1, borderRadius: 10 }}>
                                                                    En attente de votre validation
                                                                </div>

                                                                : maison.enLocation
                                                                    ? <div className="teal center" style={{ width: 130, padding: 1, borderRadius: 10 }}>
                                                                        Deja en Locataion
                                                                    </div>
                                                                    : <>
                                                                        <div className="teal center" style={{ width: 130, padding: 1, borderRadius: 10 }}>
                                                                            Pas en location
                                                                        </div>
                                                                        <button onClick={deleteMaison} className="red btn-floating" style={{ marginTop: 20 }}>
                                                                            <i className='material-icons'>delete</i>
                                                                        </button>

                                                                    </>
                                                        }

                                                    </div>
                                                </>
                                                : <>
                                                    {
                                                        !user.location
                                                            ? <>
                                                                <h5 style={{ maxWidth: '99%' }}>Louer cette Maison</h5>
                                                                <div style={{ maxWidth: '99.9%' }}>

                                                                    {
                                                                        !maison.enAttente && !maison.enLocation

                                                                            ? <>
                                                                                <form action="">
                                                                                    <div class="input-field" >
                                                                                        <input value={to} onChange={(e) => setTo(e.target.value)} id="to" type="date" class="validate" />
                                                                                        <label for="to">jusqu'à</label>
                                                                                    </div>
                                                                                </form>
                                                                                {
                                                                                    to
                                                                                        ? <Stripe
                                                                                            token={handleToken}
                                                                                            stripeKey='pk_test_51Lme52JXfDLyXNrq0YN7SQiOmPNaMW6zrA3BkeGuWe0KW2weRNmnjoNAk8yyD0cDC3dcHkCLB6NFrQ3arjasoX9W00tkZtSKyY'
                                                                                        /> : null
                                                                                }
                                                                            </>

                                                                            : <div className="teal center" style={{ width: 130, padding: 1, borderRadius: 10 }}>
                                                                                Deja en Locataion
                                                                            </div>
                                                                    }
                                                                </div>
                                                            </>
                                                            : <>
                                                                <h5 style={{ maxWidth: '99%' }}>Vous avez deja une location en cours</h5>
                                                                <div style={{ maxWidth: '99.9%' }}></div>
                                                            </>
                                                    }
                                                </>
                                        }
                                    </>
                                    : <>
                                        <h5 style={{ maxWidth: '99%' }}>Louer cette Maison</h5>

                                        <div className="teal center" style={{ width: 130, padding: 1, borderRadius: 10 }}>
                                            veuillez vous connecter d'abord
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                </div>




            </div>

            <div id="modal1" className="modal">
                <div class="modal-content">
                    <Upload.Dragger
                        multiple={true}
                        listType='picture-card'
                        showUploadList={{

                        }}
                        action={'http://localhost:3300'}
                        beforeUpload={(file, files) => {
                            // setImages([...images, file])
                            formData.append('maison', file)
                            console.log(formData.getAll('maison'))
                            files = null
                            return false
                        }}
                        onRemove={(file) => {
                            formData.getAll('maison').forEach(item => {
                                // eslint-disable-next-line eqeqeq
                                if (item.uid == file.uid) {
                                    formData.delete(item)
                                }
                            })
                            console.log(formData.getAll('maison'));
                        }}
                        style={{ marginTop: 20 }}
                    >

                        <div className=' valign-wrapper ' style={{ height: '150px', width: '100%', border: 'dashed grey 3px', borderRadius: '30px', padding: 10, marginBottom: 50 }}>
                            <p>drag files here or click</p>
                            <Button className='btn' style={{ margin: 3 }}>Click upload</Button>
                        </div>
                    </Upload.Dragger>
                </div>
                <div class="modal-footer">
                    <button onClick={() => edit(null, true)} class="modal-close waves-effect waves-green btn-flat teal">Ajouter Photo(s)</button>
                </div>
            </div>
        </>
    );
};

export default MaisonPage
