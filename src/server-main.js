const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

let cfg_doc = null;

const publicPath = path.join(__dirname, '..', 'public');
const cfgPath = path.join(__dirname, '..', 'cfg');

const iconMap = {
    ODS: 'ods.png',
    ODT: 'odt.png',
    PDF: 'pdf.png',
    CSV: 'csv.png',
    XLS: 'xls.png',
    XLSX: 'xls.png',
    DOC: 'doc.png',
    DOCX: 'doc.png',
    TXT: 'txt.png',
};

const zip = async (filePath, zipPath) => {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        output.on('close', () => {
            console.log(`✅ 壓縮完成，共 ${archive.pointer()} bytes`);
            resolve(true);
        });

        archive.on('error', (err) => {
            reject(err);
            throw err;
        });

        archive.pipe(output);
        archive.file(filePath, { name: path.basename(filePath) });
        archive.finalize();
    });
};

const rocTimeStamp = () => {
    const timestamp = Date.now();

    const date = new Date(timestamp);
    const rocYear = date.getFullYear() - 1911; // 民國年
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從0開始
    const day = String(date.getDate()).padStart(2, '0');

    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    const millisecond = String(date.getMilliseconds()).padStart(3, '0');

    return `${rocYear}${month}${day}${hour}${minute}${second}${millisecond}`;
}

const checkUploadDOC = (fileNames) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("fileNames", fileNames);
            cfg_doc = await getCFG_DOC();
            const cfgDocFiles = cfg_doc.map(item => item.file);
            const errFiles = fileNames.filter(item => !cfgDocFiles.includes(item));
            resolve({ "errFiles": errFiles });
        } catch (err) {
            reject(err);
        }
    });
}

const getCFG_DOC = () => {

    return cfg_doc ??
        new Promise((resolve, reject) => {

            const csvFile = path.join(cfgPath, 'CFG_DOC.csv');
            if (!fs.existsSync(csvFile)) {
                reject("無CFG_DOC.csv")
                return;
            };
            
            console.log(csvFile);
            cfg_doc = [];
            fs.createReadStream(csvFile, { encoding: 'utf-8' })
                .pipe(csv())
                .on('data', (row) => {
                    cfg_doc.push(row);
                })
                .on('end', () => {
                    console.log('CSV 檔案讀取完成：');
                    resolve(cfg_doc);
                });
        });
};

module.exports = {
    zip,
    rocTimeStamp,
    iconMap,
    publicPath,
    cfgPath,
    checkUploadDOC
}