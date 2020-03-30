const express = require('express');
const server = express();

server.use(express.static('public'));
server.use(express.urlencoded({extended:true}));

const Pool = require('pg').Pool;
const db = new Pool({
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: 'doe'
})



const nunjucks = require('nunjucks');
nunjucks.configure('./',{
  express: server,
  noCache: true,
});

server.get('/', (req, res) =>{

  db.query('Select * from donors', (err, result) =>{
    if (err) return res.send('Erro de banco de dados.');

    const donors = result.rows;
    return res.render('index.html', {donors})
  })

});

server.post('/', (req,res) =>{
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

  if (name == "" || email == "" || blood == ""){
    return res.send('Todos os campos são obrigatórios.')
  }

  const query = `insert into 
    donors ("name", "email", "blood")
    values ($1, $2, $3)`

  const values = [name, email, blood];

  db.query(query, values, (err) =>{
    if (err) return res.send('erro no banco de dados.');
  
    return res.redirect('/');
  });


})

server.listen(3000);