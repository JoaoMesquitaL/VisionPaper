let mysql = require('mysql2');

function connectDB(){
    let connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "VISIONPAPER"
    });

    connection.connect((err) => {
    if (err) {
      console.error('Erro ao conectar no banco:', err);
      return;
    }
    console.log('Conectado ao banco com sucesso!');
    });

    return connection;
}

module.exports = connectDB;