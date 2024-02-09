const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const multer = require('multer');
const fs = require('fs');
const {exec} = require('child_process');

const app = express();
const port = 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use authentication routes
app.use(authRoutes);

// Redirect root URL to Login.html
app.get('/', (req, res) => {
    res.redirect('/Login.html');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

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