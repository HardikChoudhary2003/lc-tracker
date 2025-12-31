// Main entry point for the frontend application

const API_URL = import.meta.env.VITE_API_URL;
let currentPage = 1;
let currentType = 'all';
let currentUser = null;

// --- DOM Elements ---
const app = document.getElementById('app');

// --- Templates ---
const templates = {
  login: `
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center p-8 bg-white rounded-xl shadow-xl max-w-md w-full">
        <h1 class="text-3xl font-bold mb-4 text-gray-800">LeetCode Contest Tracker</h1>
        <p class="mb-6 text-gray-600 text-sm">Please sign in with Google to track your contest progress.</p>
        <a 
          href="${API_URL}/auth/google" 
          class="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition"
        >
          Sign in with Google
        </a>
      </div>
    </div>
  `,
  dashboard: `
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">LeetCode Contest Tracker</h1>
        <div id="userInfoSection" class="hidden relative">
          <button id="profileIconBtn" class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span id="userInitials" class="font-semibold">U</span>
          </button>
          <div id="profileDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button id="addSessionKeyBtn" class="text-left text-sm text-blue-600 hover:underline">Add Session Key</button>
            <div id="sessionKeyInputGroup" class="mt-2 hidden">
              <input type="text" id="sessionKeyInput" placeholder="Enter your LEETCODE_SESSION key"
                     class="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring" />
              <button id="saveSessionKeyBtn"
                      class="mt-1 w-full bg-blue-600 text-white text-sm rounded px-2 py-1 hover:bg-blue-700">
                Save
              </button>
            </div>
            <a href="${API_URL}/auth/logout" id="logoutBtn" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
          </div>
        </div>
      </div>
      <div id="trackerSection" class="hidden">
        <p id="welcomeMessage" class="text-lg font-medium mb-4 text-center"></p>
        <div class="flex justify-center mb-6 space-x-4">
          <button class="filter-btn px-4 py-2 bg-blue-500 text-white rounded" data-type="all">All</button>
          <button class="filter-btn px-4 py-2 bg-blue-500 text-white rounded" data-type="weekly">Weekly</button>
          <button class="filter-btn px-4 py-2 bg-blue-500 text-white rounded" data-type="biweekly">Biweekly</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full bg-white rounded shadow">
            <thead class="bg-gray-200 text-left">
              <tr>
                <th class="py-3 px-6">Contest</th>
                <th class="py-3 px-6">Problem A</th>
                <th class="py-3 px-6">Problem B</th>
                <th class="py-3 px-6">Problem C</th>
                <th class="py-3 px-6">Problem D</th>
              </tr>
            </thead>
            <tbody id="contestTableBody"></tbody>
          </table>
        </div>
        <div class="flex justify-center mt-6 space-x-4">
          <button id="prevPage" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Previous</button>
          <span id="pageDisplay" class="px-4 py-2"></span>
          <button id="nextPage" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Next</button>
        </div>
      </div>
    </div>
  `
};

// --- Functions ---
async function checkAuthStatus() {
  try {
    const res = await fetch(`${API_URL}/auth/status`, { credentials: 'include' });
    const data = await res.json();
    if (data.isAuthenticated && data.user) {
      currentUser = data.user;
      renderDashboard();
    } else {
      renderLogin();
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    renderLogin();
  }
}

function renderLogin() {
  app.innerHTML = templates.login;
}

function renderDashboard() {
  app.innerHTML = templates.dashboard;
  document.getElementById('welcomeMessage').textContent = `Welcome, ${currentUser.displayName}!`;
  loadContests();
}

async function loadContests() {
  const contestTableBody = document.getElementById('contestTableBody');
  contestTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Loading...</td></tr>';
  try {
    const res = await fetch(`${API_URL}/api/dashboard-data?page=${currentPage}&type=${currentType}`, { credentials: 'include' });
    const data = await res.json();
    renderContests(data.contests);
  } catch (error) {
    console.error('Error loading contests:', error);
    contestTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-red-500">Error loading contests.</td></tr>';
  }
}

function renderContests(contests) {
  const contestTableBody = document.getElementById('contestTableBody');
  contestTableBody.innerHTML = contests.map(contest => `
    <tr class="border-b border-gray-200">
      <td class="py-3 px-6">${contest.title}</td>
      ${contest.problems.slice(0, 4).map(problem => `
        <td class="py-3 px-6">
          <a href="https://leetcode.com/problems/${problem.titleSlug}/" target="_blank" class="text-blue-600 hover:underline">
            ${problem.title}
          </a>
        </td>
      `).join('')}
    </tr>
  `).join('');
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', checkAuthStatus);