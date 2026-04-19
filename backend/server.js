require('dotenv').config();
require('./middleware/errorHandler');

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { port, adminBuildPath } = require('./config');
const mediaRoutes = require('./routes/media.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/', mediaRoutes);
app.use('/admin', adminRoutes);

// Serve admin panel static files
if (fs.existsSync(adminBuildPath)) {
  app.use('/admin-panel', express.static(adminBuildPath));
  app.use('/admin-panel', (req, res) => {
    res.sendFile(path.join(adminBuildPath, 'index.html'));
  });
}

app.get('/', (req, res) => res.send('ClipVora API is active'));

app.listen(port, () => console.log(`Server running on port ${port}`));
