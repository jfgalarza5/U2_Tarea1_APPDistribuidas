const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

app.use('/cliente', require('./routes/cliente'));
app.use('/producto', require('./routes/producto'));
app.use('/carrito', require('./routes/carrito'));

app.get('/',(req,res)=>{
    res.json({"mensaje":"Bienvenido a la tienda online con MySQL"});
});

app.listen(port, ()=>{
    console.log("Escuchando desde el puerto "+port)
})