const http = require('http'),
path = require('path'),
express = require('express'),
bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const db = new sqlite3.Database(':memory:');
db.serialize(function () {
 db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
 db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});

const port = 3000;

app.use(express.urlencoded({ extended: true }));

// GET route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// POST route to handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // SQL query to check the validity of the username and password
  const query = `SELECT username FROM users WHERE username = '${username}' AND password = '${password}'`;

  db.get(query, (err, row) => {
    if (err) {
      console.error(err);
      res.redirect('/#error');
    } else if (row) {
      res.send('Login successful!');
    } else {
      res.redirect('/#unauthorized');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});