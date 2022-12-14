import * as Service from "./Service";

export const createLoan = (applicantID, accountID, obj) => {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", 'Bearer ' + Service.token)

  var raw = JSON.stringify({
    "amount": obj.amount,
    "start": obj.start,
    "durationDays": obj.durationDays,
    "type": obj.type
});

  var requestOptions = {
    method: 'POST',
    headers,
    body: raw,
    redirect: 'follow'
  };

  return new Promise((res, rej) => {
    fetch(`${Service.url}/applicant/${applicantID}/account/${accountID}/loan`, requestOptions)
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