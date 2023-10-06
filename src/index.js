const express = require('express');
const { google } = require('googleapis');
const multer = require('multer');

const path = require('path');
const cors = require('cors');

const fs = require('fs');
const { Readable } = require('stream');
const app = express();

/*
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: function (req, file, callback) {
    const extension = file.originalname.split('.').pop();
    callback(null, `${Date.now()}.${extension}`);
  },
});
*/
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

app.use(cors());
/*
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'service.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const drive = google.drive({
      version: 'v3',
      auth: auth,
    });
    const uploadedFiles = [];
    console.log(req)
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const response = await drive.files.create({
        requestBody: {
          name: file.originalname,
          mimeType: file.mimeType,
          parents: ['1SqViCqnY1QWnClakePbZ3mwz2SpRILa6'],
        },
        media: {
          body: fs.createReadStream(file.path),
        },
      });
      uploadedFiles.push(response.data);
      console.log(response);
    }
    res.json({ files: uploadedFiles });
  } catch (e) {
    console.log(e);
  }
});
*/

app.post('/upload', upload.single('files'), async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'service.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const drive = google.drive({
      version: 'v3',
      auth: auth,
    });
    const uploadedFiles = [];

    const file = req.file;
    const extension = file.originalname.split('.').pop();

    const response = await drive.files.create({
      requestBody: {
        name: `${Date.now()}.${extension}`,
        mimeType: file.mimetype,
        parents: ['1SqViCqnY1QWnClakePbZ3mwz2SpRILa6'],
      },
      media: {
        mimeType: file.mimetype,
        body: Readable.from(file.buffer),
      },
    });

    uploadedFiles.push(response.data);
    console.log(response);

    res.json({ files: uploadedFiles });
  } catch (e) {
    console.log(e);
    res.status(500).send('Dosya yükleme hatası');
  }
});

app.listen(5000, () => {
  console.log('App is listening on port 5000');
});
