import axios from "axios";

// const url = 'http://10.0.2.2:5001'
const url = 'https://cloudy-turtleneck-shirt-bull.cyclic.app'


export const getAmharicMovies = async () => {
    try{
    const response = await axios.get(`${url}/api/kanaMoviesList`)
    return response.data
    }
    catch(error){
        console.log(error)
    }
}

export const getUpdateLink = async () => {
    try {
      const response = await axios.get(`https://quiz.ethiochewata.com/api/update`);
      return response
  
    }
    catch(error) {
      error.response
    }
  }

export const checkIsReady = async () => {
    try {
      const response = await axios.get(`${url}/api/isready`);
      return response
  
    }
    catch(error) {
      error.response
    }
  } 

export const getKana = async (title) => {
    try {
      const response = await axios.get(`${url}/api/kanaMovies?name=${title}`);
      return response
  
    }
    catch(error) {
      error.response
    }
  }