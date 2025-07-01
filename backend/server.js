const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./passport');

const app = express();
app.use(cors());
app.use(express.json());
app.use(session({ secret: 'your_session_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/document');
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error('MongoDB connection error:', err));

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'Server error' });
}); 