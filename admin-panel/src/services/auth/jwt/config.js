import axios from 'axios';

export default axios.create({
  // baseURL: `http://g-axon.work/jwtauth/api/`, //YOUR_API_URL HERE
  // baseURL: `https://us-central1-coinparliament-51ae1.cloudfunctions.net/api/v1/admin/`, //YOUR_API_URL HERE
  
  baseURL: `https://us-central1-coin-parliament-staging.cloudfunctions.net/api/v1/admin/`, //YOUR_API_URL HERE
  headers: {
    'Content-Type': 'application/json',
  
  },
});
