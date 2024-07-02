const express = require('express');
const app = express();
var tokens = {}
var dataDict = {}
dataDict[-1] = {}
dataDict[-1]["inventory"] = {}
var itemTypes={
  2: "Armor",
  3: "Weapon"
}
var itemSubTypes = 
{
  6: "AutoRifle",
  7: "Shotgun",
  8: "Machinegun",
  9: "HandCannon",
  10: "RocketLauncher",
  11: "FusionRifle",
  12: "SniperRifle",
  13: "PulseRifle",
  14: "ScoutRifle",
  17: "Sidearm",
  18: "Sword",
  22: "FusionRifleLine",
  23: "GernadeLauncher",
  24: "SubmachineGun",
  25: "TraceRifle",
  26: "HelmetArmor",
  27: "GauntletsArmor",
  28: "ChestArmor",
  29: "LegArmor",
  30: "ClassArmor",
  31: "Bow",
  33: "Glaive"
}
var damageTypes = 
{
0: "None",
1: "Kinetic",
2: "Arc",
3: "Thermal",
4: "Void",
5: "Raid",
6: "Statis",
7: "Strand" 
}
var returnVal;
var gettingUserData = false;
const api_key = ;
/**
 * Attempts to authorize the user with Bungie's API
 * @param {*} code the key to Bungie's API
 * @param {*} counter limits attempts of failure
 */
  async function asyncRegisterUser(code,counter)
  {    
    if(typeof returnVal==='undefined' || typeof returnVal.error !== undefined){
    await fetch('https://www.bungie.net/Platform/App/OAuth/Token/', {
      method: 'POST',
      headers: {
        'X-API-Key': `${api_key}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': ``
      },
      body: new URLSearchParams({
        'client_id': "45822",
        'grant_type': "authorization_code",
        'code': code.toString()
      }).toString()
    }).then(function(response) {
      return response.json();
    })
    .then(function(data) {
      returnVal = data;
        if(typeof returnVal.error === 'undefined'){
        time = Date.now()
      tokens[returnVal.membership_id] = {}
      tokens[returnVal.membership_id]["access_token"] = returnVal.access_token
      tokens[returnVal.membership_id]["access_token_expires"] = returnVal.expires_in + Date.now()
      tokens[returnVal.membership_id]["refresh_token"] = returnVal.refresh_token
      tokens[returnVal.membership_id]["refresh_token_expires"] = returnVal.refresh_expires_in + Date.now()
      tokens[returnVal.membership_id]["code"] = code
      dataDict[returnVal.membership_id] = {}
      return asyncGetUser(returnVal.membership_id)
      
      }
    else{
      var flag = false
      for(var key in tokens)
      {
        if (tokens[key]["code"] == code){
        flag = true
        }
      }
      if(flag === false && counter < 10){
      counter++
      return asyncRegisterUser(code)
      }
    }
    }).then(()=>{})
    .catch(error=>{})
  }
  }
  /**
   * Refreshes the token associated with the MID
   * @param {*} MID the current user's ID
   */
  async function asyncRefresh(MID)
  {
    await fetch('https://www.bungie.net/Platform/App/OAuth/Token/', {
      method: 'POST',
      headers: {
        'X-API-Key': `${api_key}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`45822:h9gtVF3XvuOInLwclh-BiEIsWF4696Ck1WSwtT0z4As`)}`
      },
      body: new URLSearchParams({
        'client_id': "45822",
        'grant_type': "refresh_token",
        'refresh_token': tokens[MID]["refresh_token"]
      }).toString()
    }).then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if(typeof returnVal === 'undefined')
      {refreshVal = data;}
    }).catch(error => console.log('error', error))
  }
  /**
   * gathers User details and their inventories after authorization
   * @param {*} MID the current users MID
   */
  async function asyncGetUser(MID)
  { 
    if(tokens[MID]["access_token_expires"] < Date.now() && tokens[MID]["refresh_token_expires"] > Date.now())
  {
    await asyncRefresh(MID)
  }
    if(!gettingUserData){
      gettingUserData = true;
      fetch('https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/', {
      method: 'GET',
      headers: {
        'X-API-Key': `${api_key}`,
        'Authorization': 'Bearer '+ tokens[MID].access_token
      }
    }).then(function(response){ return response.json()})
    .then(function(data) { temp = data; 
      dataDict[MID]["Username"] = temp["Response"]["bungieNetUser"].displayName;
      dataDict[MID]["DID"] = temp["Response"]["destinyMemberships"][0]["membershipId"];
      dataDict[MID]["memType"] = temp["Response"]["destinyMemberships"][0]["membershipType"];
      
      gettingUserData = false
      console.log("Getting Inventory")
      asyncGetInventory(MID)
    })
    .catch(error => console.log('error', error.body));
  }
  }
  /**
   * Searches for any items related to the term
   * @param {*} term the string to search the API for
   * @returns the json of the return result of the fetch call
   */
  function searchItem(term)
  {
    return fetch(`https://www.bungie.net/Platform/Destiny2/Armory/Search/DestinyInventoryItemDefinition/${term}`,{
      method: 'GET',
      headers: {
        'X-API-Key': `${api_key}`
      }
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      return data["Response"]["results"]
    }).catch(error=>{})
  }
  /**
   * reutrns the name and definition of the perk
   * @param {*} data the json object of the perk
   * @param {*} itemIID the current item's ID
   * @param {*} MID  the current user's ID
   * @param {*} key the perk's sockethash
   * @param {*} perk the perk's hash
   */
  function getPerkData(data,itemIID,MID,key,perk)
  {
    if(data["Response"]["perks"][key]["perks"][perk]["iconPath"] !== '')
        fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinySandboxPerkDefinition/${data["Response"]["perks"][key]["perks"][perk]["perkHash"]}`,{
            method: 'GET',
            headers: {
              'X-API-Key': `${api_key}`
            }
          }).then(function(response) {
            return response.json();
          }).then(function(data) {
            return [data["Response"]["displayProperties"]["name"], data["Response"]["displayProperties"]["definition"]]
          }).catch(error=>{})
          
  }
  /**
   * Gathers the name of the stat
   * @param {*} itemIID the current item's id
   * @param {*} data the stat hash
   * @param {*} MID the current user's id
   */
  function getItemStatName(itemIID,data,MID)
  {
    return fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyStatDefinition/${data}`,{
            method: 'GET',
            headers: {
              'X-API-Key': `${api_key}`
            }
          }).then(function(response) {
            return response.json();
          }).then(function(body) {
            
            if(typeof body !== 'undefined')
            dataDict[MID]["inventory"][itemIID]["stats"][data]["name"] = body["Response"]["displayProperties"]["name"]
            return
          }).then( function(){
            flag = true
            return
          }
            ).catch(error => {
            getItemStatName(itemIID,data,MID)
          })
        
  }
  /**
   * Gets the name and icon of the current item and stores them in the backend
   * @param {*} itemIID the current items ID
   * @param {*} hash the geneic hash of the current item
   * @param {*} MID the current user's ID
   * @returns 
   */
  function getItemNameAndIcon(itemIID,hash,MID)
  {
     return fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${hash}`,{
            method: 'GET',
            headers: {
              'X-API-Key': `${api_key}`
            }
          }).then(function(response) {
            return response.json();
          }).then(function(data2) {
            //console.log(data2)
            if(typeof dataDict[MID]["inventory"][itemIID] === 'undefined')
            dataDict[MID]["inventory"][itemIID] = {}
            dataDict[MID]["inventory"][itemIID]["name"] = data2["Response"]["displayProperties"].name
            dataDict[MID]["inventory"][itemIID]["itemHash"] = data2["Response"]["hash"]
            
            dataDict[MID]["inventory"][itemIID]["image"] = "https://www.bungie.net" + data2["Response"]["displayProperties"].icon
            dataDict[MID]["inventory"][itemIID]["ammoType"] = data2["Response"]["equippingBlock"].ammoType
            try{
            dataDict[MID]["inventory"][itemIID]["damageType"] = damageTypes[data2["Response"].defaultDamageType]
            }
            catch{
              dataDict[MID]["inventory"][itemIID]["damageType"] = ""
            }
            try{
              dataDict[MID]["inventory"][itemIID]["itemType"] = itemTypes[data2["Response"].itemType]
            }
            catch{
              dataDict[MID]["inventory"][itemIID]["itemType"] = ""
            }
            try{
            dataDict[MID]["inventory"][itemIID]["itemSubType"] = itemSubTypes[data2["Response"].itemSubType]
            }catch{
              dataDict[MID]["inventory"][itemIID]["itemSubType"] = ""
            }
          }).then(()=>{
            return
          }).catch(error=>{})
  }
  /**
   * Stores the list of stats attached to the item
   * @param {*} itemIID current item's ID
   * @param {*} data the json object of the current item
   * @param {*} MID the current user's ID
   * @returns 
   */
  function getItemStats(itemIID,data,MID)
  {
    for(var hash in data)
    {
      if(typeof dataDict[MID]["inventory"][itemIID]["stats"] === 'undefined')
      dataDict[MID]["inventory"][itemIID]["stats"] = {}
      dataDict[MID]["inventory"][itemIID]["stats"][hash]={}
      dataDict[MID]["inventory"][itemIID]["stats"][hash]["statHash"] = data[hash]["statHash"]
      dataDict[MID]["inventory"][itemIID]["stats"][hash]["value"] = data[hash]["value"]
      getItemStatName(itemIID,data[hash]["statHash"],MID).then(function(response){
    })
      
    }
    return
  }
  /**
   * Gets the necessary details of the current item from the Bungie API
   * @param {*} itemIID the current item's id
   * @param {*} MID the current user's ID
   */
  function getItem(itemIID,MID)
  {
    if(MID != -1){
    return fetch(`https://www.bungie.net/Platform/Destiny2/${dataDict[MID]["memType"]}/Profile/${dataDict[MID]["DID"]}/Item/${itemIID}/?components=300,302,304,305`,{
        method: 'GET',
        headers: {
          'X-API-Key': `${api_key}`
        }
      }).then(function(response) {
        return response.json();
      }).then(function(data){
        
        //DestinyStatDefinition
        //DestinyDamageTypeDefinition
        //pull damageType hash data and stathash data
        for(var key in data["Response"]["instance"])
        {
          
          if(typeof data["Response"]["instance"][key]["damageTypeHash"] !== 'undefined'){
          getDamageHash(itemIID,data["Response"]["instance"][key]["damageTypeHash"],MID)
          }
          if(typeof data["Response"]["instance"][key]["primaryStat"] !== 'undefined'){ 
            getPrimaryStat(itemIID,data["Response"]["instance"][key]["primaryStat"],MID)
        }
        try{
          if(typeof data["Response"]["perks"]["data"] !== 'undefined')
        if(typeof data["Response"]["perks"]["data"]["perks"] !== 'undefined'){
          for(var perk in data["Response"]["perks"][key]["perks"]){
            getPerkData(data,itemIID,MID,key,perk)
        }
      }
        }catch
        {
          console.log("Perk Data\t" + data["Response"]["perks"])
        }
      //DestinyStatDefinition
        //Pull stats for frontend to run calculations
        for(var key in data["Response"]["stats"]){
        if(typeof data["Response"]["stats"][key]["stats"] !== 'undefined')
        getItemStats(itemIID,data["Response"]["stats"][key]["stats"],MID)
        }
        }
    }).catch(error=>{})
  }else
  {
    return fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${itemIID}`,{
        method: 'GET',
        headers: {
          'X-API-Key': `${api_key}`
        }
      }).then(function(response) {
        return response.json();
      }).then(function(data){
        //DestinyStatDefinition
        //DestinyDamageTypeDefinition
        //pull damageType hash data and stathash data
          if(typeof data["Response"]["damageTypes"]["defaultDamageTypeHash"] !== 'undefined'){
          getDamageHash(itemIID,data["Response"]["damageTypes"]["defaultDamageTypeHash"],MID)
          }
          
      //DestinyStatDefinition
        //Pull stats for frontend to run calculations
        getItemStats(itemIID,data["Response"]["stats"]["stats"],MID)
        if(typeof data["Response"]["stats"]["primaryBaseStatHash"] !== 'undefined'){ 
        getPrimaryStat(itemIID,data["Response"]["stats"]["primaryBaseStatHash"],MID)
        }
        
      }).catch(error=>{})
  }
  }
  /**
   * Stores the characters equipment in the backend
   * @param {*} temp the json object of the current character
   * @param {*} character the hash of the current character
   * @param {*} items all of the items currently equipt to the character
   * @param {*} MID the current users ID
   */
  async function getEquipmentData(temp,character,items,MID)
  {
    if(typeof dataDict[MID]["characters"] == 'undefined')
    dataDict[MID]["characters"] = []
    if (typeof dataDict[MID]['characters'][character] == 'undefined')
    dataDict[MID]["characters"].push(character)
    for(var item in items){
      
    if(typeof temp["Response"]["characterEquipment"]["data"][character]["items"][item]["itemInstanceId"] !== 'undefined'){
      var itemIID = temp["Response"]["characterEquipment"]["data"][character]["items"][item]["itemInstanceId"]
      if(typeof dataDict[MID]["inventory"] === 'undefined')
      dataDict[MID]["inventory"] = {}
      if(typeof dataDict[MID]["inventory"][itemIID] === 'undefined')
      dataDict[MID]["inventory"][itemIID] = {}
      if(typeof dataDict[MID]["inventory"][itemIID]["itemHash"] === 'undefined')
      dataDict[MID]["inventory"][itemIID]["itemHash"] = temp["Response"]["characterEquipment"]["data"][character]["items"][item]["itemHash"]
      if(typeof dataDict[MID]["inventory"][itemIID]["character"] === 'undefined')
      dataDict[MID]["inventory"][itemIID]["character"] = character
      
  }
}
  }
  /**
   * Gets all the perk socket hashes for the item
   * @param {*} itemID the current item's id
   * @returns an array of the perk socket hashes
   */
  function getSocketHashes(itemID)
  {
    socketHashes = []
    return fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${itemID.replaceAll("\"","")}`,
        {
          method:'GET',
          headers:{
            'X-API-Key': `${api_key}`
          }
        }).then(function(response) {
          return response.json();
        }).then(function(data)
        {
          for (var category in data["Response"]["sockets"]["socketCategories"])
            if(data["Response"]["sockets"]["socketCategories"][category]["socketCategoryHash"] === 4241085061 ||data["Response"]["sockets"]["socketCategories"][category]["socketCategoryHash"] === 3154740035)
            {
              for(var index in data["Response"]["sockets"]["socketCategories"][category]["socketIndexes"])
              {
                var currIdx = data["Response"]["sockets"]["socketCategories"][category]["socketIndexes"][index]
                if(typeof data["Response"]["sockets"]["socketEntries"][currIdx]["reusablePlugSetHash"] !== 'undefined')
                socketHashes.push(data["Response"]["sockets"]["socketEntries"][currIdx]["reusablePlugSetHash"])
              }
            } 
        }).then( () =>
        {
          return socketHashes
        })

  }
  /**
   * Gets the name of the perk
   * @param {*} perkHash the perk hash
   * @returns the name of the perk
   */
  function getPerkName(perkHash)
  {
    return fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${perkHash}`,
        {
          method:'GET',
          headers:{
            'X-API-Key': `${api_key}`
          }
        }).then(function(response) {
          return response.json();
        }).then(function(data)
        {
          if(typeof data["Response"]["displayProperties"].name !=='undefined')
          return data["Response"]["displayProperties"].name
        })
        
  }
  /**
   * gathers the descriptive text for the perk
   * @param {*} perkHash the current perk
   * @returns the descriptive text
   */
  function getPerkDescription(perkHash)
  {
    return fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${perkHash}`,
        {
          method:'GET',
          headers:{
            'X-API-Key': `${api_key}`
          }
        }).then(function(response) {
          return response.json();
        }).then(function(data)
        {

          if(typeof data["Response"]["displayProperties"].description !=='undefined')
          return data["Response"]["displayProperties"].description
        })
  }
  /**
   * Gets the Icon for the perk
   * @param {*} perkHash the current perk
   * @returns the url for the icon
   */
  function getPerkIcon(perkHash)
  {
    return fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${perkHash}`,
        {
          method:'GET',
          headers:{
            'X-API-Key': `${api_key}`
          }
        }).then(function(response) {
          return response.json();
        }).then(function(data)
        {

          return "https://www.bungie.net" + data["Response"]["displayProperties"].icon
        
        })
  }
  /**
   * gathers all of the necessary perk details
   * @param {*} perkHash the current perk 
   * @returns the current perk object
   */
  function getPerkDetails(perkHash)
  {
    perk = {}
    return fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${perkHash}`,
        {
          method:'GET',
          headers:{
            'X-API-Key': `${api_key}`
          }
        }).then(function(response) {
          return response.json();
        }).then(function(data)
        {
          if(typeof data["Response"]["displayProperties"].name !=='undefined')
          perk["name"] = data["Response"]["displayProperties"].name
          if(typeof data["Response"]["displayProperties"].description !=='undefined')
          perk["description"] = data["Response"]["displayProperties"].description
          if(typeof data["Response"]["displayProperties"].icon !=='undefined')
          perk["icon"] = "https://www.bungie.net" + data["Response"]["displayProperties"].icon
        
        })
        .then(function()
        {
          return perk
        })
  }
  /**
   * Returns the hashes of all the possible perks in the socket hash
   * @param {*} socketHash the hash of the current socket
   * @returns list of perk hashes
   */
  async function getSocketPerks(socketHash)
  {
    perks = []
    return fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyPlugSetDefinition/${socketHash.replaceAll("\"","")}`,
    {
      method:'GET',
      headers:{
        'X-API-Key': `${api_key}`
      }
    }).then(function(response) {
      return response.json();
    }).then(function(data2) {
      if(typeof data2["Response"]["reusablePlugItems"] !== 'undefined'){
      for (var perk in data2["Response"]["reusablePlugItems"])
      {
        perks.push(data2["Response"]["reusablePlugItems"][perk].plugItemHash)
      } 
    }
    }).then(function(){
      return perks
    })
  }
  /**
   * Gets the hash of the Damage type
   * @param {*} itemIID the current item's id
   * @param {*} data the json object of the item
   * @param {*} MID the current users inventory we are in
   */
  function getDamageHash(itemIID,data,MID)
  {
    fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyDamageTypeDefinition/${data}`,{
            method: 'GET',
            headers: {
              'X-API-Key': `${api_key}`
            }
          }).then(function(response) {
            return response.json();
          }).then(function(data2) {
          }).catch(error=>{})
  }
  /**
   * gathers the primary stat's name and value
   * @param {*} itemIID the current item we are looking at
   * @param {*} data the json of the item
   * @param {*} MID the current user the item is attached to
   * @returns 
   */
  function getPrimaryStat(itemIID,data,MID)
  {
    if(typeof data["statHash"] !== 'undefined'){
    if(typeof dataDict[MID]["inventory"][itemIID]["stats"] === 'undefined')
    dataDict[MID]["inventory"][itemIID]["stats"] = {}
    dataDict[MID]["inventory"][itemIID]["stats"][data["statHash"]]={}
    dataDict[MID]["inventory"][itemIID]["stats"][data["statHash"]]["statHash"] = data["statHash"]
    dataDict[MID]["inventory"][itemIID]["stats"][data["statHash"]]["value"] = data["value"]
    fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyStatDefinition/${data["statHash"]}`,{
            method: 'GET',
            headers: {
              'X-API-Key': `${api_key}`
            }
          }).then(function(response) {
            return response.json();
          }).then(function(data2) {
            dataDict[MID]["inventory"][itemIID]["stats"][data["statHash"]]["name"] = data2["Response"]["displayProperties"]["name"]
            
          }).catch(error=>{})
        }else
        {
          if(typeof dataDict[MID]["inventory"][itemIID]["stats"] === 'undefined')
            dataDict[MID]["inventory"][itemIID]["stats"] = {}
            dataDict[MID]["inventory"][itemIID]["stats"][data]={}
            dataDict[MID]["inventory"][itemIID]["stats"][data]["statHash"] = data
            dataDict[MID]["inventory"][itemIID]["stats"][data]["value"] = 1600
           return fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyStatDefinition/${data}`,{
            method: 'GET',
            headers: {
              'X-API-Key': `${api_key}`
            }
          }).then(function(response) {
            return response.json();
          }).then(function(data2) {
            dataDict[MID]["inventory"][itemIID]["stats"][data]["name"] = data2["Response"]["displayProperties"]["name"]
            
          }).catch(error=>{})
        }
  }
  /**
   * Stores the item within our backend dictionary
   * @param {*} temp the current json of the inventory
   * @param {*} item the current item in the inventory
   * @param {*} MID the current user's inventory we are in
   */
  async function getInventoryData(temp,item,MID)
  {
    if(typeof temp["Response"]["profileInventory"]["data"]["items"][item].itemInstanceId !== 'undefined'){
      var itemIID = temp["Response"]["profileInventory"]["data"]["items"][item].itemInstanceId
      if(typeof dataDict[MID]["inventory"] === 'undefined')
      dataDict[MID]["inventory"] = {}
      if(typeof dataDict[MID]["inventory"][itemIID] === 'undefined')
      dataDict[MID]["inventory"][itemIID] = {}
      if(typeof dataDict[MID]["inventory"][itemIID]["itemHash"] === 'undefined')
      dataDict[MID]["inventory"][itemIID]["itemHash"] = temp["Response"]["profileInventory"]["data"]["items"][item]["itemHash"]
  }
}
/**
 * Gathers the inventory of the given MID
 * @param MID the MID of the current user
 */
  async function asyncGetInventory(MID)
  { 
    if(tokens[MID]["access_token_expires"] < Date.now() && tokens[MID]["refresh_token_expires"] > Date.now())
  {
    await asyncRefresh(MID)
  }
    var response = await fetch(`https://www.bungie.net/Platform/Destiny2/${dataDict[MID]["memType"]}/Profile/${dataDict[MID]["DID"]}/?components=102,205`, {
      method: 'GET',
      headers: {
        'X-API-Key': `${api_key}`,
        'Authorization': 'Bearer '+ tokens[MID].access_token
      }
    }).then(function(response){ return response.json()})
    .then(function(data) { temp = data; 
      for(var item in temp["Response"]["profileInventory"]["data"]["items"])
      {
       getInventoryData(temp,item,MID)
      }
      for(var character in temp["Response"]["characterEquipment"]["data"])
      {
        getEquipmentData(temp,character,temp["Response"]["characterEquipment"]["data"][character]["items"],MID)
      }
    })
    .catch(error => console.log("asyncGetInventory"));
  }
/**
* Registers the code to our API key
@param code the key given from the Bungie OAuth system
*/
app.get("/registerUser",(req,res) => {
    asyncRegisterUser(req.query.code,0);
    res.json()
})
/**
 * @description Returns the name of the account
 * @returns name of the current user's account
 * @param {header_parameter} mid the current player's mid
 * 
 */
app.get("/getUser",(req,res) => {
  if(req.headers !== 'null')
  if(req.headers['mid'] === ' null'){
    var mid = -1
  }else{
    var mid = req.headers['mid']
  }
  if(mid !== -1)
  if(typeof dataDict[mid] !== 'undefined'){
  if(typeof dataDict[mid].Username !== 'undefined')
  res.json(dataDict[mid].Username);
  }
 
}
)
/**
 * @description Returns the current known inventory of the player
 * @returns the Inventory of the current player
 * @param {header_parameter} mid the current player's mid
 * 
 */
app.get("/getInventory",(req,res) => {
  if(req.headers !== 'null')
  if(req.headers['mid'] === ' null'){
    var mid = -1
  }else{
    var mid = req.headers['mid']
  }
  if(mid !== -1)
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined'){
  res.json(dataDict[mid]["inventory"]);
  }
  
})
/**
 * @description Used to gather the inventory of specific person
 * @returns the string literal of the url of the item's icon
 * @param {header_parameter} mid the current player's mid
 * 
 */
app.get("/getItems",(req,res) => {
  if(req.headers !== 'null')
  if(req.headers['mid'] === ' null'){
    var mid = -1
  }else{
    var mid = req.headers['mid']
  }
  if(mid !== -1)
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined'){
  res.json(Object.keys(dataDict[mid]["inventory"]));
  }

})
/**
 * @description Used to gather the entire datablock of the specific item
 * @returns All the stored data of the item
 * @param {header_parameter} mid the current player's mid OPTIONAL 
 * @param {header_parameter} iid the current weapon
 * 
 */
app.get("/getItemInfo",(req,res) => {
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(req.headers['iid'] !== 'null')
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined')
if (typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]!=='undefined')
{
  res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]);
  }
  else{
    getItemNameAndIcon(req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]",""),req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]",""),mid).then(
      function(){
      res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")])
    })
  }
  
}})
/**
 * @description Used to gather the Damage of specific item
 * @returns the damage type
 * @param {header_parameter} mid the current player's mid OPTIONAL 
 * @param {header_parameter} iid the current weapon
 * 
 */
app.get("/getItemDamageType",(req,res) => {
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(req.headers['iid'] !== 'null')
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined')
if (typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]!=='undefined')
if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].damageType !== 'undefined'){
 
  res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].damageType);
  }
  else{
    getItemNameAndIcon(req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]",""),dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["itemHash"],mid).then(function(){res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].damageType)})
  }
  
}})
/**
 * @description Used to gather the type of specific item
 * @returns the type of the item (Weapon or Armor)
 * @param {header_parameter} mid the current player's mid OPTIONAL 
 * @param {header_parameter} iid the current weapon
 * 
 */
app.get("/getItemType",(req,res) => {
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(req.headers['iid'] !== 'null')
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined')
if (typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]!=='undefined')
if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].itemType !== 'undefined'){
 
  res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].itemType);
  }
  else{
    getItemNameAndIcon(req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]",""),dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["itemHash"],mid).then(function(){res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].itemType)})
  }
  
}})
/**
 * @description Used to gather the subtype of specific item
 * @returns the subtype of the item
 * @param {header_parameter} mid the current player's mid OPTIONAL 
 * @param {header_parameter} iid the current weapon
 * 
 */
app.get("/getItemSubType",(req,res) => {
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(req.headers['iid'] !== 'null')
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined')
if (typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]!=='undefined')
if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].itemSubType !== 'undefined'){
 
  res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].itemSubType);
  }
  else{
    getItemNameAndIcon(req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]",""),dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["itemHash"],mid).then(function(){res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].itemSubType)})
  }
  
}})
/**
 * @description Used to gather the ammo type of specific item
 * @returns the ammo type of the item as an integer
 * @param {header_parameter} mid the current player's mid OPTIONAL 
 * @param {header_parameter} iid the current weapon
 * 
 */
app.get("/getItemAmmoType",(req,res) => {
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(req.headers['iid'] !== 'null')
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined')
if (typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]!=='undefined')
if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].ammoType !== 'undefined'){
 
  res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].ammoType);
  }
  else{
    getItemNameAndIcon(req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]",""),dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["itemHash"],mid).then(function(){res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].ammoType)})
  }
  
}})
/**
 * @description Used to gather the name of specific item
 * @returns the name of the item
 * @param {header_parameter} mid the current player's mid OPTIONAL 
 * @param {header_parameter} iid the current weapon
 * 
 */
app.get("/getItemName",(req,res) => {
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(req.headers['iid'] !== 'null')
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined')
if (typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]!=='undefined')
if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].name !== 'undefined'){
 
  res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].name);
  }
  else{
    //console.log("Reached inside else")
    getItemNameAndIcon(req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]",""),dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["itemHash"],mid).then(function(){res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].name)})
  }
  
}})
/**
 * @description Used to gather the name of a stat of an item
 * @returns the name of the stathash
 * @param {header_parameter} mid the current player's mid OPTIONAL 
 * @param {header_parameter} iid the current weapon
 * @param {header_parameter} stathash the current stathash
 * 
 */
app.get("/getItemStatName",(req,res) => {
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(req.headers['iid'] !== 'null')
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined'){
    if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["stats"][req.headers['stathash'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].name ==='undefined')
    {
      getItemStatName(req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]",""),req.headers['stathash'].replaceAll("\"","").replaceAll("[","").replaceAll("]",""),mid).then(function(retVal) { res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["stats"][req.headers['stathash'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].name)})
    }else
    res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["stats"][req.headers['stathash'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].name);
  }
  
}})
/**
 * @description Used to gather the stathash of a stat of an item
 * @returns the stathash of the stathash
 * @param {header_parameter} mid the current player's mid OPTIONAL 
 * @param {header_parameter} iid the current weapon
 * @param {header_parameter} stathash the current stathash
 * 
 */
app.get("/getItemStatHash",(req,res) => {
  //asyncGetInventory(req.headers['mid'])
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(req.headers['iid'] !== 'null')
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined')
  if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["stats"] !=='undefined')
  if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["stats"][req.headers['stathash'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")] !=='undefined')
  if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["stats"][req.headers['stathash'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].stathash !=='undefined'){
  //console.log(req.headers['iid'].replaceAll("\"",""))
  res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["stats"][req.headers['stathash'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].stathash);
  }
  
}})
/**
 * @description Used to gather the value of a stat of an item
 * @returns the value of the stathash
 * @param {header_parameter} mid the current player's mid OPTIONAL 
 * @param {header_parameter} iid the current weapon
 * @param {header_parameter} stathash the current stathash
 * 
 */
app.get("/getItemStatValue",(req,res) => {
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(req.headers['iid'] !== 'null')
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined')
  if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["stats"] !=='undefined')
  if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["stats"][req.headers['stathash'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")] !=='undefined')
  if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["stats"][req.headers['stathash'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].value !=='undefined'){
  res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["stats"][req.headers['stathash'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].value);
  }
}})
/**
 * @description Used to gather the image of specific item
 * @returns the string literal of the url of the item's icon
 * @param {header_parameter} mid the current player's mid OPTIONAL 
 * @param {header_parameter} iid the current weapon
 * 
 */
app.get("/getItemImage",(req,res) => {
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(req.headers['iid'] !== 'null')
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined')
  if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")] !=='undefined')
  if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].image !=='undefined'){
  res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].image);
  }
  else{
    getItemNameAndIcon(req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]",""),dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["itemHash"],mid).then(function(retVal) {res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].image)})
  }
}
}
)
/**
 * @description Used to gather the hashes of specific item
 * @returns the items generic hash
 * @param {header_parameter} mid the current player's mid OPTIONAL 
 * @param {header_parameter} iid the current weapon
 * 
 */
app.get("/getItemHash",(req,res) => {
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(req.headers['iid'] !== 'null')
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined')
  if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")] !=='undefined')
  if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["itemHash"] !=='undefined'){
  res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["itemHash"]);
  }
}
})
/**
 * @description Used to gather the details of a specific perk
 * @returns JSON object of the full details of a perk
 * @param {header_parameter} perkhash the perk's hash
 * 
 */
app.get("/getPerkDetails",(req,res) => {
  if(req.headers !== 'null')
  if(typeof req.headers['perkhash'] !== 'undefined')
  getPerkDetails(req.headers['perkhash'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")).then(function(retVal)
{
  res.json(retVal)
})
})
/**
 * @description Used to gather the icon of a specific perk
 * @returns the string literal of the url to the perk's icon
 * @param {header_parameter} perkhash the perk's hash
 * 
 */
app.get("/getPerkIcon",(req,res) => {
  if(req.headers !== 'null')
  if(typeof req.headers['perkhash'] !== 'undefined')
  getPerkIcon(req.headers['perkhash'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")).then(function(retVal)
{
  res.json(retVal)
})
})
/**
 * @description used to get the name of a perk given its hash
 * @returns the name of the perk
 * @param {header_parameter} perkhash the perks hash 
 * 
 */
app.get("/getPerkName",(req,res) => {
  if(req.headers !== 'null')
  if(typeof req.headers['perkhash'] !== 'undefined')
  getPerkName(req.headers['perkhash'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")).then(function(retVal)
{
  res.json(retVal)
})
})
/**
 * @description Returns the description of a perk
 * @returns the description of the perk
 * @param {header_parameter} perkhash the hash of the perk
 * 
 */
app.get("/getPerkDescription",(req,res) => {
  if(req.headers !== 'null')
  if(typeof req.headers['perkhash'] !== 'undefined')
  getPerkDescription(req.headers['perkhash'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")).then(function(retVal)
{
  res.json(retVal)
})
})
/**
 * @description Used to gather the data of a specific socket given its hash
 * @returns the full details of the socket
 * @param {header_parameter} sockethash the hash of the socket
 * 
 */
app.get("/getSocketData",(req,res) => {
  if(req.headers !== 'null')
  if(typeof req.headers['sockethash'] !== 'undefined')
  getSocketPerks(req.headers['sockethash'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")).then(function(retVal)
{
  res.json(retVal)
})
})
/**
 * @description Used to gather the hashes of sockets for the perks of a weapon
 * @returns An array of socket hashes
 * @param {header_parameter} iid the current weapon
 * 
 */
app.get("/getItemSocketHashes",(req,res) => {
  if(req.headers !== 'null')
  if(req.headers['iid'] !== 'null'){
    getSocketHashes(req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")).then(function (retVal)
    {
      res.json(retVal)
    } 
    )
  }
   
})
/**
 * @description Used to gather the hashes of stats for a specific iid
 * @returns An array of stat hashes
 * @param {header_parameter} mid the current player's mid OPTIONAL 
 * @param {header_parameter} iid the current weapon
 * 
 */
app.get("/getItemStats",(req,res) => {
  try{
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(req.headers['iid'] !== 'null')
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined'){
  if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")] === 'undefined'){
      getItem(req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]",""),mid).then( 
        function(promise){
          try{
          res.json(Object.keys(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].stats))}catch
          {
          res.json()
    }})
          
  }
    
  if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].stats === 'undefined'){
  getItem(req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]",""),mid).then( 
   function (promise){
      try{
      res.json(Object.keys(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].stats))}catch
      {
        res.json()
      }
  })
  }else{

    res.json(Object.keys(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")].stats));
  }
  }
}

}catch(e)
{
  res.json()
}
})
/**
 * Returns the character's equipment
 * @param characterid the hash of the character
 * @param mid the current user's ID
 */
app.get("/getCharacterEquipment",(req,res) => {
  returnList = []
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(req.headers['characterid'] !== 'null')
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined'){
    for (iid in dataDict[mid]["inventory"])
    {
      if(typeof dataDict[mid]["inventory"][iid]["character"] !== 'undefined')
      {
        if (dataDict[mid]["inventory"][iid]["character"] == req.headers['characterid'].replaceAll("\"","").replaceAll("[","").replaceAll("]",""))
        {
          returnList.append(iid)
        }
      }
    }
  }
  return returnList
}
}
)
/**
 * Returns the character attached to the current item
 * @param mid the current user's ID
 * @param iid the current item's ID
 */
app.get("/getItemCharacter",(req,res) => {
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(req.headers['iid'] !== 'null')
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined')
    
  
  if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")] !== 'undefined')
  if(typeof dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["character"] !== 'undefined')  
  res.json(dataDict[mid]["inventory"][req.headers['iid'].replaceAll("\"","").replaceAll("[","").replaceAll("]","")]["character"])
  else
  res.json()
}
}
)
/**
 * Returns an array of the characters attached to the account
 * @param mid the current user's ID
 */
app.get("/getCharacters",(req,res) => {
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(typeof dataDict[req.headers['mid']] !== 'undefined')
  if(typeof dataDict[req.headers['mid']]["characters"] !== 'undefined'){
  res.json(dataDict[req.headers['mid']]["characters"])
  }
  else{res.json()}
}
}
)
/**
 * Searches for the item within the Bungie API
 * @param term the string to search inside the Bungie API
 */
app.get("/searchItem",(req,res) => 
{
if(req.headers !== 'null')
if(req.headers['term'] !== 'null')
searchItem(req.headers['term']).then(function (retVal)
{
  res.json(retVal)
} 
)
}
)
/**
 * Returns the current equipt items of the character
 * @param mid the current user's ID
 * @param character the hash of the character you'd like the items for
 */
app.get("/getCharacterInv",(req,res) => {
  //asyncGetInventory(req.headers['mid'])
  var mid = -1
  if(req.headers !== 'null')
  {
    if(typeof req.headers['mid'] === 'undefined'){
      mid = -1
    }else{
      mid = req.headers['mid']
    }
  if(req.headers['character'] !== null)
  if(typeof dataDict[mid] !== 'undefined')
  if(typeof dataDict[mid]["inventory"] !== 'undefined'){
  inventory = []
  for (item in dataDict[mid]["inventory"])
  {
    if(typeof dataDict[mid]["inventory"][item]['character']!=='undefined')
    if(dataDict[mid]["inventory"][item]['character'] == req.headers['character'].replaceAll("\"","").replaceAll("[","").replaceAll("]",""))
    inventory.push(item)
  }
  res.json(inventory)
  }
  else{
  res.json()
  }
}
}
)
/**
 * initialized the authorization process
 * @param code the key for the Bungie API to authorize our app to access the user's information
 */
app.get("/login",(req,res) => {
  for(var key in tokens)
  {
    if(tokens[key]["code"] == req.headers['code'])
    {
      
      res.json(key)
    }
  }
})
app.listen(5000, ()  => {console.log("Server started on port 5000")})
