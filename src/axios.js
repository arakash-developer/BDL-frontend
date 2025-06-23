import axios from "axios";

const instance = axios.create({
  baseURL:"https://xyz.bdluminaries.com/api/v1/"
  // baseURL: "https://xyz.bdluminaries.com/api/v1/",
});

export default instance;
