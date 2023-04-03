import axios from 'axios';

export function getImages(searchQuery, page, PAGINATION) {
  const API_KEY = '34148451-f8d7bba54357f32edde6c57ad';
  const BASE_URL = 'https://pixabay.com/api/';
  const URL = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PAGINATION}`;

  return axios.get(URL);
}
