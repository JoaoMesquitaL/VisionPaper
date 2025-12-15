const timeStamp = Date.now(); 
//Definindo variaveis do Pedido
var nomeCliente = "";
var itemPedido  = "";
var vlUnitItem  = "";
var dtEntrega = "";
var vlTotal  = "";
var obsPedido  = "";
var formaPagto  = "";
var vlFrete  = "";
var qtdItem = "";
let payload = "";

//gerando payload para banco
function gerarPayLoad(textOCR) {

        //Buscando número do pedido
        const regexNumPed = /Nº\s?(\d+)/;
        const matchNumPed = textOCR.match(regexNumPed);
        if (matchNumPed){
            var numPedido = matchNumPed[1].trim();
            console.log("Número do pedido encontrado:", numPedido);
        } else {
            console.log("Numero do pedido não encontrado");
        }    

    //Buscando nome do cliente no texto reconhecido
        const regexNome = /DADOS\s*DO\s*CLIENTE[\s\S]*?Nome[:\s]*([^\n\r]{1,33})/i;
        const matchNome = textOCR.match(regexNome);
        if (matchNome) {
            var nomeCliente = matchNome[1].trim();
            console.log("Nome do cliente encontrado:", nomeCliente);
        } else {
            console.log("Nome do cliente não encontrado.");
        }

    //Buscando item do pedido de compra
        const regexItemPed = /Descrição.*(?:\r?\n){2}\s*([^\n\r]{1,15})/i;
        const matchItemPed = textOCR.match(regexItemPed);
        if (matchItemPed) {
            var itemPedido  = matchItemPed[1].trim();
            console.log("Item do pedido encontrado: ", itemPedido);
        } else {
            console.log("Item do pedido não encontrado.");
        }
    

    //Buscando valor unitário do produto
        const regexValUnit = /Valor Unit[aá]rio[\s\S]*?(?:\r?\n){2}[^\r\n]*?R\$\s?([\d.]+,\d{2})/
        const matchValUnit = textOCR.match(regexValUnit);
        if (matchValUnit){
            var vlUnitItem  = matchValUnit[1].trim();
            console.log("Valor unitario do Pedido encontrado: ", vlUnitItem);
        } else {
            console.log("Valor unitário do item não encontrado");
        }

    //Buscando a data de entrega no texto reconhecido
        const regexData = /Data\s*entrega[:\s]*([0-3]?\d\/[01]?\d\/\d{2,4})/i;
        const matchData = textOCR.match(regexData);
        if (matchData) {
            var dtEntrega = matchData[1];
            console.log("Data de Entrega encontrada:", dtEntrega);
        } else {
            console.log("Data de Entrega não encontrada.");
        }

    //Buscando Valor TOTAL no texto reconhecido
        const regexValor =  /TOTAL\s*R\$?\s*([\d\.,]+)/i; //expressão regular para encontrar o valor com base na palavra "TOTAL" usando /i para ignorar maiúsculas e minúsculas
        const matchValt = textOCR.match(regexValor); //aplicando o regex no texto reconhecido e usando a função match para encontrar o valor
        if (matchValt) { //se o retorno da função match for verdadeiro, retorna o valor encontrado
            var vlTotal = matchValt[1];
            console.log("Valor TOTAL encontrado:", vlTotal); //linha inteira do regex (com a cifra e espaço)
           // console.log("Apenas o valor:", match[1]); //apenas o valor (sem a cifra e espaço) 
        } else {
            console.log("Valor TOTAL não encontrado."); //retorno caso não encontre o valor
        }

        //Buscando observações no texto reconhecido
        const regexObs = /Observa(?:ções|gées):\s*([^\n\r]*)/i;
        const matchObs = textOCR.match(regexObs);
        if (matchObs) {
            var obsPedido = matchObs[1].trim();
            console.log("Observações encontradas:", obsPedido);
        } else {
            console.log("Observações do pedido não encontradas.");
        }

        //Buscando forma de pagamento no texto reconhecido
        const regexPagamento = /Forma de Pagamento:\s*([^\n\r]*)/i;
        const matchPagamento = textOCR.match(regexPagamento);
        if (matchPagamento) {
            var formaPagto = matchPagamento[1].trim();
            console.log("Forma de Pagamento encontrada:", formaPagto);
        } else {
            console.log("Forma de Pagamento não encontrada.");
        }

      //Buscando valor do frete no texto reconhecido
        const regexFrete = /Frete\s*R\$?\s*([\d\.,]+)/i;
        const matchFrete = textOCR.match(regexFrete);
        if (matchFrete) {
            var vlFrete = matchFrete[1].trim();
            console.log("Valor do Frete encontrado:", vlFrete);
        } else {
            console.log("Valor do Frete não encontrado.");
        }

      //Buscando informações de quantidade do item
        const regexQuantIT = /(\d+)\s*unid/i;
        const matchQuantIT = textOCR.match(regexQuantIT);
        if(matchQuantIT) {
            var qtdItem = matchQuantIT[1].trim();
            console.log("Quantidade do item encontrada: ", qtdItem);
        } else {
            console.log("Quantidade do item não encontrada.");
        }

    payload = {
        numPedido,
        nomeCliente,
        itemPedido,
        vlUnitItem,
        dtEntrega: formatToIso(dtEntrega),
        vlTotal,
        obsPedido,
        formaPagto,
        vlFrete,
        qtdItem
    };
    console.log("Payload gerado: \n", timeStamp/*, payload*/);

    return payload;
}

//formatando a data do payload para formato ISO antes de enviar
function formatToIso(dataBR) {
    const [dia, mes, ano] = dataBR.split("/");
    return `${ano}-${mes}-${dia}`; // YYYY-MM-DD
}


//exportando a função que gera o payload
module.exports = { gerarPayLoad};