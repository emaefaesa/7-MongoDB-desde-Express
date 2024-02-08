let express = require('express')
let app = express()
app.listen(3000);
let PORT = process.env.PORT || 3000

let { MongoClient, ObjectId } = require('mongodb')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const client = new MongoClient('mongodb://127.0.0.1:27017')


async function connectMongo() {
    try {
        await client.connect().then((client) => app.locals.db = client.db('prueba'))
        console.log('🟢 MongoDB conectado')
    } catch (error) {
        console.error('🔴 MongoDB no conectado')
    }
}

connectMongo()


// Mesas 

app.get('/api/mesas', async (req, res) => {
    try {
        let results = await app.locals.db.collection('mesas').find().toArray()
        res.status(200).send({ mensaje: "Petición correcta", results })
    } catch (error) {
        res.status(500).send({mensaje: "Petición no resuelta"})
    }

})

// Insertar producto

app.post('/api/afegir', async(req, res)=>{
    try {
        let {tamaño, color, material, patas} = req.body
      let results = await app.locals.db.collection('mesas').insertOne({tamaño, color, material, patas})  
      res.status(200).send({mensaje: "Producto insertado", results})
    } catch (error) {
        res.status(500).send({mensaje: "Error interno del servidor"})
    }
})

// Modificar producto


app.put('/api/modificar/:color', async (req, res)=>{
    try {
        const results = await app.locals.db.collection('mesas').updateMany({color: req.params.color}, {$set: {color: "granate"}})
        res.send({mensaje: "Color modificafo", results})
    } catch (error) {
        res.send({mensaje: "Error interno del servidor", error})
    }
})

// Borrar producto

app.delete('/api/borrar/:patas', async (req, res)=>{
    try {
        const results = await app.locals.db.collection('mesas').deleteMany({patas: parseInt(req.params.patas)})
        res.send({mensaje: "Mesa eliminada", results})
    } catch (error) {
        res.send({mensaje: "Error interno del servidor", error})
    }
})


app.listen(process.env.PORT || 3000, (e)=>{
    e
    ? console.error('No hay servidor xiki')
    : console.log('Servidor a la escucha en el puerto:' + (process.env.PORT || 3000))
} )
