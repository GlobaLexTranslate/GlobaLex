require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const authRoutes = require('./routes/auth');
const multer = require('multer');
const fs = require('fs');
const {exec} = require('child_process');
const cookieSession = require('cookie-session');
const cors = require('cors'); // Make sure to install with npm install cors
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3010;

app.use(cors()); // Use CORS to avoid cross-origin issues
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/GlobaLex')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, 'audio/', ); 
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
      console.log('Upload path:', uploadPath);
      console.log(file.originalname);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, "not-translated.wav"); 
    },
  });
  
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedFileTypes = ['.wav'];
  
      const fileExt = path.extname(file.originalname).toLowerCase();
      if (allowedFileTypes.includes(fileExt)) {
        cb(null, true);
      } else {
        print(file.path);
        cb(new Error('Invalid file type. Only WAV files are allowed.'));
      }
    },
  });
  app.post('/upload', upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        throw new Error('No file uploaded.');
      }
  
      const filePath = path.join(__dirname, 'audio', "not-translated.wav");
      console.log('dddd');
      console.log('File path:', filePath);
  
      //const fileContent = fs.readFileSync(filePath, 'utf-8');
      //console.log(`File content: ${fileContent}`);
      console.log('dddd');
      exec('node translate.js ' + filePath + ' ' + filePath.replace(".", "_translated."), (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing TheShit.js: ${error}`);
          return res.status(500).json({ success: false, message: 'Error executing TheShit.js.' });
        }
        
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        // res.json({ success: true, message: 'File uploaded and processed successfully!' });
        // webScrapeExec();
      });
    }

    catch (error) {
        console.error('Error processing file:', error.message);
        var error = "Error processing file: " + error.message
        // res.send(<script>alert("You need to upload a correct error!"); window.location.href = "/page_location"; </script>);
        // alert("'Error processing fileefef: ' + error.message ");
        res.status(500).json({ success: false, message: 'Error processing fileefef: ' + error.message });
    }
});
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.SESSION_COOKIE_KEY]
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Set up routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Streaming wav file

app.get('/stream', (req, res) => {
    const file = __dirname + '/audio/not-translated_translated.wav';
    const stat = fs.statSync(file);
    const total = stat.size;
    if (req.headers.range) {

    }
    fs.exists(file, (exists) => {
        if (exists) {
            const range = req.headers.range;
            const parts = range.replace(/bytes=/, '').split('-');
            const partialStart = parts[0];
            const partialEnd = parts[1];

            const start = parseInt(partialStart, 10);
            const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
            const chunksize = (end - start) + 1;
            const rstream = fs.createReadStream(file, {start: start, end: end});

            res.writeHead(206, {
                'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
                'Content-Type': 'audio/wav'
            });
            rstream.pipe(res);

        } else {
            res.send('Error - 404');
            res.end();
            // res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
            // fs.createReadStream(path).pipe(res);
        }
    });
});

app.get('/download', (req, res) => {
    const file = __dirname + '/audio/not-translated_translated.wav';
    res.download(file);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
