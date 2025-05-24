const dropZone = document.getElementById('drop-zone');
const fileUpload = document.getElementById('file-upload');
let fileMap = {};
let iconMap = null;

// 防止預設行為（例如開啟檔案）
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, e => e.preventDefault());
    document.body.addEventListener(eventName, e => e.preventDefault());
});

dropZone.addEventListener('dragover', () => {
    dropZone.style.borderColor = '#333';
    dropZone.style.color = '#333';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#aaa';
    dropZone.style.color = '#666';
});

dropZone.addEventListener('drop', (e) => {
    dropZone.style.borderColor = '#aaa';
    dropZone.style.color = '#666';

    const files = e.dataTransfer.files; // FileList 物件
    [...files].forEach(f => {
        fileMap[f.name] = f;
    });

    renderFileList();
});

fileUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    [...files].forEach(f => {
        fileMap[f.name] = f;
    });

    renderFileList();
});

const processAddFile = () => {
    fileUpload.click();
};

const processRemoveFile = (e) => {
    const name = e.getAttribute('data-name');
    const newIds = Object.keys(fileMap).filter(id => id != name);
    const newFileMap = {};
    for (let id of newIds) {
        newFileMap[id] = fileMap[id];
    }

    fileMap = newFileMap;
    renderFileList();
};

const processSummary = (disable = false) => {
    const txt_submit = document.getElementById("txt-submit");
    const btn_submit = document.getElementById("btn-submit");

    if (disable) txt_submit.value = "";
    if (txt_submit.value == "") {
        btn_submit.classList.add("btn-disable");
        btn_submit.disabled = true;
    } else {
        btn_submit.classList.remove("btn-disable");
        btn_submit.removeAttribute('disabled');
    }
};

const processUpload = async () => {
    const disabled = document.getElementById("btn-submit").disabled;
    if (disabled) return;
    try {
        const __check = await check();
        if (__check.errFiles && __check.errFiles.length > 0) {
            renderFairList(__check.errFiles);
        } else {
            renderFileList();
        }
    } catch (err) {
        console.log("err", err);
    }
};

const renderFileList = async () => {
    const none_block = document.getElementById("drop-zone-none");
    const files_block = document.getElementById("drop-zone-files");
    const fair_block = document.getElementById("drop-zone-fair");
    const count_block = document.getElementById("drop-zone-files-count");
    const kb_block = document.getElementById("drop-zone-files-kb");
    const ul_block = document.getElementById("drop-zone-files-ul");
    const li_tmp = document.getElementById("tmp-file-li").innerHTML;

    fair_block.style.display = "none";

    // 模式切換
    const count = Object.keys(fileMap).length;
    if (count == 0) {
        // 無上傳檔案
        none_block.style.display = "flex";
        files_block.style.display = "none";
        processSummary(true);
    } else {
        // 有上傳檔案
        none_block.style.display = "none";
        files_block.style.display = "flex";
        processSummary();
    }

    if (count == 0) return;

    // 有上傳檔案 - FILE INFO
    count_block.textContent = count;
    kb_block.textContent = (Object.values(fileMap).reduce((acc, f) => acc + parseInt(f.size), 0) / 1024).toFixed(2) + "KB";

    const othMap = {};
    const imgMap = {};

    // FILE LIST
    ul_block.innerHTML = Object.values(fileMap).reduce((acc, f) => {
        const type = f.name.split('.').pop().toUpperCase();
        const id = `file-img-${f.name}`;

        if (f.type.startsWith('image/')) imgMap[id] = f;
        else othMap[type] ? othMap[type].push(id) : othMap[type] = [id];

        const value = [
            { "from": "@file-name-txt", "to": f.name },
            { "from": "@file-type-txt", "to": type },
            { "from": "@file-kb-txt", "to": (parseInt(f.size) / 1024).toFixed(2) + "KB" },
            { "from": "@file-img-id", "to": id },
        ];
        const li = value.reduce((acc, cur) => acc.replaceAll(cur.from, cur.to), li_tmp);
        return acc + li;
    }, "");

    // FILE IMG
    for (let id in imgMap) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById(id);
            preview.src = e.target.result;
        };
        reader.readAsDataURL(imgMap[id]);
    }

    iconMap = iconMap ?? await getIconMap();
    for (let type in othMap) {
        if (iconMap[type]) {
            othMap[type].forEach(id => document.getElementById(id).src = iconMap[type]);
        }
    }
}

const renderFairList = async (fairList) => {
    const none_block = document.getElementById("drop-zone-none");
    const files_block = document.getElementById("drop-zone-files");
    const fair_block = document.getElementById("drop-zone-fair");
    const count_block = document.getElementById("drop-zone-fair-count");
    const kb_block = document.getElementById("drop-zone-fair-kb");
    const ul_block = document.getElementById("drop-zone-fair-ul");
    const li_tmp = document.getElementById("tmp-fair-li").innerHTML;
    none_block.style.display = "none";
    files_block.style.display = "none";
    fair_block.style.display = "flex";

    const fairMap = {};
    for (const file of Object.values(fileMap)) {
        if (fairList.includes(file.name)) {
            fairMap[file.name] = file;
        }
    }

    count_block.textContent = fairList.length;
    kb_block.textContent = (Object.values(fairMap).reduce((acc, f) => acc + parseInt(f.size), 0) / 1024).toFixed(2) + "KB";

    const othMap = {};
    const imgMap = {};

    // FILE LIST
    ul_block.innerHTML = Object.values(fairMap).reduce((acc, f) => {
        const type = f.name.split('.').pop().toUpperCase();
        const id = `fair-img-${f.name}`;

        if (f.type.startsWith('image/')) imgMap[id] = f;
        else othMap[type] ? othMap[type].push(id) : othMap[type] = [id];

        const value = [
            { "from": "@fair-name-txt", "to": f.name },
            { "from": "@fair-type-txt", "to": type },
            { "from": "@fair-img-id", "to": id },
        ];
        const li = value.reduce((acc, cur) => acc.replaceAll(cur.from, cur.to), li_tmp);
        return acc + li;
    }, "");

    // FILE IMG
    for (let id in imgMap) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById(id);
            preview.src = e.target.result;
        };
        reader.readAsDataURL(imgMap[id]);
    }

    iconMap = iconMap ?? await getIconMap();
    for (let type in othMap) {
        if (iconMap[type]) {
            othMap[type].forEach(id => document.getElementById(id).src = iconMap[type]);
        }
    }
};

const getIconMap = () => {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3000/api/file-icons')
            .then(res => res.json())
            .then(data => {
                const rtn = {};
                for (const [key, value] of Object.entries(data)) {
                    rtn[key] = `http://localhost:3000${value}`;
                }
                resolve(rtn);
            })
            .catch(err => {
                reject(err);
            });
    })
};

const check = () => {
    const fileNames = Object.values(fileMap).map(f => f.name);
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3000/api/doc-check', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fileNames)
        })
            .then(res => res.json())
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
    });
}

renderFileList();