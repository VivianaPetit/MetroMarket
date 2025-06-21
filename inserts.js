const { MongoClient } = require('mongodb');
const publicacion = require('./src/api/models/publicacion'); 

async function insertarVarios() {
  const client = new MongoClient('mongodb+srv://vivianapetit:metromarket2025@metromarket.01h8qp4.mongodb.net/');
  await client.connect();

  const db = client.db('test');

  const publicaciones = [
    { nombre: "Item A", precio: 15 },
    { nombre: "Item B", precio: 25 },
  ];

  const resultado = await publicacion.insertMany(publicaciones);
  console.log(`${resultado.insertedCount} documentos insertados`);

  await client.close();
}

insertarVarios();