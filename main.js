document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const petitionForm = document.getElementById('petitionForm');
    const petitionsList = document.getElementById('petitionsList');
    let token = null;
  
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (data.token) {
        token = data.token;
        alert('Login successful!');
        loginForm.style.display = 'none';
        petitionForm.style.display = 'block';
        fetchPetitions();
      } else {
        alert('Login failed.');
      }
    });
  
    petitionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('petitionTitle').value;
      const description = document.getElementById('petitionDescription').value;
  
      await fetch('http://localhost:3000/api/petitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ title, description }),
      });
  
      alert('Petition submitted!');
      fetchPetitions();
    });
  
    async function fetchPetitions() {
      const response = await fetch('http://localhost:3000/api/petitions', {
        method: 'GET',
        headers: {
          'Authorization': token
        }
      });
  
      const petitions = await response.json();
      petitionsList.innerHTML = '';
      petitions.forEach((petition) => {
        const petitionElement = document.createElement('div');
        petitionElement.innerHTML = `
          <h3>${petition.title}</h3>
          <p>${petition.description}</p>
          <p>Votes: ${petition.votes}</p>
          <button onclick="vote(${petition.id})">Vote</button>
        `;
        petitionsList.appendChild(petitionElement);
      });
    }
  
    async function vote(id) {
      await fetch('http://localhost:3000/api/petitions/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ id }),
      });
  
      fetchPetitions();
    }
  
    window.vote = vote;
  });
  