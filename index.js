
const express = require("express");

let app = express();

let path = require("path");

const port = process.env.PORT || 3000;

const users = [{ username: 'admin', password: 'adminpassword'}];

app.set("view engine", "ejs")

app.use(express.urlencoded({extended: true}));

app.use('/css', express.static(path.join(__dirname, 'views/css')));

// app.use('/js', express.static(path.join(__dirname, 'views/js')));

// app.use('/img', express.static(path.join(__dirname, 'views/img')));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

const knex = require("knex")({ // this is the database
        client: "pg",
        connection: {
            host: process.env.RDS_HOSTNAME || "babyclothes.c5d3qntj7b7x.us-east-1.rds.amazonaws.com", 
            user: process.env.RDS_USERNAME || "postgres",
            password: process.env.RDS_PASSWORD || "password",
            database: process.env.RDS_DB_NAME || "postgres",
            port: process.env.RDS_PORT || 5432,
            ssl: process.env.DB_SSL ? {rejectUnauthorized: false} : false
        }
    })

app.get("/", (req, res) => {
    res.render(path.join(__dirname + "/views/index.ejs"));
});

app.get("/donateEdit", (req, res) => {
    res.render(path.join(__dirname + "/views/donateEdit.ejs"));
});

app.get("/createAccount", (req, res) => {
    res.render(path.join(__dirname + "/views/createAccount.ejs"));
});

app.get("/login", (req, res) => {
    res.render(path.join(__dirname + "/views/login.ejs"));
});

app.get("/donateFind", (req, res) => {
    res.render(path.join(__dirname + "/views/donateFind.ejs"));
});

app.get("/findRecord", (req, res) => {
    res.render("findRecord");
}); 

app.get("/browse", (req, res) => {
    res.render(path.join(__dirname + "/views/browse.ejs"));
});

app.get("/browse", (req, res) => {
    knex.select().from('items').then(items => {
        res.render("displayBrowse", {myitems: items});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

app.post("/storeDonation", (req, res) => {
    const itemsData = {
        category: req.body.type,
        itemDescription: req.body.age,
        type: req.body.gender,
    };
    knex("items")
        .insert(itemsData)
        .then(() => {
            res.redirect("/browse");           
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error storing survey data");
        });
});

app.listen(port, () => console.log("Website started"));


