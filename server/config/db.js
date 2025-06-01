console.log("db.js");

const Database = require('better-sqlite3');

// 建立資料庫
const db = new Database('mydb.sqlite');

// 建立資料表
const tables = [
    {"nm": "DOC_CONFIG", "ddl": "create table if not exists DOC_CONFIG (name TEXT, content TEXT, seq INTEGER)"}
];
const createTables = db.transaction(() => {
    for (const table of tables) {
        db.exec(table.ddl);
    }
});
createTables();

exports.insertAsync = async(sql, param) => {
    return new Promise((resolve, reject) => {
        db.run(sql, param, (err) => {
            if (err) reject(err);
            else resolve(null);
        })
    });
}