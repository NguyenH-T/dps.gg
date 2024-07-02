import { useState, useEffect,useContext } from "react";
import './Menu.css';
import Weapon from './components/WeaponObject';
import { AllTilesContext,AllTilesDispatchContext } from './components/data';



function LoginPopup({ setShowPopup, finishLogin }) {

  const handleOpen = async () => {
    window.open("https://www.bungie.net/en/OAuth/Authorize?client_id=45822&response_type=code");
    window.close();
  }
 
  const loginPromptText = (
    <>
      <p className="PopupText">
        In order for us to pull from your loadout we will need you to login with your Bungie Account through their portal.
      </p>
      <p className="PopupText">
        If you would prefer not to pull from your loadout you can instead spawn in gear from our Loadouts tab.
      </p>
      <p className="PopupText">
        Finally if you have been given a share code you can instead paste that code below and we will handle the rest
      </p>
    </>
  )

  const finishPromptText = (
    <>
      <p className="PopupText">
        Thank you for logging in! You can now pull your inventory by clicking on the loadout tab at the top.
      </p>
    </>
  )

  return (
    <>
      <div className="LoginPopupContainer">
        <button className="ButtonClose" onClick={() => { setShowPopup(false) }}>
          X
        </button>
        <div className="PopupTextContainer">
          {finishLogin ? finishPromptText : loginPromptText}
        </div>
        <div className="ButtonContainer">
          {finishLogin ? null : 
          <button className='ButtonLogin' onClick={handleOpen}>
            Login
          </button>
          }
        </div>
      </div>
      <div className="LoginPopupBackground" onClick={() => { setShowPopup(false) }} />
    </>
  )
}

export default function Menu() {
  let currLoadout = new Array(3);
  let kineticWeapon = new Weapon("Default Primary", 1, 6, 1, 1, 1600, 500, 30, 60, 75,-1)
  let energyWeapon = new Weapon("Default Special", 3, 9, 2, 1, 1600, 50, 6, 40, 45,-1)
  let heavyWeapon = new Weapon("Default Heavy", 7, 3, 3, 1, 1600, 30, 1, 50, 50,-1)
  const AllTilesDispatch = useContext(AllTilesDispatchContext);
  let AllTiles = useContext(AllTilesContext)
  const [showPopup, setShowPopup] = useState(false)
  const [finishLogin, setFinishLogin] = useState(false)
  useEffect(() => {
    var currentWeaponArray = AllTiles.get(0).currState.weaponArr
    if(currentWeaponArray.length === 0){
    currLoadout[0] = kineticWeapon
    currLoadout[1] = energyWeapon
    currLoadout[2] = heavyWeapon
    AllTilesDispatch({type: "change-origin", givenLoadout: currLoadout})
    }
    else{
      currLoadout[0] = currentWeaponArray[0]
      currLoadout[1] = currentWeaponArray[1]
      currLoadout[2] = currentWeaponArray[2]
    }
  })
  let RandomItem = ""

  const getToken = async () => {
    const response = await fetch("/login", {
      headers: {
        'code': sessionStorage.getItem('code')
      }
    });
    const data = await response.json();
    RandomItem = data
    if (typeof RandomItem === 'undefined' === false) {
      sessionStorage.setItem('MID', RandomItem)
    }
  };

  const loadToken = async () => {
    var url = window.location.href;
    url = url.split('?');
    var code = "";
    if (url.length > 1 && sessionStorage.getItem('gotToken') !== 'true') {
      code = url[1].substring(url[1].indexOf("=") + 1);
      sessionStorage.setItem('code', code)
      await fetch(`registerUser?code=${code}`);
      while (sessionStorage.getItem('MID') === null) {

        await getToken();

      }
      sessionStorage.setItem('gotToken', true);
      console.log(window.location.origin + window.location.pathname);
      window.open(window.location.origin + window.location.pathname);

    }
    else {
      if (sessionStorage.getItem('MID') != null) {
        setFinishLogin(true)
      }
    }
  }

  useEffect(() => {
    loadToken();
  });

  async function handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const text = formData.get('codetext') ?? ""


    
    if(text !== ""){
    var weaponList = text.split("&")
    getWeapon(0,weaponList).then(function(response){
      if(typeof response["name"] != 'undefined'){
      currLoadout[0] = new Weapon(response["name"], response["damageType"].replaceAll("\"",""), response["itemSubType"].replaceAll("\"",""), response["ammoType"], 1, response["stats"]["1480404414"]["value"], response["stats"]["4284893193"]["value"], response["stats"]["3871231066"]["value"], response["stats"]["4188031367"]["value"], response["stats"]["943549884"]["value"],response["itemHash"])
      }
      getWeapon(1,weaponList).then(function(response)
      {
        if(typeof response["name"] != 'undefined'){
        currLoadout[1] = new Weapon(response["name"], response["damageType"].replaceAll("\"",""), response["itemSubType"].replaceAll("\"",""), response["ammoType"], 1, response["stats"]["1480404414"]["value"], response["stats"]["4284893193"]["value"], response["stats"]["3871231066"]["value"], response["stats"]["4188031367"]["value"], response["stats"]["943549884"]["value"],response["itemHash"])
        }
        getWeapon(2,weaponList).then(function(response){
          console.log(response)
          if(typeof response["name"] != 'undefined')
          currLoadout[2] = new Weapon(response["name"], response["damageType"].replaceAll("\"",""), response["itemSubType"].replaceAll("\"",""), response["ammoType"], 1, response["stats"]["1480404414"]["value"], response["stats"]["4284893193"]["value"], response["stats"]["3871231066"]["value"], response["stats"]["4188031367"]["value"], response["stats"]["943549884"]["value"],response["itemHash"])
          AllTilesDispatch({type: "change-origin", givenLoadout: currLoadout})
        })
      })
    })
  }
}

  function getWeapon(index,weaponList){
    var currentWeapon
    var weaponParse
    if(weaponList[index]!=="0"){
    currentWeapon = parseInt(weaponList[index], 16);
    return getWeaponInfo(currentWeapon).then(
      function(response){
      return getWeaponStats(currentWeapon).then(
        function(response){
          return getWeaponInfo(currentWeapon).then(
            function(response){
              weaponParse = response
              return weaponParse
            }).catch(error => {return {}})
        }).catch(error => {return {}})
    }).catch(error => {return {}})
    }else{
      return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({});
        }, 1);
    });
    }
  }
  function getWeaponInfo(hash)
  {
    return fetch("/getItemInfo",{headers : {
      'iid': hash
    }}).then(function(response)
    {
      return response.json()
    }
    ).then(function(data)
    {
      return data
    }).catch(error => {return {}})
  

  }
  function getWeaponStats(hash)
  {
  
    return fetch("/getItemStats",{headers : {
      'iid': hash
    }}).then(function(response)
    {
      return response.json()
    }
    ).then(function(data)
    {
      return data
    }).catch(error => {return {}})
  
  
  }

  return (
    <div className="FrontPage">
      <div className="TitleContainer">
        <h3>
          First time here?
        </h3>
        <button className="GetStartedButton" onClick={() => { setShowPopup(true) }}>
          Get Started
        </button>
      </div>
      <hr className="TitleDivider" />
      <div className="CodeTextContainer">
        <h3 style={{ textAlign: 'left', marginTop: '3%' }}>
          Import from share code :
        </h3>
        <form style={{ margin: '0', height: '500px' }} onSubmit={handleSubmit}>
          <textarea className="CodeTextArea" name="codetext" />
          <button className="CodeSubmitButton" type="submit">
            Import
          </button>
        </form>
      </div>
      {showPopup ? <LoginPopup setShowPopup={setShowPopup} finishLogin={finishLogin} /> : null}
    </div>
  );
}