import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './js/fetchImages';
import throttle from 'lodash.throttle';

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
const messageEl = document.querySelector('.message');
const scrollUpBtnEl = document.querySelector('.scroll-up-btn');

let searchQuery = '';
let page = 1;
let totalImages;
const PAGINATION = 40;
let lightbox;

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);
galleryEl.addEventListener('click', event => {
  event.preventDefault();
});
scrollUpBtnEl.addEventListener('click', handleScrollUpBth);
document.addEventListener('scroll', throttle(handleScroll, 1000));

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
    const response = await getImages(searchQuery, page, PAGINATION);

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
  totalImages += PAGINATION;

  try {
    const response = await getImages(searchQuery, page, PAGINATION);

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

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
function handleScrollUpBth() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
function handleScroll() {
  let lastScroll = window.innerHeight;

  if (lastScroll < document.documentElement.scrollTop) {
    scrollUpBtnEl.classList.remove('invisible');
  } else {
    scrollUpBtnEl.classList.add('invisible');
  }
}
