const express = require('express');
const app = express();
const multer = require('multer');
const { promisify } = require('util')
const fs = require('fs')

const PORT = 3000; 

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
    
    // Cria variavel cliente e busca valor conforme passado no corpo da requisição com id "cliente"
    const cliente = req.body.cliente 
    //definindo nome do arquivo com o timestamp e forçando a tipagem .pdf
    const fileName = req.file.originalname + timeStamp +".pdf"
        
    // validação do tipo de arquivo igual a pdf
        if (req.file.mimetype == 'application/pdf') { 
            res.send("Arquivo salvo com sucesso")
        }
        else {
            //deleta arquivo salvo no diretório transport
            await unlinkAsync(req.file.path) 
            res.send("O arquivo enviado não é do tipo pdf\n Arquivo não foi salvo!")
        }
    }
);

