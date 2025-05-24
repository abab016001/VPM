const iframe = document.getElementById("IFRAME");
const page = "./src/page/";

const processCFG = () => {
    console.log("processCFG 參數維護");
    iframe.src = page + 'cfg/v1.html';
}

const processFN_IN = () => {
    console.log("processFN_IN 程式進館");
    iframe.src = page + 'fn-in/v1.html';
}

const processFN_OUT = () => {
    console.log("processFN_OUT 程式提領");
    iframe.src = page + 'fn-out/v1.html';
}

const processDOC_IN = () => {
    console.log("processDOC_IN 文件進館");
    iframe.src = page + 'doc-in/v1.html';
}

const processDOC_OUT = () => {
    console.log("processDOC_OUT 文件提領");
    iframe.src = page + 'doc-out/v1.html';
}

processCFG();