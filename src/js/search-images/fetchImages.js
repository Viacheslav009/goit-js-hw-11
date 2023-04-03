// import axios from 'axios';

// export function getImages(searchQuery, page) {
//   const API_KEY = '34935030-b6fa315c9f10ffbefdfadca7a';
//   const BASE_URL = 'https://pixabay.com/api/';
//   const URL = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

//   return axios.get(URL);
// }

import axios from 'axios';

export default async function fetchImages(value, page) {
  const url = 'https://pixabay.com/api/';
  const key = '34935030-b6fa315c9f10ffbefdfadca7a';
  const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios.get(`${url}${filter}`).then(response => response.data);
}
