// Constants and State Management
const API_URL = 'http://localhost:3000/api';
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const taskInterface = document.getElementById('taskInterface');
const createTaskForm = document.getElementById('createTaskForm');
const taskList = document.getElementById('taskList');
const searchTask = document.getElementById('searchTask');
const priorityFilter = document.getElementById('priorityFilter');
const dateFilter = document.getElementById('dateFilter');

// Auth Event Listeners
loginBtn.addEventListener('click', () => toggleForm('login'));
registerBtn.addEventListener('click', () => toggleForm('register'));
logoutBtn.addEventListener('click', handleLogout);
document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
document.getElementById('registerFormElement').addEventListener('submit', handleRegister);

// Task Event Listeners
createTaskForm.addEventListener('submit', handleCreateTask);
searchTask.addEventListener('input', debounce(handleSearch, 300));
priorityFilter.addEventListener('change', handleFilters);
dateFilter.addEventListener('change', handleFilters);

// Utility Functions
function toggleForm(type) {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    if (type === 'login') loginForm.style.display = 'block';
    if (type === 'register') registerForm.style.display = 'block';
}

function showMessage(message, type = 'success') {
    const messageContainer = document.getElementById('messageContainer');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
    setTimeout(() => messageElement.remove(), 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Auth Functions
async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.elements[0].value;
    const password = e.target.elements[1].value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            currentUser = data.user;
            showMessage('Login successful!');
            setupAuthenticatedUI();
            loadTasks();
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Login failed. Please try again.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = e.target.elements[0].value;
    const email = e.target.elements[1].value;
    const password = e.target.elements[2].value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();

        if (response.ok) {
            showMessage('Registration successful! Please login.');
            toggleForm('login');
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Registration failed. Please try again.', 'error');
    }
}

function handleLogout() {
    localStorage.removeItem('authToken');
    authToken = null;
    currentUser = null;
    setupUnauthenticatedUI();
    showMessage('Logged out successfully!');
}

// Task Functions
async function handleCreateTask(e) {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const deadline = document.getElementById('taskDeadline').value;
    const priority = document.getElementById('taskPriority').value;

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ title, description, deadline, priority })
        });
        const data = await response.json();

        if (response.ok) {
            showMessage('Task created successfully!');
            e.target.reset();
            loadTasks();
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Failed to create task. Please try again.', 'error');
    }
}

async function loadTasks(filters = {}) {
    try {
        let url = `${API_URL}/tasks`;
        const queryParams = new URLSearchParams(filters).toString();
        if (queryParams) url += `?${queryParams}`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const tasks = await response.json();

        renderTasks(tasks);
    } catch (error) {
        showMessage('Failed to load tasks.', 'error');
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-card';
        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div class="task-meta">
                <span class="priority ${task.priority}">${task.priority}</span>
                <span class="deadline">Due: ${new Date(task.deadline).toLocaleDateString()}</span>
            </div>
            <div class="task-actions">
                <button onclick="handleEditTask('${task._id}')">Edit</button>
                <button onclick="handleDeleteTask('${task._id}')">Delete</button>
            </div>
        `;
        taskList.appendChild(taskElement);
    });
}

async function handleEditTask(taskId) {
    // Implementation for editing task
    // This would typically open a modal or form with the task details
    console.log('Edit task:', taskId);
}

async function handleDeleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (response.ok) {
                showMessage('Task deleted successfully!');
                loadTasks();
            } else {
                showMessage('Failed to delete task.', 'error');
            }
        } catch (error) {
            showMessage('Failed to delete task.', 'error');
        }
    }
}

function handleSearch() {
    const searchTerm = searchTask.value;
    loadTasks({ search: searchTerm });
}

function handleFilters() {
    const filters = {
        priority: priorityFilter.value,
        date: dateFilter.value
    };
    loadTasks(filters);
}

// UI Setup Functions
function setupAuthenticatedUI() {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    taskInterface.style.display = 'block';
}

function setupUnauthenticatedUI() {
    loginBtn.style.display = 'block';
    registerBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    taskInterface.style.display = 'none';
}

// Initial Setup
function initialize() {
    if (authToken) {
        setupAuthenticatedUI();
        loadTasks();
    } else {
        setupUnauthenticatedUI();
    }
}

// Start the application
initialize();
