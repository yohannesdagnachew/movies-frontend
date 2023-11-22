import axios from "axios";

const url = 'http://10.0.2.2:5001'
// const url = 'https://cloudy-turtleneck-shirt-bull.cyclic.app'


export const getAmharicMovies = async () => {
    try{
    const response = await axios.get(`${url}/api/ammovies`)
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