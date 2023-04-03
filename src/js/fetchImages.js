import axios from 'axios';

export function getImages(searchQuery, page) {
  const API_KEY = '34935030-b6fa315c9f10ffbefdfadca7a';
  const BASE_URL = 'https://pixabay.com/api/';
  const URL = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  return axios.get(URL);
}
