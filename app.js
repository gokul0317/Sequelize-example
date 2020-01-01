var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var path = require("path");
var db = require("./config/database");

db.authenticate()
    .then(() => console.log("connected"))
    .catch(err => console.log("_ERR_: " + err));

const app = express();

//handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

var PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.render("index", { layout: "landing" }));

app.use('/gigs', require("./routes/gig"));


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
