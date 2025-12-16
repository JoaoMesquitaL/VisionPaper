const { Poppler } = require("node-poppler"); //requerendo poppler para conversão de PDF para PNG
const tesseract = require("node-tesseract-ocr"); //requerendo tesseract para reconhecimento de texto em imagens
const express = require('express');
const multer = require('multer');
const { promisify } = require('util')
const fs = require('fs')
const { gerarPayLoad } = require('./payload'); //requerendo funções do connection.js

const PORT = 3000;  //porta definida para o serviços rest
const app = express(); //instanciado express em constante para uso em métodos

let timeStamp = ""; //variavel para armazenamento do tempo de execução do processo
function GenerateTimeStamp(timeStamp){
    timeStamp = Date.now(); //Armazenando a data da execução via função
    return timeStamp 
}


app.get('/', (req, res) => { //para o objeto app chamei o metodo get passa a url / 
    res.send('hello world') //recebe a resposta do metodo get / e devolve um hello world
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //console que informa qual porta padrão a api esta ouvindo


const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./transport");
    },
    filename: (req, file, cb) =>{
        timeStamp =  GenerateTimeStamp(timeStamp)
        cb(null, file.originalname+timeStamp+".pdf"); //nomeando arquivo c/ nome original + timestamp
    },
});

//constante que nos permite deletar o arquivo quando quisermos pela chamada do link com arquivo + path
const unlinkAsync = promisify(fs.unlink)

//constante para acessar a opção de armazenamento definida acima pelo multer
const upload = multer({storage: fileStorageEngine}); 

//metodo da api que recebe arquivo
app.post("/single", upload.single("pdf"), async (req, res) =>{ 
    
    //definindo nome do arquivo com o timestamp e forçando a tipagem .pdf
    timeStamp =  GenerateTimeStamp(timeStamp)
    const fileName = req.file.originalname + timeStamp +".pdf"
        
    // validação do tipo de arquivo igual a pdf
        if (req.file.mimetype == 'application/pdf') { 
             //Bloco de configuração das variáveis do Poppler 
            var pginicio = 1; //incio da página a ser convertida
            var pgfim = 1; //fim da página a ser convertida
            var docPdf = "transport/"+fileName //caminho do PDF a ser convertido
            
            const file = docPdf; //caminho do PDF a ser convertido
            const pd = new Poppler(); //instanciando o Poppler para conversão de PDF para PNG
            
            const options = { //passando as variaveis de configuração para o poppler
                firstPageToConvert: pginicio,
                lastPageToConvert: pgfim,
                pngFile: true,
            };
            
            timeStamp = GenerateTimeStamp(timeStamp)
            const outputFile = "pngs/Output_doc"+timeStamp; //definindo o nome do arquivo de saída + timestamp 
            //O bloco abaixo tenta realizar a conversão do PDF para PNG, caso ocorra algum erro, ele será capturado e retornado para a API. 
            try {
                const respCairo = await pd.pdfToCairo(file, outputFile, options);
                console.log("PDF convertido para PNG com sucesso!") //Sucesso registrado no console de execução da API

                //Bloco de configuração do Tesseract OCR
                const config = {
                lang: "por",
                oem: 3,
                psm: 3,
                }

                //O bloco abaixo tentar ler o png gerado via Tesseract OCR e salvar em uma string!
                try {
                    const textOCR = await tesseract.recognize(outputFile+"-1.png", config) 
                    console.log("Texto reconhecido com sucesso!\n") //Sucesso registrado no console de execução da API

                    //chamada do metodo externo para aplicação de regex e criação do payload
                    try{
                        const payload = await gerarPayLoad(textOCR);
                        res.send(`Payload gerado com sucesso!\n`) //retorno de sucesso para a chamada da API
                        console.log(`Payload gerado com sucesso ${timeStamp}\n`)
                    } catch (error){
                        timeStamp =  GenerateTimeStamp(timeStamp)
                        res.send(`Erro ao gerar payload com regex, confira o log da aplicação \n Timestamp do erro: ${timeStamp}`)
                        console.log(`Erro ao chamar metodo de geração de Payload\n Timestamp do erro: ${timeStamp}\n--Veja abaixo:--\n ${error.message}`)
                    }

                } catch (error) {
                    timeStamp = GenerateTimeStamp(timeStamp)
                    res.send(`Erro na leitura do texto Timestamp do erro: ${timeStamp}\n`) //retorno de erro para a chamada da API
                    console.log(`Erro ao converter!\n Timestamp do erro: ${timeStamp}\n Veja o log abaixo:\n ${error.message}`)
                }

                
            }catch (error) {
                timeStamp = cGenerateTimeStamp(timeStamp)
                res.send(`Erro ao tentar converter PDF para PNG!`) //retorno de erro para a chamada da API
                console.log(`Erro ao tentar converter PDF para PNG\n Timestamp do erro: ${timeStamp}\n \n--Veja abaixo:--\n ${error.message}`) //Erro registrado no console de execução da API
            }
        }
        else {
            //deleta arquivo salvo no diretório transport
            timeStamp = GenerateTimeStamp(timeStamp)
            await unlinkAsync(req.file.path) 
            res.send(`O arquivo enviado não é do tipo pdf\n Arquivo não foi salvo! \n Time Stamp do erro: ${timeStamp}`)//retorno de erro para a chamada da API
            console.log(`Erro de tipo de arquivo enviado\n Time stamp do erro: ${timeStamp}`)
        }
    }
);

