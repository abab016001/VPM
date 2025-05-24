const upLoadCFG_DOC = document.getElementById("upload-cfg-doc");
upLoadCFG_DOC.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file.name != "CFG_DOC.csv") return alert("請匯入CFG_DOC.csv");
    const reader = new FileReader();
    reader.onload = async (event) => {
        const content = event.target.result.split('\r\n');

        const sArray = [","];
        let line0 = "";
        for (const s of sArray) {
            if (content[0].includes(s)) {
                line0 = content[0].split(s);
                break;
            }
        }
        const err0 = "匯入檔案格式有誤，第一行應該長這樣：\r\n root,file";
        if (line0.length < 2)   return alert(err0);
        if (line0[0] != "root") return alert(err0);
        if (line0[1] != "file") return alert(err0);
        const err1 = "只有標題沒有內容，確定要匯入嗎？";
        if (content.length == 1 && !confirm(err1)) return;

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:3000/upload/cfg-doc', {
            method: "POST",
            body: formData
        });

        const result = await response.text();
        alert(result);
    };
    reader.readAsText(file, 'utf-8');
});

const processExport = (mode) => {
    console.log("processExport");

    if (mode == "doc") {
        const url = "http://localhost:3000/download/cfg/CFG_DOC.csv";
        window.location.href = url;
    }
};

const processImport = (mode) => {
    console.log("processImport");
    upLoadCFG_DOC.click();
};