const express = require("express");
const multer = require("multer");

const cors = require("cors");
const { Octokit } = require("@octokit/rest");
const Buffer = require("buffer/").Buffer;
const app = express();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

app.use(cors());
const octokit = new Octokit({
  //auth: "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",
  auth: process.env.GITHUB_AUTH,
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const uploadedFiles = [];

    const file = req.file;
    //const fileContent = fs.readFileSync(file);
    const extension = file.mimetype.split("/").pop();
    const content = Buffer.from(file.buffer).toString("base64");
    //Readable.from(file.buffer);
    const name = `${Date.now()}.${extension}`;
    const { data } = await octokit.repos.createOrUpdateFileContents({
      // replace the owner and email with your own details
      owner: "yilmazcimuyar",
      repo: "ImageBase",
      path: name,
      message: `Added ${Date.now()}.${extension} programatically`,
      content,
      committer: {
        name: `yilmazcimuyar`,
        email: "yilmaz.u.237@gmail.com",
      },
      author: {
        name: "yilmazcimuyar",
        email: "yilmaz.u.237@gmail.com",
      },
    });

    uploadedFiles.push(
      "https://raw.githubusercontent.com/yilmazcimuyar/ImageBase/main/" + name
    );

    res.json({ file: uploadedFiles });
  } catch (e) {
    console.log(e);
    res.status(500).send("Dosya yükleme hatası");
  }
});

app.listen(5000, () => {
  console.log("App is listening on port 5000");
});
