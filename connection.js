let mysql = require('mysql2');

let conn = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "VISIONPAPER"
});

conn.connect(function(err){
    if(err) throw err;
    console.log("Conectado ao banco de dados!")
})

