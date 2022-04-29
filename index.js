const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const pergunta = require('./database/Pergunta')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

//Database
connection.authenticate().then(() => {
    console.log('Conexão feita com o banco de dados.')
}).catch((err) => {
    console.log(err)
})

//Express usando o EJS como view engine
app.set('view engine', 'ejs')
app.use(express.static('public'))

//Configurando o BodyParser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


//Rotas
app.get('/', (req, res) => {
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC'] //ASC = CRESCENTE == DESC = DECRESCENTE
    ]}).then((perguntas) => {
        res.render('index', {
            perguntas: perguntas
        })
    })
})

app.get('/perguntar', (req, res) => {
    res.render('perguntar')
})

app.post('/salvarpergunta', (req, res) => {
    let titulo = req.body.titulo
    let descricao = req.body.descricao

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/')
    })
})

app.get('/pergunta/:id', (req, res) => {
    let id = req.params.id
    Pergunta.findOne({
        where: {id: id}
    }).then((pergunta) => {
        if(pergunta != undefined){

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[
                    ['id', 'DESC']
                ]
            }).then((respostas) => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
        }else{
            res.redirect('/')
        }
    })
})

app.post('/responder', (req, res) => {
    let corpo = req.body.corpo
    let perguntaId = req.body.pergunta

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('/pergunta/'+perguntaId)
    })
})




app.listen(8080, () => {
    console.log('Servidor Iniciado.')
})