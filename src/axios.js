import axios from "axios";

const instance = axios.create({
  // baseURL:"https://code.bdluminaries.com/api/v1/"
  baseURL: "https://code.bdluminaries.com/api/v1/",
});

export default instance;
