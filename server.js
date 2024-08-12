const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
let users = {};

app.post('/api/users', (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) {
    return res.status(400).send('User ID and name are required');
  }
  if (users[id]) {
    return res.status(400).send('User already exists');
  }
  users[id] = { id, name, balance: 0 };
  res.status(201).send(users[id]);
});

app.post('/api/deposit', (req, res) => {
  const { id, amount } = req.body;
  if (!id || amount === undefined) {
    return res.status(400).send('User ID and amount are required');
  }
  if (!users[id]) {
    return res.status(404).send('User not found');
  }
  users[id].balance += amount;
  res.status(200).send(users[id]);
});

app.post('/api/withdraw', (req, res) => {
  const { id, amount } = req.body;
  if (!id || amount === undefined) {
    return res.status(400).send('User ID and amount are required');
  }
  if (!users[id]) {
    return res.status(404).send('User not found');
  }
  if (users[id].balance < amount) {
    return res.status(400).send('Insufficient balance');
  }
  users[id].balance -= amount;
  res.status(200).send(users[id]);
});

app.get('/api/users/:id/balance', (req, res) => {
  const { id } = req.params;
  if (!users[id]) {
    return res.status(404).send('User not found');
  }
  res.status(200).send({ balance: users[id].balance });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
