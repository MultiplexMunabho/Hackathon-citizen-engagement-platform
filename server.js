const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Secret key for JWT
const SECRET_KEY = 'your_jwt_secret_key';

// Mock database (replace with real DB later)
let users = [{ username: 'admin', password: 'admin123' }];
let petitions = [];

// Route to handle login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Route to submit petition (protected by JWT)
app.post('/api/petitions', authenticateToken, (req, res) => {
  const { title, description } = req.body;
  petitions.push({ id: petitions.length + 1, title, description, votes: 0 });
  res.json({ message: 'Petition submitted' });
});

// Route to get all petitions
app.get('/api/petitions', authenticateToken, (req, res) => {
  res.json(petitions);
});

// Route to vote for a petition
app.post('/api/petitions/vote', authenticateToken, (req, res) => {
  const { id } = req.body;
  const petition = petitions.find(p => p.id === id);
  if (petition) {
    petition.votes += 1;
    res.json({ message: 'Voted successfully' });
  } else {
    res.status(404).json({ message: 'Petition not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(express.static('public'));
