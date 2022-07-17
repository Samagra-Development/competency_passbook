import axios from 'axios'

export default axios.create({
  baseURL: 'http://localhost:8000',

  headers: {
    authorization: sessionStorage.getItem('token')
      ? sessionStorage.getItem('token')
      : null
  }
})