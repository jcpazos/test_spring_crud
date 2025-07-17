// Global variables
let entities = [];
let entityToDelete = null;

// API Base URL - Update this to match your Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/APIRestTrainer/trainer';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadEntities();
    }
});

// CRUD Operations

// READ - Get all entities
async function getList() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch entities');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching entities:', error);
        // Return mock data for demonstration
        return getMockData();
    }
}

// CREATE - Add new entity
async function createEntity() {
    const form = document.getElementById('createForm');
    const formData = new FormData(form);
    
    const entity = {
        nombre: formData.get('nombre'),
        correo: formData.get('correo'),
        contraseña: formData.get('contrasena')
    };

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entity)
        });

        if (!response.ok) {
            throw new Error('Failed to create entity');
        }

        alert('Entity created successfully!');
        redirectToList();
    } catch (error) {
        console.error('Error creating entity:', error);
        alert('Failed to create entity. Please try again.');
    }
}

// UPDATE - Modify existing entity
async function updateEntity() {
    const form = document.getElementById('updateForm');
    const formData = new FormData(form);
    
    const entityId = formData.get('id');
    const entity = {
        id: entityId,
        nombre: formData.get('nombre'),
        correo: formData.get('correo'),
        contraseña: formData.get('contrasena')
    };

    try {
        const response = await fetch(`${API_BASE_URL}/${entityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entity)
        });

        if (!response.ok) {
            throw new Error('Failed to update entity');
        }

        alert('Entity updated successfully!');
        redirectToList();
    } catch (error) {
        console.error('Error updating entity:', error);
        alert('Failed to update entity. Please try again.');
    }
}

// DELETE - Remove entity
async function deleteEntity(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete entity');
        }

        alert('Entity deleted successfully!');
        loadEntities(); // Refresh the list
    } catch (error) {
        console.error('Error deleting entity:', error);
        alert('Failed to delete entity. Please try again.');
    }
}

// UI Helper Functions

// Load and display entities in the table
async function loadEntities() {
    try {
        entities = await getList();
        displayEntities(entities);
    } catch (error) {
        console.error('Error loading entities:', error);
    }
}

// Display entities in the table
function displayEntities(entitiesToShow) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    entitiesToShow.forEach(entity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entity.id}</td>
            <td>${entity.nombre}</td>
            <td>${entity.correo}</td>
            <td>
                <button class="btn btn-edit" onclick="redirectToUpdate(${entity.id}, '${entity.nombre}', '${entity.correo}', '${entity.contraseña}')">Edit</button>
                <button class="btn btn-danger" onclick="showDeleteModal(${entity.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Filter table based on search input
function filterTable() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredEntities = entities.filter(entity => 
        entity.nombre.toLowerCase().includes(searchTerm)
    );
    displayEntities(filteredEntities);
}

// Navigation Functions
function redirectToCreate() {
    window.location.href = 'create.html';
}

function redirectToUpdate(id, nombre, correo, contrasena) {
    window.location.href = `update.html?id=${id}&nombre=${encodeURIComponent(nombre)}&correo=${encodeURIComponent(correo)}&contrasena=${encodeURIComponent(contrasena)}`;
}

function redirectToList() {
    window.location.href = 'index.html';
}

// Modal Functions
function showDeleteModal(id) {
    entityToDelete = id;
    document.getElementById('deleteModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('deleteModal').style.display = 'none';
    entityToDelete = null;
}

function confirmDelete() {
    if (entityToDelete) {
        deleteEntity(entityToDelete);
        closeModal();
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('deleteModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Load entity data for update form
async function loadEntityForUpdate() {
    const urlParams = new URLSearchParams(window.location.search);
    const entityId = urlParams.get('id');
    const nombre = urlParams.get('nombre');
    const correo = urlParams.get('correo');
    const contrasena = urlParams.get('contrasena');

    const entity = {
        id: entityId,
        nombre: nombre,
        correo: correo,
        contraseña: contrasena
    }
    
    if (!entityId) {
        alert('No entity ID provided');
        redirectToList();
        return;
    }

    try {
        // Populate form fields
        document.getElementById('entityId').value = entity.id;
        document.getElementById('nombre').value = entity.nombre;
        document.getElementById('correo').value = entity.correo;
        document.getElementById('contraseña').value = entity.contraseña;
        
    } catch (error) {
        console.error('Error loading entity for update:', error);
        // Use mock data for demonstration
        const mockEntity = getMockEntityById(entityId);
        if (mockEntity) {
            document.getElementById('entityId').value = mockEntity.id;
            document.getElementById('nombre').value = mockEntity.nombre;
            document.getElementById('description').value = mockEntity.description;
            document.getElementById('status').value = mockEntity.status;
        } else {
            alert('Entity not found');
            redirectToList();
        }
    }
}

// Mock Data Functions (for demonstration when backend is not available)
function getMockData() {
    return [
        {
            id: 1,
            nombre: 'Sample Entity 1',
            correo: 'jose.pazos@hotmail.com'
        },
        {
            id: 2,
            nombre: 'Sample Entity 2',
            correo: 'kathiabg@hotmail.com'
        },
        {
            id: 3,
            nombre: 'Sample Entity 3',
            correo: 'kathiabg@gmail.com'
        }
    ];
}

function getMockEntityById(id) {
    const mockData = getMockData();
    return mockData.find(entity => entity.id == id);
}
