const express = require('express')
const mongoose = require('mongoose')
const app = express()
const UrlShortenerModel = require('./models/shorting')
const PORT = process.env.PORT | 5000


const db = 'mongodb://localhost:27017/urlShortener'

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Successfully connected to the database'))
  .catch((err) => console.log(err))



app.use(express.urlencoded({extended: false}))
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
  const foundUrls = await UrlShortenerModel.find()
  res.render('index', {foundUrls})
})


app.post('/shorting', async (req, res) => {
  const fullUrl = req.body.full

  if(fullUrl != '') {
    const savedUrl = await UrlShortenerModel.create({full: req.body.fullUrl})
    res.redirect('/')
  }
  else{
    res.render('index', {msg: "Please fill the input"})
  }
})

app.get('/:newurl', async (req, res) => {
  const foundUrl = await UrlShortenerModel.findOne({short: req.params.newurl})

  if(!foundUrl) return res.sendStatus(404).end()

  else{
    res.redirect(foundUrl.full)
  }
})



app.listen(PORT, () => console.log(`Server run port on ${PORT}`))