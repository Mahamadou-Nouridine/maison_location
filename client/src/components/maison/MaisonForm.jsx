import React, { useState } from 'react';
import { Upload, Button, Alert } from 'antd'
import axios from 'axios';
import mainUrl from '../../mainUrl';


const MaisonForm = ({id, refresh}) => {
    const formData = new FormData();
    const [quartier, setQuartier] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState(0)
    const [chambres, setChambre] = useState(0)
    const [annexe, setAnnexe] = useState(false)
    const [jardin, setJardin] = useState(false)
    const [piscine, setPiscine] = useState(false)
    const [wifi, setWifi] = useState(false)
    const [terrasse, setTerrasse] = useState(false)
    const [region, setRegion] = useState("")
    const [contact, setContact] = useState("")

    const handleSubmit = async () => {

        if (!quartier || !description || !price || !chambres || !formData.getAll('maison').length || !region || !contact) {
            console.log(quartier, description, price, chambres, formData.getAll('maison').length, region, contact);
            alert("veuillez remplir tous les champs")
        } else {
            formData.set('quartier', quartier)
            formData.set('region', region)
            formData.set('contact', contact)
            formData.set('description', description)
            formData.set('price', price)
            formData.set('chambres', chambres)
            formData.set('annexe', annexe)
            formData.set('jardin', jardin)
            formData.set('piscine', piscine)
            formData.set('wifi', wifi)
            formData.set('terrasse', terrasse)
            formData.set('proprioId', id)

            try {
                const sent = await axios.post(mainUrl + '/maison/create',
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            authorization: `debut ${localStorage.getItem('accessToken')}`
                        },
                        withCredentials: true
                    }
                )
                if (sent.status === 200) {
                    setTimeout(()=>{
                        window.location.reload()
                    }, 1000)
                }
                console.log(sent.status);
            } catch (error) {
                if(error.statusCode === 401) {
                    refresh()
                    handleSubmit()
                }
                console.log(error);
            }
        }


    }

    return (
        <>
            <div className="row ">
                <div className="col m6 s12">
                    <div class="row" style={{ width: '100%' }}>
                        <form class="col s12">
                            <div class="row">
                                <div class="input-field" >
                                    <input value={quartier} onChange={(e) => setQuartier(e.target.value)} id="quartier" type="text" class="validate" />
                                    <label for="quartier">Quartier</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input value={description} onChange={(e) => setDescription(e.target.value)} id="Description" type="text" class="validate" />
                                    <label for="Description">Description</label>
                                </div>
                            </div>

                            <div class="row">
                                <div class="input-field col s12">
                                    <input value={region} onChange={(e) => setRegion(e.target.value)} id="region" type="text" class="validate" />
                                    <label for="region">Region</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input value={contact} onChange={(e) => setContact(e.target.value)} id="contact" type="text" class="validate" />
                                    <label for="contact">Contact</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input min={0} value={chambres} onChange={(e) => setChambre(e.target.value)} id="Nbre Chambres" type="number" class="validate" />
                                    <label for="Nbre Chambres">Nbre Chambres</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input min={0} value={price} onChange={(e) => setPrice(e.target.value)} id="Price" type="number" class="validate" />
                                    <label for="Price">Price</label>
                                </div>
                            </div>
                            <p>
                                <label>
                                    <input value={annexe} onChange={(e) => setAnnexe(e.target.checked)} type="checkbox" />
                                    <span>chambre annexe</span>
                                </label>
                            </p>
                            <p>
                                <label>
                                    <input value={jardin} onChange={(e) => setJardin(e.target.checked)} type="checkbox" />
                                    <span>Jardin</span>
                                </label>
                            </p>
                            <p>
                                <label>
                                    <input value={piscine} onChange={(e) => setPiscine(e.target.checked)} type="checkbox" />
                                    <span>piscine</span>
                                </label>
                            </p>
                            <p>
                                <label>
                                    <input value={wifi} onChange={(e) => setWifi(e.target.checked)} type="checkbox" />
                                    <span>wifi</span>
                                </label>
                            </p>
                            <p>
                                <label>
                                    <input value={terrasse} onChange={(e) => setTerrasse(e.target.checked)} type="checkbox" />
                                    <span>terrasse</span>
                                </label>
                            </p>
                        </form>
                    </div>
                </div>
                <div className="col m6 s12" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                            console.log(files);
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

                        <div className=' valign-wrapper ' style={{ height: '150px', width: '100%', border: 'dashed grey 3px', borderRadius: '30px', marginBottom: 100, padding: 10 }}>
                            <p>drag files here or click</p>
                            <Button className='btn' style={{ margin: 3 }}>Click upload</Button>
                        </div>
                    </Upload.Dragger>
                </div>
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <button onClick={handleSubmit} className="btn">Envoyer</button>
            </div>
        </>
    );
};

export default MaisonForm;
