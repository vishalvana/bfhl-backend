const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

const allowedOrigins = ['https://bfhl-frontend-peach-seven.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) { 
      callback(null, true); 
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// GET endpoint: /bfhl
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Helper functions
const isNumeric = (str) => !isNaN(str);
const isAlphabet = (str) => /^[A-Za-z]+$/.test(str);

const getHighestAlphabet = (alphabets) => {
  if (alphabets.length === 0) return [];
  return [alphabets.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }))[0]];
};

// POST endpoint: /bfhl
app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ is_success: false, message: 'Invalid input format' });
    }

    const numbers = [];
    const alphabets = [];

    data.forEach(item => {
      if (isNumeric(item)) {
        numbers.push(item);
      } else if (isAlphabet(item)) {
        alphabets.push(item);
      }
    });

    const userDetails = {
      user_id: "Vishal_Vana_05092003",
      email: "22bcs10526@cuchd.in",
      roll_number: "22BCS10526"
    };

    const response = {
      is_success: true,
      ...userDetails,
      numbers,
      alphabets,
      highest_alphabet: getHighestAlphabet(alphabets)
    };

    res.json(response);
  } catch (error) {
    console.error(error); // ✅ Log errors for debugging
    res.status(500).json({ is_success: false, message: "Server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
