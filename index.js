const { Poppler } = require("node-poppler"); //requerendo poppler para conversão de PDF para PNG
const tesseract = require("node-tesseract-ocr"); //requerendo tesseract para reconhecimento de texto em imagens

/*
definindo as configurações do Tesseract onde: 
lang = idioma do texto a ser reconhecido (default é inglês)
oem = modo de reconhecimento (0 legacy engine only, 1 LSTM engine only, 2 legacy + LSTM, 3 default)
psm = modo de segmentação de página (3 é o modo padrão, 6 é para uma única coluna de texto)
*/
const config = {
  lang: "por", // default
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

//Implementação do uso de expressões regulares no texto reconhecido para extrair infos do pedido 
       
    //Buscando nome do cliente no texto reconhecido
        const regexNome = /DADOS\s*DO\s*CLIENTE[\s\S]*?Nome[:\s]*([^\n\r]{1,33})/i;
        const matchNome = text.match(regexNome);
        if (matchNome) {
            console.log("Nome do cliente encontrado:", matchNome[1]);
        } else {
            console.log("Nome do cliente não encontrado.");
        }

    //Buscando item do pedido de compra
        const regexItemPed = /Descrição.*(?:\r?\n){2}\s*([^\n\r]{1,15})/i;
        const matchItemPed = text.match(regexItemPed);
        if (matchItemPed) {
            console.log("Item do pedido encontrado: ", matchItemPed[1]);
        } else {
            console.log("Item do pedido não encontrado.");
        }
    

    //Buscando valor unitário do produto
        const regexValUnit = /Valor Unit[aá]rio[\s\S]*?(?:\r?\n){2}[^\r\n]*?(R\$\s?\d{1,3},\d{2})/
        const matchValUnit = text.match(regexValUnit);
        if (matchValUnit){
            console.log("Valor unitario do Pedido encontrado: ", matchValUnit[1]);
        } else {
            console.log("Valor unitário do item não encontrado");
        }

    //Buscando a data de entrega no texto reconhecido
        const regexData = /Data\s*entrega[:\s]*([0-3]?\d\/[01]?\d\/\d{2,4})/i;
        const matchData = text.match(regexData);
        if (matchData) {
            console.log("Data de Entrega encontrada:", matchData[1]);
        } else {
            console.log("Data de Entrega não encontrada.");
        }

    //Buscando Valor TOTAL no texto reconhecido
        const regexValor =  /TOTAL\s*R\$?\s*([\d\.,]+)/i; //expressão regular para encontrar o valor com base na palavra "TOTAL" usando /i para ignorar maiúsculas e minúsculas
        const matchValt = text.match(regexValor); //aplicando o regex no texto reconhecido e usando a função match para encontrar o valor
        if (matchValt) { //se o retorno da função match for verdadeiro, retorna o valor encontrado
            console.log("Valor TOTAL encontrado:", matchValt[1]); //linha inteira do regex (com a cifra e espaço)
           // console.log("Apenas o valor:", match[1]); //apenas o valor (sem a cifra e espaço) 
        } else {
            console.log("Valor TOTAL não encontrado."); //retorno caso não encontre o valor
        }

        //Buscando observações no texto reconhecido
        const regexObs = /Observa(?:ções|gées):\s*([^\n\r]*)/i;
        const matchObs = text.match(regexObs);
        if (matchObs) {
            console.log("Observações encontradas:", matchObs[1].trim());
        } else {
            console.log("Observações do pedido não encontradas.");
        }

        //Buscando forma de pagamento no texto reconhecido
        const regexPagamento = /Forma de Pagamento:\s*([^\n\r]*)/i;
        const matchPagamento = text.match(regexPagamento);
        if (matchPagamento) {
            console.log("Forma de Pagamento encontrada:", matchPagamento[1].trim());
        } else {
            console.log("Forma de Pagamento não encontrada.");
        }

      //Buscando valor do frete no texto reconhecido
        const regexFrete = /Frete\s*R\$?\s*([\d\.,]+)/i;
        const matchFrete = text.match(regexFrete);
        if (matchFrete) {
            console.log("Valor do Frete encontrado:", matchFrete[1].trim());
        } else {
            console.log("Valor do Frete não encontrado.");
        }

      //Buscando informações de quantidade do item
        const regexQuantIT = /(\d+)\s*unid/i;
        const matchQuantIT = text.match(regexQuantIT);
        if(matchQuantIT) {
            console.log("Quantidade do item encontrada: ", matchQuantIT[1])
        } else {
            console.log("Quantidade do item não encontrada.");
        }
                        
    } catch (error) {
      console.log("Erro na leitura do texto\n", error.message) //caso ocorra algum erro na leitura do texto, exibe a mensagem de erro
      }
    
}

main(); //chamada da função assincrona principal para executar as operações!