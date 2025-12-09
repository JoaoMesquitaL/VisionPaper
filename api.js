const { Poppler } = require("node-poppler"); //requerendo poppler para conversão de PDF para PNG
const tesseract = require("node-tesseract-ocr"); //requerendo tesseract para reconhecimento de texto em imagens
const express = require('express');
const multer = require('multer');
const { promisify } = require('util')
const fs = require('fs')


const PORT = 3000;  //porta definida para o serviços rest
const app = express(); //instanciado express em constante para uso em métodos

const timeStamp = Date.now(); //Armazenando a data da execução do endpoint para nomear arquivos

app.get('/', (req, res) => { //para o objeto app chamei o metodo get passa a url / 
    res.send('hello world') //recebe a resposta do metodo get / e devolve um hello world
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //console que informa qual porta padrão a api esta ouvindo


const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./transport");
    },
    filename: (req, file, cb) =>{
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
                    console.log("Texto reconhecido com sucesso!\n", textOCR) //Sucesso registrado no console de execução da API
                    res.send(`Convertido com sucesso!\n Texto convertido:\n ${textOCR}`) //retorno de sucesso para a chamada da API
                } catch (error) {
                    res.send("Erro na leitura do texto\n") //retorno de erro para a chamada da API
                    console.log("Erro ao converter!\n Veja o log abaixo:\n", error.message)//Erro registrado no console de execução da API
                }

                
            }catch (error) {
                res.send(`Erro ao tentar converter PDF para PNG!`) //retorno de erro para a chamada da API
                console.log("Erro ao tentar converter PDF para PNG\n --Veja o erro abaixo--\n", error) //Erro registrado no console de execução da API
            }
        }
        else {
            //deleta arquivo salvo no diretório transport
            await unlinkAsync(req.file.path) 
            res.send("O arquivo enviado não é do tipo pdf\n Arquivo não foi salvo!")//retorno de erro para a chamada da API
        }
    }
);

