export const url = 'http://localhost:8080'
export const token = localStorage.getItem('account') ? JSON.parse(localStorage.getItem("account"))?.jwtToken : ''