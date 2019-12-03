const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
var url = require('url');
const helmet = require('helmet');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  var contents;
  fs.readFile('CD-Data.json', (err, data) => {
    if (err) throw err;
    contents = JSON.parse(data);
    res.render('index', {contents: contents});
  });
});
app.get('/delete/:id', (req, res) => {
  var rawdata = fs.readFileSync('CD-Data.json');
  var student = JSON.parse(rawdata);
  var urlname = url.parse(req.url,true).query;

  if(urlname.studioname == 1) 
    findAndRemove(student.AlbumStudio,'title',req.params.id);
  else 
    findAndRemove(student.RemixAlbum,'title',req.params.id);

  let data = JSON.stringify(student);
  fs.writeFileSync('CD-Data.json', data);
  res.redirect('/');
});

app.listen(port, error => {
  if (error) throw error;
  console.log('Server running on port ' + port);
});


function findAndRemove(array, property, value) {
  array.forEach(function(result, index) {
    if(result[property] === value) {
      //Remove from array
      array.splice(index, 1);
    }    
  });
}