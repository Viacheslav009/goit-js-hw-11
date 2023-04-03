import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './js/fetchImages';

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
const messageEl = document.querySelector('.message');

let searchQuery = '';
let page = 1;
let totalImages;

let lightbox;

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);
galleryEl.addEventListener('click', event => {
  event.preventDefault();
});

async function handleSearchFormSubmit(event) {
  event.preventDefault();

  loadMoreBtnEl.classList.add('is-hidden');
  messageEl.classList.add('is-hidden');

  page = 1;
  searchQuery = searchFormEl.elements.searchQuery.value.trim();
  if (!searchQuery) {
    return;
  }

  try {
    const response = await getImages(searchQuery, page, 40);

    if (response.data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      galleryEl.innerHTML = '';
      return;
    }

    Notify.success(`Hooray! We found ${response.data.totalHits} images.`);

    const galleryMarkup = response.data.hits
      .map(img => createPhotoCardMarkup(img))
      .join('');

    galleryEl.innerHTML = galleryMarkup;
    loadMoreBtnEl.classList.remove('is-hidden');
    totalImages = response.data.hits.length;

    if (totalImages >= response.data.totalHits) {
      loadMoreBtnEl.classList.add('is-hidden');
      messageEl.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
  lightbox = new SimpleLightbox('.gallery a');
}

async function handleLoadMoreBtnClick() {
  loadMoreBtnEl.setAttribute('disabled', true);

  page += 1;
  totalImages += 40;

  try {
    const response = await getImages(searchQuery, page, 40);

    const galleryMarkup = response.data.hits
      .map(img => createPhotoCardMarkup(img))
      .join('');

    galleryEl.insertAdjacentHTML('beforeend', galleryMarkup);
    loadMoreBtnEl.disabled = false;

    if (totalImages >= response.data.totalHits) {
      loadMoreBtnEl.classList.add('is-hidden');
      messageEl.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }

  lightbox.refresh();
  scroll();
}

function createPhotoCardMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
      <a class="gallery__link" href="${largeImageURL}">
        <div class="photo-card">
          <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              <span>${likes}</span>
            </p>
            <p class="info-item">
              <b>Views</b>
              <span>${views}</span>
            </p>
            <p class="info-item">
              <b>Comments</b>
              <span>${comments}</span>
            </p>
            <p class="info-item">
              <b>Downloads</b>
              <span>${downloads}</span>
            </p>
          </div>
        </div>
      </a>
      `;
}
