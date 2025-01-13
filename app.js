// API URL for Open Library API (search books with pagination and search by title)
const apiUrl = 'https://openlibrary.org/search.json';
let currentPage = 1;
const searchQuery = 'JavaScript'; // Example search query for books by title

// References to DOM elements
const dataContainer = document.getElementById('data');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Function to fetch data from Open Library API
async function fetchBooks(query, page) {
    const searchUrl = `${apiUrl}?q=${query}&page=${page}&limit=5`;
    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        dataContainer.innerHTML = '<p>Error fetching data. Please try again later.</p>';
    }
}

// Function to render books to the page
function renderBooks(books) {
    dataContainer.innerHTML = ''; // Clear previous books
    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.innerHTML = `<h3>${book.title}</h3><p>${book.author_name ? book.author_name.join(', ') : 'N/A'}</p>`;
        dataContainer.appendChild(bookElement);
    });
}

// Function to handle pagination
async function handlePagination() {
    const data = await fetchBooks(searchQuery, currentPage);
    if (data && data.docs) {
        renderBooks(data.docs);
        updatePagination(data.numFound);
    }
}

// Function to update pagination buttons
function updatePagination(totalResults) {
    const totalPages = Math.ceil(totalResults / 5);
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Event listeners for pagination buttons
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        handlePagination();
    }
});

nextBtn.addEventListener('click', () => {
    currentPage++;
    handlePagination();
});

// Initial fetch to populate data
handlePagination();
