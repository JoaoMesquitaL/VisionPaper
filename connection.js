const mysql = require('mysql2/promise'); // use versão com promises

function connectDB() {
  return mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "VISIONPAPER"
  });
}

async function criarPedido(payload) {
  const connection = await connectDB(); //chamando função assincrona via promisse da conexão

  //construindo insert sql
  const sql = `
    INSERT INTO PREPEDIDO
    (NumPedido, NomeCliente, ItemPedido, ValorUnitItem, QtdItem, ValorFrete, ValorTotal, Pagamento, DtEntrega, ObsPedido)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  //adaptando payload para o valores a serem passados na query
  const values = [
    Number(payload.numPedido) || null,            // INT
    String(payload.nomeCliente || ""),            // VARCHAR
    String(payload.itemPedido || ""),             // VARCHAR
    parseFloat(payload.vlUnitItem) || 0,          // FLOAT
    parseFloat(payload.qtdItem) || 0,             // FLOAT
    parseFloat(payload.vlFrete) || 0,             // FLOAT
    parseFloat(payload.vlTotal) || 0,             // FLOAT
    String(payload.formaPagto || ""),             // VARCHAR
    payload.dtEntrega 
      ? new Date(payload.dtEntrega).toISOString().slice(0, 10) // DATE (YYYY-MM-DD)
      : null,
    String(payload.obsPedido || "")               // VARCHAR
  ];

  //executando query
  const [result] = await connection.execute(sql, values);
  await connection.end();
  return result;
}

//exportando as funções
module.exports = { criarPedido, connectDB };