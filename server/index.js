const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to receive form data
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  const newMessage = {
    name,
    email,
    phone,
    message,
    submittedAt: new Date().toISOString(),
  };

  const filePath = path.join(__dirname, 'messages.json');

  // Append or create messages.json
  fs.readFile(filePath, 'utf8', (err, data) => {
    let messages = [];
    if (!err && data) {
      messages = JSON.parse(data);
    }

    messages.push(newMessage);

    fs.writeFile(filePath, JSON.stringify(messages, null, 2), (err) => {
      if (err) {
        console.error('Error saving message:', err);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
