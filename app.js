const apiUrl = 'https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0';
let currentPage = 1;
let totalPages = 0;
const postsPerPage = 5;

// References to DOM elements
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const dataContainer = document.getElementById('data');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Function to fetch posts from the API
async function fetchPosts(query = '', page = 1) {
    const startIndex = (page - 1) * postsPerPage;
    const searchParam = query ? `&q=${query}` : '';
    const url = `${apiUrl}?_start=${startIndex}&_limit=${postsPerPage}${searchParam}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        totalPages = Math.ceil(100 / postsPerPage); // We assume the API has 100 posts
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to render posts to the page
function renderPosts(posts) {
    dataContainer.innerHTML = ''; // Clear previous posts
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p>`;
        dataContainer.appendChild(postElement);
    });
}

// Function to handle search button click
async function handleSearch() {
    const query = searchInput.value.trim();
    currentPage = 1; // Reset to first page on new search
    const posts = await fetchPosts(query, currentPage);
    renderPosts(posts);
    updatePagination();
}

// Function to handle pagination button clicks
function updatePagination() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Function to handle "Next" button
async function handleNextPage() {
    currentPage++;
    const query = searchInput.value.trim();
    const posts = await fetchPosts(query, currentPage);
    renderPosts(posts);
    updatePagination();
}

// Function to handle "Previous" button
async function handlePrevPage() {
    currentPage--;
    const query = searchInput.value.trim();
    const posts = await fetchPosts(query, currentPage);
    renderPosts(posts);
    updatePagination();
}

// Event listeners
searchBtn.addEventListener('click', handleSearch);
nextBtn.addEventListener('click', handleNextPage);
prevBtn.addEventListener('click', handlePrevPage);

// Initial fetch when the page loads
(async () => {
    const posts = await fetchPosts('', currentPage);
    renderPosts(posts);
    updatePagination();
})();

