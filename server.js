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

var updatepath;

app.get('/update/:id',(req, res) => {
  const edit_postId = req.params.id;
  // FIND POST BY ID
  var content = {title:'',artist:'',country:'',label:'',year:''};
  var rawdata = fs.readFileSync('CD-Data.json');
  var student = JSON.parse(rawdata);
  var urlpath = url.parse(req.url,true).query;

  if(urlpath.studioname == 1){
    updatepath = urlpath.studioname;
    student.AlbumStudio.forEach(function(item) {
      if(item.title == req.params.id) {
        content.title = item.title;
        content.artist = item.artist;
        content.country = item.country;
        content.label = item.label;
        content.year = item.year;
      }
    }); 
  }
  else {
    updatepath = urlpath.studioname;
    student.RemixAlbum.forEach(function(item) {
      if(item.title == req.params.id) {
        content.title = item.title;
        content.artist = item.artist;
        content.country = item.country;
        content.label = item.label;
        content.year = item.year;
      }
    });
  }
  res.render('edit',{ content : content});
});

app.post('/update/:id', (req, res) => {
  var rawdata = fs.readFileSync('CD-Data.json');
  var student = JSON.parse(rawdata);

  if(updatepath == 1){ 
    student.AlbumStudio.forEach(function(item) {
      if(item.title == req.params.id){
        item.title = req.body.title;
        item.artist = req.body.artist;
        item.country = req.body.country;
        item.label = req.body.label;
        item.year = req.body.year;
      }
    });
  }
  else {
    student.RemixAlbum.forEach(function(item) {
      if(item.title == req.params.id){
        item.title = req.body.title;
        item.artist = req.body.artist;
        item.country = req.body.country;
        item.label = req.body.label;
        item.year = req.body.year;
      }
    });
  }

  let data = JSON.stringify(student);
  fs.writeFileSync('CD-Data.json', data);
  res.redirect('/');
});


function findAndRemove(array, property, value) {
  array.forEach(function(result, index) {
    if(result[property] === value) {
      //Remove from array
      array.splice(index, 1);
    }    
  });
}