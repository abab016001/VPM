const db = require('../config/db');

exports.insert = (paramObj) => {
    try {
        const sql = `
            insert into DOC_CONFIG (name, content, seq) values ($name, $content, $seq)
        `;
        const paramList = paramObj;
        const result = db.batchInsert(sql, paramList);
        return result;
    } catch(err) {
        console.error(err);
    }
}