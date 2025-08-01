const { Poppler } = require("node-poppler"); //requerendo poppler para conversão de PDF para PNG
const tesseract = require("node-tesseract-ocr"); //requerendo tesseract para reconhecimento de texto em imagens

/*
definindo as configurações do Tesseract onde: 
lang = idioma do texto a ser reconhecido (default é inglês)
oem = modo de reconhecimento (0 legacy engine only, 1 LSTM engine only, 2 legacy + LSTM, 3 default)
psm = modo de segmentação de página (3 é o modo padrão, 6 é para uma única coluna de texto)
*/
const config = {
  lang: "eng", // default
  oem: 3,
  psm: 3,
}

//Definindo variaveis para interagir com o Poppler
var pginicio = 1; //incio da página a ser convertida
var pgfim = 1; //fim da página a ser convertida
var docPdf = "pdfs/pedido15.pdf" //caminho do PDF a ser convertido

const file = docPdf; //caminho do PDF a ser convertido
const pd = new Poppler(); //instanciando o Poppler para conversão de PDF para PNG
const options = { //passando as variaveis de configuração para o poppler
	firstPageToConvert: pginicio,
	lastPageToConvert: pgfim,
	pngFile: true,
};
const outputFile = `test_document`; //definindo o nome do arquivo de saída

async function main() { //definição de funcção assíncrona para executar as operações
    
//O bloco abaixo tenta realizar a conversão do PDF para PNG, caso ocorra algum erro, ele será capturado e exibido no console. 
    try {
        const res = await pd.pdfToCairo(file, outputFile, options);
        console.log('Seu documento foi convertido!\n',res);
    } catch (error) {
        console.error('Erro ao tentar converter:', error);
    }

//O bloco abaixo tenta realizar o reconhecimento de texto na imagem convertida, caso ocorra algum erro, ele será capturado e exibido no console.
    try {
        const text = await tesseract.recognize('test_document-1.png', config) 
        console.log("Texto reconhecido com sucesso!\n", text) 
    } catch (error) {
      console.log("Erro na leitura do texto\n", error.message)
      }
}

main(); //chamada da função assincrona principal para executar as operações!