const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key

// Added new api key by sign up the website. 
const KEY = '20267531-6c8bb7cc59f851f5c3ca0e37b';

// show images 
const showImages = (images) => {
        imagesArea.style.display = 'block';
        gallery.innerHTML = '';
        toggleSpinner(false);
        // show gallery title
        galleryHeader.style.display = 'flex';
        images.forEach(image => {
            let div = document.createElement('div');
            div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
            div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
            gallery.appendChild(div);
        })
    }
    // Used async await for practicing
const getImages = async(query) => {
    // added toggle spinner
    toggleSpinner(true)
    try {
        // Updated the api link
        const response = await fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`)
        const data = await response.json()
            // Changed the capitalization from hitS to hits
        showImages(data.hits)
    } catch (error) {
        const searchError = document.getElementById('error-message')
        searchError.innerText = 'Sorry!Something went wrong';
    }
}

let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;
    element.classList.toggle('added');
    let item = sliders.indexOf(img);
    if (item === -1) {
        sliders.push(img);
    } else {
        sliders.splice(item, 1);
    }
}
var timer
const createSlider = () => {
    // check slider image length
    if (sliders.length < 2) {
        alert('Select at least 2 image.')
        return;
    }
    // crate slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';
    // hide image area
    imagesArea.style.display = 'none';
    const duration = document.getElementById('duration').value || 1000;
    sliders.forEach(slide => {
        let item = document.createElement('div')
        item.className = "slider-item";
        item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
        sliderContainer.appendChild(item)
    })
    changeSlide(0)
    if (duration < 0) {
        timer = setInterval(function() {
            slideIndex++;
            changeSlide(slideIndex);
        }, duration * (-1));
        alert('duration time can not be a negative number');
    } else {
        timer = setInterval(function() {
            slideIndex++;
            changeSlide(slideIndex);
        }, duration);
    }
}

// change slider index 
const changeItem = index => {
    changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1
        index = slideIndex;
    };

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }
    items.forEach(item => {
        item.style.display = "none"
    })
    items[index].style.display = "block"
}
searchBtn.addEventListener('click', function() {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    if (search.value === '') {
        // Added a new feature "Empty search box won't show any result"
        const searchWarning = document.getElementById('empty-warning');
        searchWarning.innerHTML = '';

    } else {
        getImages(search.value)
    }
    sliders.length = 0;
})

sliderBtn.addEventListener('click', function() {
        createSlider()
    })
    // Adding Enter keypress function for the search Field 
document.getElementById('search').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('search-btn').click();
        }
    })
    // Adding a new feature "Enter keypress function for the duration" 
document.getElementById('duration').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('create-slider').click();
        }
    })
    // Adding a new feature 'toggle Spinner'
const toggleSpinner = (show) => {
    const spinner = document.getElementById('loading-spinner').classList;
    if (show) {
        spinner.remove('d-none');
        gallery.classList.add('d-none');
    } else {
        spinner.add('d-none');
        gallery.classList.remove('d-none');
    }
}