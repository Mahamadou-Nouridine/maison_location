/* eslint-disable jsx-a11y/alt-text */
import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom'

const Maison = ({ position, maison, setSelectedMaison, id, refresh }) => {

    const validate = async () => {
        try {
            const response = await axios.post('http://localhost:3700/maison/validate',
                {
                    maisonId: maison._id,
                    proprioId: id
                },
                {
                    headers: { 'Content-Type': 'application/json', Authorization: 'debut ' + localStorage.getItem('accessToken') },
                }
            )
            if (response.status === 200) {
                window.location.reload()
                console.log(response);
            }
        } catch (error) {
            if (error.response.status === 401) {
                refresh()
                validate()
            } else console.log(error);
        }
    }

    const deleteMaison = async () => {
        if (maison.locateurId) return alert('maison deja en location')
        if (window.confirm('Are you sure you want to delete')) {
            try {
                const response = await axios.post('http://localhost:3700/maison/delete',
                    {
                        maisonId: maison._id,
                        proprioId: id
                    },
                    {
                        headers: { 'Content-Type': 'application/json', Authorization: 'debut ' + localStorage.getItem('accessToken') }
                    }
                )
                if (response.status === 200) {
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

    return (
        <>
            <div className="card col" style={{ maxWidth: '32%', minWidth: 350, margin: 10, maxHeight: 5000 }}>
                <div  className="card-image">
                    <span style={{ width: '100%' }} class="new badge blue" data-badge-caption={`${maison.enAttente ? 'En attente' : maison.enLocation ? 'En location' : 'Pas en Location'}`}></span>
                    <img   src={`http://localhost:3700/uploads/${maison.images[0].path}`} />
                    <span className="card-title teal-text">{maison.quartier}</span>


                    <Link to={`/maisons/${position}`}>

                        <button onClick={() => { setSelectedMaison(maison); localStorage.setItem('maison', JSON.stringify(maison)) }} class="btn-floating halfway-fab waves-effect waves-light ">voir</button>
                    </Link>

                </div>
                {
                    id ?
                        <>
                            {
                                maison.proprioId === id
                                    ? <div style={{ width: 150 }}>
                                        {
                                            maison.locateurId
                                                ? <button style={{ marginRight: 12 }} className="btn-floating red disabled"><i className='material-icons'>delete</i></button>
                                                :<button onClick={deleteMaison} style={{ marginRight: 12 }} className="btn-floating red "><i className='material-icons'>delete</i></button>

                                        }
                                        {
                                            maison.enAttente
                                                ? <button onClick={validate} className="btn-floating "><i className='material-icons'>check_circle</i></button>
                                                : null
                                        }
                                    </div>
                                    : null
                            }
                        </> : null
                }
                <div className="card-content">
                    <span className="teal-text " style={{ fontSize: 15, fontWeight: 'bold' }}>{maison.price} fcfa</span>
                    <p>{maison.description}</p>
                </div>
            </div>
        </>
    );
};

export default Maison;
