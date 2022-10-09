// export const url = 'http://localhost:8080'
export const url = 'https://datwyler-assignment-fqiihixc7a-de.a.run.app'
export const token = localStorage.getItem('account') ? JSON.parse(localStorage.getItem("account"))?.jwtToken : ''