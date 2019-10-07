const express = require('express')
const app = express();

app.set('port', process.env.PORT || 3001 );

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen(app.get('port'), () => {
  console.log(`App is listening on https://localhost${app.get('port')}`)
})