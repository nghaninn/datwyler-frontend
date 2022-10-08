import * as Service from "./Service";

export const login = (username, password) => {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "username": "admin",
    "password": "password"
  });

  var requestOptions = {
    method: 'POST',
    headers,
    body: raw,
    redirect: 'follow'
  };

  return new Promise((res, rej) => {
    fetch(`${Service.url}/user/authenticate`, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
        res(result)
      })
      .catch(error => {
        console.log('error', error)
        rej(error)
      });
  })
}