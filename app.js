// Set up Axios with default headers and base URL
axios.defaults.baseURL = 'https://api.thecatapi.com/v1/';
axios.defaults.headers.common['x-api-key'] = 'YOUR_API_KEY'; // Replace with your actual API key

// Request Interceptor to log request and response time
axios.interceptors.request.use((config) => {
  console.log('Request started...');
  document.body.style.cursor = 'progress';
  progressBar.style.width = '0%';
  return config;
});

axios.interceptors.response.use(
  (response) => {
    console.log('Response received...');
    document.body.style.cursor = 'default';
    return response;
  },
  (error) => {
    document.body.style.cursor = 'default';
    return Promise.reject(error);
  }
);

// Progress update function
function updateProgress(event) {
  if (event.lengthComputable) {
    const progressPercentage = (event.loaded / event.total) * 100;
    progressBar.style.width = `${progressPercentage}%`;
  }
}

// Function to handle the initial loading of breeds
async function initialLoad() {
  try {
    const breedsResponse = await axios.get('breeds');
    const breeds = breedsResponse.data;

    // Populate the breedSelect dropdown with breed options
    const breedSelect = document.getElementById('breedSelect');
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    // Call the carousel creation function
    breedSelect.addEventListener('change', async (event) => {
      const breedId = event.target.value;
      await loadBreedData(breedId);
    });

    // Load the first breed's data if there's an initial selection
    if (breeds.length > 0) {
      await loadBreedData(breeds[0].id);
    }
  } catch (error) {
    console.error('Error loading breeds:', error);
  }
}

// Function to load breed images and information based on selected breed
async function loadBreedData(breedId) {
  try {
    // Fetch breed images and details
    const breedImagesResponse = await axios.get(`images/search?breed_ids=${breedId}&limit=10`, {
      onDownloadProgress: updateProgress
    });

    const breedImages = breedImagesResponse.data;
    const carousel = document.getElementById('carousel');
    const infoDump = document.getElementById('infoDump');

    // Clear previous carousel images and infoDump content
    carousel.innerHTML = '';
    infoDump.innerHTML = '';

    // Create carousel items for each image
    breedImages.forEach(image => {
      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      
      const img = document.createElement('img');
      img.src = image.url;
      img.alt = `Image of ${image.breeds[0].name}`;
      carouselItem.appendChild(img);
      
      const favoriteButton = document.createElement('button');
      favoriteButton.classList.add('favorite-button');
      favoriteButton.innerHTML = '❤️';
      favoriteButton.addEventListener('click', () => favorite(image.id));
      carouselItem.appendChild(favoriteButton);
      
      carousel.appendChild(carouselItem);
    });

    // Display breed info in infoDump
    if (breedImages.length > 0) {
      const breedInfo = breedImages[0].breeds[0]; // Assuming first breed info for all images
      const breedName = document.createElement('h2');
      breedName.textContent = breedInfo.name;
      infoDump.appendChild(breedName);

      const breedDescription = document.createElement('p');
      breedDescription.textContent = breedInfo.description;
      infoDump.appendChild(breedDescription);
    }
  } catch (error) {
    console.error('Error loading breed data:', error);
  }
}

// Function to toggle favorites
async function favorite(imageId) {
  try {
    // Check if image is already favorited
    const response = await axios.get(`favourites/${imageId}`);
    const isFavorited = response.data.length > 0;

    if (isFavorited) {
      // Remove from favorites
      await axios.delete(`favourites/${imageId}`);
    } else {
      // Add to favorites
      await axios.post('favourites', { image_id: imageId });
    }
    console.log('Favorite toggled');
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
}

// Function to get all favorites and display them
async function getFavourites() {
  try {
    const response = await axios.get('favourites');
    const favoriteImages = response.data;
    const carousel = document.getElementById('carousel');

    // Clear carousel and populate with favorites
    carousel.innerHTML = '';
    favoriteImages.forEach(image => {
      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      
      const img = document.createElement('img');
      img.src = image.image.url;
      img.alt = `Image of ${image.image.breeds[0].name}`;
      carouselItem.appendChild(img);
      
      const favoriteButton = document.createElement('button');
      favoriteButton.classList.add('favorite-button');
      favoriteButton.innerHTML = '❤️';
      favoriteButton.addEventListener('click', () => favorite(image.image.id));
      carouselItem.appendChild(favoriteButton);
      
      carousel.appendChild(carouselItem);
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
  }
}

// Event listener for Get Favorites button
document.getElementById('getFavouritesBtn').addEventListener('click', getFavourites);

// Initialize page
initialLoad();
