const express = require('express');
const app = express();

const PORT = 3000; 


app.get('/', (req, res) => { //para o objeto app chamei o metodo get passa a url / 
    res.send('hello world') //recebe a resposta do metodo get / e devolve um hello world
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //define qual porta padrão a api esta ouvindo
