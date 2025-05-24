const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const fsp = require('fs').promises;

const { zip, rocTimeStamp } = require('./server-main');
const { publicPath, cfgPath, iconMap } = require('./server-main');
const { checkUploadDOC } = require('./server-main');


const path = require('path');
const app = express();
const PORT = 3000;

// 設定zip路徑
const cfgZipDir = path.join(__dirname, '..', 'cfg', 'zip');
if (!fs.existsSync(cfgZipDir)) fs.mkdirSync(cfgZipDir);

app.use(express.json());
app.use(cors({
    origin: "http://127.0.0.1:5501"
}));

// 設定 multer 存檔
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${rocTimeStamp()}${ext}`);
    }
});
const upload = multer({ storage });

app.use('/icons', express.static(publicPath));
app.get('/api/file-icons', (req, res) => {
    const result = {};
    for (const [ext, filename] of Object.entries(iconMap)) {
        result[ext] = `/icons/${filename}`;
    }
    res.json(result);
});

app.get('/download/cfg/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(cfgPath, filename);
    res.download(filePath, filename, (err) => {
        if (err) res.status(404).send('檔案找不到');
    });
});

app.post('/upload/cfg-doc', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('沒有收到檔案');

    const tempPath = req.file.path;
    const csvPath = path.join(cfgPath, 'CFG_DOC.csv');
    const zipPath = path.join(cfgZipDir, path.basename(tempPath));

    console.log({ tempPath, csvPath })
    try {
        (async () => {
            await zip(cfgPath, zipPath);
            fsp.rename(tempPath, csvPath);
            console.log('上傳成功，檔案資訊');
            res.status(200).send('檔案上傳成功！');
        })();
    } catch (e) {
        res.status(500).send('檔案上傳失敗！');
    }
});

app.post('/api/doc-check', async (req, res) => {
    try {
        const fileNames = req.body;
        const rtn = await checkUploadDOC(fileNames);
        if (rtn.errFiles && rtn.errFiles.length > 0) {
            res.status(201).send({ "errFiles": rtn.errFiles });
        } else {
            res.status(200).send(true);
        }
    } catch (err) {
        console.log("/api/doc-check-error", err);
        res.status(500).send({ "exception": err });
    }
});



app.listen(PORT, () => {
    console.log(`Server running at http:localhost:${PORT}`);
});