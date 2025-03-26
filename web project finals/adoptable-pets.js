// Pet Data
const allPets = [
    { 
        id: 1, name: "REX", age: "3 years", breed: "Tabby Cat", 
        gender: "Male", status: "Pending Adoption", image: "rex.jpg",
        description: "Friendly and playful companion"
    },
    // Add ALL your other pets here...
];

// DOM Elements
const petsGallery = document.getElementById('petsGallery');
const paginationDiv = document.getElementById('pagination');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchBox = document.querySelector('.search-box');
const showPaginationBtn = document.getElementById('showPagination');
const showLoadMoreBtn = document.getElementById('showLoadMore');

// Configuration
const petsPerPage = 6;
let currentView = 'pagination'; // 'pagination' or 'loadMore'
let currentPage = 1;
let visiblePets = petsPerPage;
let filteredPets = [...allPets];

// Initialize
function init() {
    renderPets();
    setupEventListeners();
    updateView();
}

// Render pets based on current view
function renderPets() {
    petsGallery.innerHTML = '';
    
    const petsToShow = currentView === 'loadMore' 
        ? filteredPets.slice(0, visiblePets)
        : filteredPets.slice((currentPage-1)*petsPerPage, currentPage*petsPerPage);
    
    if (petsToShow.length === 0) {
        petsGallery.innerHTML = '<p class="no-results">No pets found matching your search.</p>';
        return;
    }
    
    petsToShow.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.innerHTML = `
            <img src="${pet.image}" alt="${pet.name}" class="pet-image">
            <div class="pet-info">
                <h3>${pet.name}</h3>
                <p><strong>Age:</strong> ${pet.age}</p>
                <p><strong>Breed:</strong> ${pet.breed}</p>
                <p class="pet-description">${pet.description}</p>
                <span class="status">${pet.status}</span>
                <button class="adopt-btn" data-pet-id="${pet.id}">
                    ADOPT
                </button>
            </div>
        `;
        petsGallery.appendChild(petCard);
    });
    
    updateNavigation();
}

// Update navigation based on current view
function updateNavigation() {
    if (currentView === 'pagination') {
        renderPagination();
        loadMoreBtn.style.display = 'none';
    } else {
        paginationDiv.style.display = 'none';
        loadMoreBtn.style.display = visiblePets < filteredPets.length ? 'block' : 'none';
    }
}

// Handle view switching
function updateView() {
    if (currentView === 'pagination') {
        showPaginationBtn.disabled = true;
        showLoadMoreBtn.disabled = false;
        paginationDiv.style.display = 'flex';
        loadMoreBtn.style.display = 'none';
    } else {
        showPaginationBtn.disabled = false;
        showLoadMoreBtn.disabled = true;
        paginationDiv.style.display = 'none';
        loadMoreBtn.style.display = 'block';
    }
    renderPets();
}

// Pagination functions
function renderPagination() {
    paginationDiv.innerHTML = '';
    const totalPages = Math.ceil(filteredPets.length / petsPerPage);
    
    if (totalPages <= 1) return;
    
    // Previous Button
    const prevBtn = createPageBtn('« Previous', currentPage > 1, () => {
        currentPage--;
        renderPets();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationDiv.appendChild(prevBtn);
    
    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = createPageBtn(i, true, () => {
            currentPage = i;
            renderPets();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        if (i === currentPage) pageBtn.classList.add('active');
        paginationDiv.appendChild(pageBtn);
    }
    
    // Next Button
    const nextBtn = createPageBtn('Next »', currentPage < totalPages, () => {
        currentPage++;
        renderPets();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationDiv.appendChild(nextBtn);
}

function createPageBtn(text, enabled, onClick) {
    const btn = document.createElement('button');
    btn.className = `page-btn ${enabled ? '' : 'disabled'}`;
    btn.textContent = text;
    if (enabled) btn.addEventListener('click', onClick);
    return btn;
}

// Load More functionality
function loadMorePets() {
    visiblePets += petsPerPage;
    renderPets();
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

// Handle adoption
function handleAdoption(e) {
    if (e.target.classList.contains('adopt-btn')) {
        const petId = parseInt(e.target.dataset.petId);
        const pet = allPets.find(p => p.id === petId);
        if (pet) {
            sessionStorage.setItem('selectedPet', JSON.stringify(pet));
            window.location.href = 'adoption-confirmation.html';
        }
    }
}

// Search functionality
function handleSearch() {
    const term = searchBox.value.toLowerCase();
    filteredPets = allPets.filter(pet => 
        pet.name.toLowerCase().includes(term) || 
        pet.breed.toLowerCase().includes(term) ||
        pet.description.toLowerCase().includes(term)
    );
    
    // Reset view
    currentPage = 1;
    visiblePets = petsPerPage;
    
    renderPets();
}

// Event Listeners
function setupEventListeners() {
    searchBox.addEventListener('input', handleSearch);
    document.addEventListener('click', handleAdoption);
    loadMoreBtn.addEventListener('click', loadMorePets);
    showPaginationBtn.addEventListener('click', () => {
        currentView = 'pagination';
        updateView();
    });
    showLoadMoreBtn.addEventListener('click', () => {
        currentView = 'loadMore';
        updateView();
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', init);