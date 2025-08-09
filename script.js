const vehicleGrid = document.getElementById('vehicleGrid');
const vehicleModal = document.getElementById('vehicleModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.querySelector('.close');

let vehicleData = [];
let currentFilter = 'all';

async function loadVehicleData() {
  try {
    const response = await fetch('./vehicles.json');
    vehicleData = await response.json();
    renderVehicles();
  } catch (error) {
    console.error('Error loading vehicle data:', error);
  }
}

function renderVehicles(filter = 'all') {
  vehicleGrid.innerHTML = '';
  
  const filteredVehicles = filter === 'all' 
    ? vehicleData 
    : vehicleData.filter(vehicle => vehicle.type === filter);
  
  if (filteredVehicles.length === 0) {
    vehicleGrid.innerHTML = '<p style="text-align: center; color: #666; font-size: 1.2rem;">No vehicles found in this category.</p>';
    return;
  }
  
  filteredVehicles.forEach(vehicle => {
    const vehicleCard = createVehicleCard(vehicle);
    vehicleGrid.appendChild(vehicleCard);
  });
  
  // Initialize lazy loading for new images
  initLazyLoading();
}

// Lazy loading implementation
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('.lazy-image');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy-image');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy-image');
      img.classList.add('loaded');
    });
  }
}

function createVehicleCard(vehicle) {
  const card = document.createElement('div');
  card.className = 'vehicle-card';
  card.onclick = () => showVehicleDetails(vehicle);
  
  card.innerHTML = `
    <div class="vehicle-image">
      <img 
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f8f9fa'/%3E%3C/svg%3E" 
        data-src="${vehicle.image}" 
        alt="${vehicle.company} ${vehicle.name}"
        class="lazy-image"
        loading="lazy"
      />
    </div>
    <div class="vehicle-info">
      <div class="vehicle-company">${vehicle.company}</div>
      <h3 class="vehicle-name">${vehicle.name}</h3>
      <span class="vehicle-type">${vehicle.type}</span>
      <div class="vehicle-price">${vehicle.price}</div>
      <div class="vehicle-specs">
        <span class="spec-item">${vehicle.engine}</span>
        <span class="spec-item">${vehicle.power}</span>
        <span class="spec-item">${vehicle.topSpeed}</span>
      </div>
    </div>
  `;
  
  return card;
}

function showVehicleDetails(vehicle) {
  const specsHtml = Object.entries(vehicle.specs).map(([key, value]) => `
    <div class="modal-spec-item">
      <div class="modal-spec-label">${key}</div>
      <div class="modal-spec-value">${value}</div>
    </div>
  `).join('');
  
  modalContent.innerHTML = `
    <div class="modal-vehicle-image">
      <img 
        src="${vehicle.image}" 
        alt="${vehicle.company} ${vehicle.name}"
        class="modal-image"
      />
    </div>
    <div class="modal-vehicle-info">
      <div class="modal-vehicle-company">${vehicle.company}</div>
      <h2>${vehicle.name}</h2>
      <div class="vehicle-type">${vehicle.type}</div>
      <div class="vehicle-price" style="font-size: 1.5rem; margin: 1rem 0;">${vehicle.price}</div>
      <p class="modal-vehicle-description">${vehicle.description}</p>
      <div class="modal-specs-grid">
        ${specsHtml}
      </div>
    </div>
  `;
  
  vehicleModal.style.display = 'block';
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderVehicles(currentFilter);
  });
});

closeModal.onclick = () => {
  vehicleModal.style.display = 'none';
};

window.onclick = (event) => {
  if (event.target === vehicleModal) {
    vehicleModal.style.display = 'none';
  }
};

document.getElementById('toggleMode').addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const toggleBtn = document.getElementById('toggleMode');
  toggleBtn.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
});

loadVehicleData();
