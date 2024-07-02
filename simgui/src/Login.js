import * as React from 'react';

const Login = () => {

  /*
  example of variables that can be changed on the rendering of a React webpage
  const [text,setText] = React.useState("")
  */
  const [memID, setmemID] = React.useState("")
  const [disableButton, setdisableButton] = React.useState(false)
  let RandomItem;

  React.useEffect(() => {
    loadToken();
  }, []);

  const handleOpen = async () => {
    // App Window
    window.open("https://www.bungie.net/en/OAuth/Authorize?client_id=45822&response_type=code");
    window.close();

  }
  
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
        setmemID(sessionStorage.getItem('MID'));
        setdisableButton(true);
      }

    }
  }

  const handleInventory = async () => {
    var past = ""
    RandomItem = ""
    var flag = false
    while (!flag) {
      const response = await fetch(`/getItems`, {
        headers: {
          'MID': sessionStorage.getItem('MID')
        }
      })
      const data = await response.text();
      RandomItem = data
      if (past === RandomItem)
        flag = true
      past = RandomItem
    }
    console.log(RandomItem)

    var temp = RandomItem.replace("[", "")
    temp = temp.replace("]", "")
    temp = temp.split(",")
    var itemid = temp[0]
    var response = await fetch(`/getItemInfo`, {
      headers: {
        'MID': sessionStorage.getItem('MID'),
        'iid': itemid
      }
    })
    var data = await response.text();
    RandomItem = data
    if (past === RandomItem)
      flag = true
    past = RandomItem
    console.log(JSON.stringify(RandomItem, "\n", 7))
    var response = await fetch(`/getItemInfo`, {
      headers: {
        'iid': 3628991658
      }
    })
    var data = await response.text();
    RandomItem = data
    if (past === RandomItem)
      flag = true
    past = RandomItem
    console.log(JSON.stringify(RandomItem, "\n", 7))

    response = await fetch(`/searchItem`, {
      headers: {
        'term': "Graviton"
      }
    })
    data = await response.text();
    console.log(JSON.parse(data))
    response = await fetch(`/getItemStats`, {
      headers: {
        'iid': 3628991658
      }
    })
    data = await response.text();
    console.log(data)

    var temp = data.replace("[", "")
    temp = temp.replace("]", "")
    temp = temp.split(",")
    for (var stat in temp) {
      response = await fetch(`/getItemStatName`, {
        headers: {
          'iid': 3628991658,
          'stathash': temp[stat]
        }
      })
      data = await response.text();
      console.log(data)
    }

    for (var stat in temp) {
      response = await fetch(`/getItemStatValue`, {
        headers: {
          'iid': 3628991658,
          'stathash': temp[stat]
        }
      })
      data = await response.text();
      console.log(data)
    }
    return RandomItem;
  };
  const handleUser = async () => {
    const response = await fetch(`/getUser`, {
      headers: {
        'MID': sessionStorage.getItem('MID')
      }
    })
    const data = await response.text();
    RandomItem = data
    console.log(JSON.stringify(RandomItem))
    return RandomItem;
  };

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
      setmemID(sessionStorage.getItem('MID'));
    }
  };
  /*
  example of how to call an async function from a handler
  const handleItem = () => {
   const itemName = getData();
  };*/
  return (
    <div>
      <p>{ }</p>
      {(memID === '') ? (<p>Please login to Bungie</p>) : <p>Bungie ID: {memID}</p>}
      {!disableButton && <Button id="login" onClick={handleOpen}>Bungie Login</Button>}
      <Button id="getUser" onClick={handleUser}>Get User</Button>
      <Button id="getInventory" onClick={handleInventory}>Get Inventory</Button>
    </div>
  );
};

const Button = ({ onClick, children }) => {
  return (
    <button type="button" onClick={onClick} disabled={false}>
      {children}
    </button>
  );
};

export default Login;

