# VisionPaper

A ideia é ter uma ferramenta simples, que seja capaz de receber um pdf simples, converte-lo para imagem, passar pelo OCR para armazenar o valor dessa imagem em um banco de dados, de acordo com condições específicas.

## Para incialização desse projeto, são necessárias algumas dependências, sendo elas:
* NodeJS
* Tesseract OCR
* PDF-Poppler

_obs: o projeto foi desenvolvido em uma plataforma Windows 11 sendo, assim caso utilize outro S.O verifique através dos links disponibilizados as instalações de acordo com seu Sistema Operacional vigente_

## Instalando NodeJS
1. Acesse o site https://nodejs.org/pt/download e baixe o node;
2. Faça a instalação padrão apenas clicando em próximo;
3. Ao finalizar a instalação, abra o prompt de comando e digite "node -v";
4. Caso seja retornada a versão de instalação do Node, sua instalação foi um suceso;

## Documentando seu projeto
1. Crie um arquivo chamado "index.js"
2. No direito do seu projeto, com o prompt de comando aberto execute o seguinte comando: "npm init -y" para criar o seu arquivo package.json vazio
3. Observe em seu arquivo "package.json" o nome do arquivo que esta na variável "main:" será seu "Index.js" pois esse é o arquivo que deve ser executado para rodar seu projeto.
4. Após isso, sempre que quiser rodar seu projeto, basta usar o comando "node index.js"
5. Caso queira experimentar, cole a seguinte linha em seu arquivo .js, salve e execute-a: "console.log('Olá Mundo!')"


## Instalando Tesseract
1. Com o prompt de comando aberto no diretório do seu projeto, faça a instalação do Projeto Tesseract OCR através do seguinte comando: "apt-get install tesseract-ocr"
2. Após essa instalação pode prosseguir para a instalação do pacote node do tesseract: "npm install node-tesseract-ocr"
3. Use o primeiro exemplo listado como Usage na página web do tesseract para validar o OCR com um arquivo .jpg simples (https://www.npmjs.com/package/node-tesseract-ocr)
4. Para executar o exemplo rode "node index.js" _substitiur "index.js" por qualquer que seja o nome do arquivo principal do seu projeto node_
5. Para que o tesseract seja capaz de compreender portugues, é necessário baixar o arquivo "por.traneddata" com as informações do tesseract treinado em portugues e coloca-lo na pasta "tessdata" da sua instalação do tesseract"

## Instalando PDF Poppler
1. Com o prompt de comando aberto no diretório do seu projeto, faça a instalação do Projeto Tesseract OCR através do seguinte comando: "npm i node-poppler"
2. Use o primeiro exemplo listado como poppler "pdfToCairo" com um arquivo pdf qualquer para validar a instalação
3. Para executar o exemplo rode "node index.js" _substitiur "index.js" por qualquer que seja o nome do arquivo principal do seu projeto node_

_obs: após a instalação da primeira dependência do projeto, será criada uma pasta chamada "node modules" a qual armazenará todos os pacotes das dependencias node usadas. Também será criado uma versão do seu package.json chamada package-lock.json que nada mais é que uma versão mais abrangente do package.json_

## Configurando o Banco de Dados

_obs: para esse projeto está sendo utilizado um banco de dados MySql, adeque as instruções conforme necessário_

1. Criando o Banco de dados: "CREATE DATABASE VISIONPAPER;"
2. Criando a tabela de Pré-Pedido: "USE VISION PAPER; CREATE TABLE PREPEDIDO (
	NumPedido int,
    NomeCliente varchar(255),
    ItemPedido varchar(255),
    ValorUnitItem float,
    QtdItem float,
    ValorFrete float,
    ValorTotal float,
    Pagamento varchar(255),
    DtEntrega date,
    ObsPedido varchar(255)
);"