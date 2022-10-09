import * as Service from "./Service";

export const listApplicant = () => {
  var headers = new Headers();
  // headers.append("Content-Type", "application/json");
  headers.append("Authorization", 'Bearer ' + Service.token)

  // var raw = JSON.stringify({
  //   "username": "admin",
  //   "password": "password"
  // });

  var requestOptions = {
    method: 'GET',
    headers,
    // body: raw,
    redirect: 'follow'
  };

  return new Promise((res, rej) => {
    fetch(`${Service.url}/applicant/`, requestOptions)
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


export const createApplicant = (obj) => {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", 'Bearer ' + Service.token)

  var raw = JSON.stringify({
    "name": obj.name,
});

  var requestOptions = {
    method: 'POST',
    headers,
    body: raw,
    redirect: 'follow'
  };

  return new Promise((res, rej) => {
    fetch(`${Service.url}/applicant/`, requestOptions)
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