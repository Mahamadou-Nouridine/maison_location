/* eslint-disable jsx-a11y/anchor-is-valid */
import logo from './logo.svg';
import { useState } from 'react'
import './App.css';
import axios from 'axios'
import Home from './components/Home';
import MaisonPage from './components/maison/MaisonPage';
import UserMaison from './components/maison/UserMaison';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Maisons from './components/maison/Maisons';
import { useEffect } from 'react';
import M from 'materialize-css'



function App() {


  const [selectedMaison, setSelectedMaison] = useState({})
  const [user, setUser] = useState(null)
  const [connexion, setConnexion] = useState(true)
  const [inMail, setInMail] = useState("")
  const [inPass, setInPass] = useState("")
  const [maisons, setMaisons] = useState([])


  const [nom, setNom] = useState("")
  const [upMail, setUpMail] = useState("")
  const [upPass, setUpPass] = useState("")
  const [confirm, setConfirm] = useState("")

  useEffect(()=>{
    if(JSON.parse(localStorage.getItem('maison'))) setSelectedMaison(JSON.parse(localStorage.getItem('maison')))
    
    // localStorage.setItem('maison', JSON.stringify(selectedMaison))
  },[])

  const getAllMaison = () => {
    try {
      axios.get('http://localhost:3700/maison')
        .then(response => {
          setMaisons(Object(response.data).maisons)
          console.log(Object(response.data).maisons);
          return (response.data).maisons
        }).then(maisons => console.log(maisons))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    var elem = document.querySelectorAll('.modal');
    M.Modal.init(elem);
    var el = document.querySelectorAll('.tabs');
    M.Tabs.init(el)
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
    getAllMaison()
    setTimeout(() => console.log(maisons), 1000);
  }, [])

  const signUp = async () => {

    if (!upPass || !confirm || !upMail || !nom) {
      alert("veuiller remplir tous les champs")
    } else if (upPass !== confirm) {
      alert("les mots ed pass ne correspondent pas")
    } else {
      try {
        const respo = await axios.post('http://localhost:3700/user/new',
          {
            password: upPass,
            email: upMail,
            nom: nom
          },
          {
            headers: { "Content-Type": "application/json" }
          }
        )

        if (respo.status === 200) alert("user created successfully please sign in");
        setUpMail('')
        setUpPass('')
        setNom('')
        setConfirm('')
      } catch (error) {
        if(error.response.status === 409) alert('user Already exists')
        setUpMail('')
        setUpPass('')
        setNom('')
        setConfirm('')
      }
    }
  }


  const login = async () => {
    if (!inMail || !inPass) {
      alert('Renseigner toutes les informations')
    } else {
      try {
        const response = await axios.post('http://localhost:3700/auth',
          {
            password: inPass,
            email: inMail
          },
          {
            headers: {
              'Access-Control-Allow-Credentials': true
            },
            withCredentials: true
          }
        )


        const data = response.data;
        localStorage.setItem('accessToken', data.accessToken)
        setInMail('')
        setInPass('')
        setUser(data)
        console.log(data)
      } catch (error) {
        if(error.response.status === 401) alert('email ou mot de pass incorrect')
        console.log(error)
        setInMail('')
        setInPass('')
      }
    }
  }

  const refresh = async () => {
    try {
      const response = await axios.get('http://localhost:3700/auth/refresh',
        {
          withCredentials: true
        })
      const data = await Object(response.data);
      if (data) {
        setUser(data)
        console.log((data));
        localStorage.setItem('accessToken', data.accessToken)
      }
    } catch (error) {
      alert("votre session a expiré vueillez vous connecter")
      setUser(null)
      console.log(error);
    }
  }

  const stopLocation = async () => {
    if (window.confirm('Êtes vous sûr de vouloir arrêter la location')) {
      try {
        const response = await axios.post('http://localhost:3700/maison/stop',
          {
            userId: user.user._id
          },
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `debut ${localStorage.getItem('accessToken')}`
            }
          }
        )

        if (response.status === 200) {
          alert("location arrêté avec succès")
          refresh()
          getAllMaison()
        }
      } catch (error) {
        if (error.response.status === 401) {
          refresh()
        }
      }
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const logOut = async()=>{
    try {
      const response = await axios.get('http://localhost:3700/auth/logout',
      {
        withCredentials: true
      }
      )
      if(response.status === 200||response.status === 204) {
        refresh()
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <BrowserRouter>
        <nav className="teal" style={{ padding: ' 0px 10px', position: 'absolute', zIndex: 100, top: 0 }}>
          <div className="nav-wrapper">
            <a onClick={refresh} className="brand-logo">Location de maison</a>

            <a className="sidenav-trigger " data-target="mobile-nav"><i className="material-icons">menu</i></a>


            <ul className="right hide-on-med-and-down">
              <li>
                <Link to='/'>Accueill</Link>
              </li>
              <li>
                <Link to='/maisons'>Maisons</Link>
              </li>
              <li>
                <Link className='grey lighten-1' to='/account'><i className='material-icons large center-align'>person</i></Link>
                {
                  !user
                    ? <button className='btn waves-effect waves-light btn modal-trigger' href="#modal">se connecter</button>
                    : <div className="grey lighten-2" style={{ width: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                      <p className='teal-text'>{user.user.nom}</p>
                      <button onClick={logOut} className="btn-floating" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <span class="material-icons">logout</span></button>
                    </div>
                }
              </li>
            </ul>
          </div>
        </nav>
        <ul className="sidenav " id="mobile-nav">
          <li><Link to='/'>Accueill</Link></li>
          <li><Link to='/maisons'>Maisons</Link></li>
          <li><Link to='/account'><i className='material-icons large center-align'>person</i></Link> <a className='btn waves-effect waves-light btn modal-trigger' href="#modal">se connecter</a> </li>
        </ul>

        <Routes>
          <Route path="/" element={<Home refresh={refresh} user={user?user.user:null} setSelectedMaison={setSelectedMaison} maison={selectedMaison} maisons={maisons} />} />
          <Route path="/account" element={<UserMaison refresh={refresh} setSelectedMaison={setSelectedMaison} stopLocation={stopLocation} user={user} />} />
          <Route path="/maisons" element={<Maisons refresh= {refresh} id={user?user.user._id:null} setSelectedMaison={setSelectedMaison} maisons={maisons} />} />
          <Route path="/maisons/:id" element={<MaisonPage setSelectedMaison={setSelectedMaison} getAllMaison={getAllMaison} refresh={refresh} user={user ? user.user : null} maison={JSON.parse(localStorage.getItem('maison'))?JSON.parse(localStorage.getItem('maison')):selectedMaison} />} />
        </Routes>
      </BrowserRouter>

      <div style={{ position: 'relative', bottom: 0, width: '100%' }} className="page-footer teal">
        <div className="footer-copyright valign-center" >
          <p className="" style={{ margin: 'auto', height: 100 }}>Location de Maison © 2019</p>
        </div>
      </div>





      {/* modal */}
      <div id="modal" class="modal">
        <div class="modal-content">
          <div class="row">
            <div class="col s12">
              <ul class="tabs">
                <li onClick={() => setConnexion(true)} class="tab col s3"><a class="active" href="#testi1">Se connecter</a></li>
                <li onClick={() => setConnexion(false)} class="tab col s3"><a href="#testi2">S'inscrire</a></li>
              </ul>
            </div>
            <div id="testi1" class="col s12">
              <div class="row">
                <form class="col s12">
                  <div class="row">
                    <div class="input-field col s12">
                      <i class="material-icons prefix">email</i>
                      <input value={inMail} onChange={(e) => setInMail(e.target.value)} id="icon_prefix" type="email" class="validate" />
                      <label for="icon_prefix">Email</label>
                    </div>
                  </div>

                  <div class="row">
                    <div class="input-field col s12">
                      <i class="material-icons prefix">lock</i>
                      <input value={inPass} onChange={(e) => setInPass(e.target.value)} id="icon_prefix" type="password" class="validate" />
                      <label for="icon_prefix">mot de passe</label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div id="testi2" class="col s12 valign-" >
              <div class="row">
                <form class="col s12">

                  <div class="row">
                    <div class="input-field col s12">
                      <i class="material-icons prefix">account_circle</i>
                      <input value={nom} onChange={(e) => setNom(e.target.value)} id="icon_prefix" type="text" class="validate" />
                      <label for="icon_prefix">Nom</label>
                    </div>
                  </div>
                  <div class="row">
                    <div class="input-field col s12">
                      <i class="material-icons prefix">email</i>
                      <input value={upMail} onChange={(e) => setUpMail(e.target.value)} id="icon_prefix" type="text" class="validate" />
                      <label for="icon_prefix">Email</label>
                    </div>
                  </div>

                  <div class="row">
                    <div class="input-field col s12">
                      <i class="material-icons prefix">lock</i>
                      <input value={upPass} onChange={(e) => setUpPass(e.target.value)} id="icon_prefix" type="password" class="validate" />
                      <label for="icon_prefix">mot de passe</label>
                    </div>
                  </div>
                  <div class="row">
                    <div class="input-field col s12">
                      <i class="material-icons prefix">lock</i>
                      <input value={confirm} onChange={(e) => setConfirm(e.target.value)} id="icon_prefix" type="password" class="validate" />
                      <label for="icon_prefix">confirmer</label>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
        <div class="modal-footer">
          <a href="#!" class="modal-close waves-effect waves-green btn-flat">annuler</a>
          <a onClick={connexion ? login : signUp} href="#!" class="modal-close waves-effect waves-green btn-flat">{connexion ? 'connexion' : 's\'enregistrer'}</a>
        </div>
      </div>

    </>
  );
}

export default App;
