const tesseract = require("node-tesseract-ocr");

const config = {
  lang: "eng", // default
  oem: 3,
  psm: 3,
}

async function main() {
  try {
    const text = await tesseract.recognize("pedido15.pdf", config)

    console.log("Texto reconhecido com sucesso!")
    console.log("Resultado:", text)
  } catch (error) {
    console.log("Erro na leitura do texto\n", error.message)
  }
}

main()