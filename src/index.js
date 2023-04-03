import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './js/fetchImages';

const { searchForm, gallery, loadMoreBtn, messageEl } = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  messageEl: document.querySelector('.message'),
};

// const searchFormEl = document.querySelector('#search-form');
// const galleryEl = document.querySelector('.gallery');
// const loadMoreBtnEl = document.querySelector('.load-more');
// const messageEl = document.querySelector('.message');

let searchQuery = '';
let page = 1;
let totalImages;

let lightbox;

searchForm.addEventListener('submit', handleSearchFormSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);
gallery.addEventListener('click', event => {
  event.preventDefault();
});

async function handleSearchFormSubmit(event) {
  event.preventDefault();

  loadMoreBtn.classList.add('is-hidden');
  messageEl.classList.add('is-hidden');

  page = 1;
  searchQuery = searchForm.elements.searchQuery.value.trim();
  if (!searchQuery) {
    return;
  }

  try {
    const response = await getImages(searchQuery, page, 40);

    if (response.data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      gallery.innerHTML = '';
      return;
    }

    Notify.success(`Hooray! We found ${response.data.totalHits} images.`);

    const galleryMarkup = response.data.hits
      .map(img => createPhotoCardMarkup(img))
      .join('');

    gallery.innerHTML = galleryMarkup;
    loadMoreBtn.classList.remove('is-hidden');
    totalImages = response.data.hits.length;

    if (totalImages >= response.data.totalHits) {
      loadMoreBtn.classList.add('is-hidden');
      messageEL.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
  lightbox = new SimpleLightbox('.gallery a');
}

async function handleLoadMoreBtnClick() {
  loadMoreBtn.setAttribute('disabled', true);

  page += 1;
  totalImages += 40;

  try {
    const response = await getImages(searchQuery, page, 40);

    const galleryMarkup = response.data.hits
      .map(img => createPhotoCardMarkup(img))
      .join('');

    gallery.insertAdjacentHTML('beforeend', galleryMarkup);
    loadMoreBtn.disabled = false;

    if (totalImages >= response.data.totalHits) {
      loadMoreBtn.classList.add('is-hidden');
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
