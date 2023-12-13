
const express = require("express");

let app = express();

let path = require("path");

const port = process.env.PORT || 3000;

const users = [{ username: 'admin', password: 'adminpassword'}];

app.set("view engine", "ejs")

app.use(express.urlencoded({extended: true}));

app.use('/css', express.static(path.join(__dirname, 'views/css')));

// app.use('/js', express.static(path.join(__dirname, 'views/js')));

app.use('/img', express.static(path.join(__dirname, 'views/img')));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// const knex = require("knex")({ // this is the database
//         client: "pg",
//         connection: {
//             host: process.env.RDS_HOSTNAME || "babyclothes.c5d3qntj7b7x.us-east-1.rds.amazonaws.com", 
//             user: process.env.RDS_USERNAME || "postgres",
//             password: process.env.RDS_PASSWORD || "password",
//             database: process.env.RDS_DB_NAME || "postgres",
//             port: process.env.RDS_PORT || 5432,
//             //ssl: process.env.DB_SSL ? {rejectUnauthorized: false} : false
//         }
//     })


const knex = require("knex")({
    client: "pg",
    connection: {
        host: "localhost",
        user: "postgres",
        password: "packers20",
        database: "practice",
        port: 5432
    }
});

app.get("/", (req, res) => {
    res.render(path.join(__dirname + "/views/index.ejs"));
});

app.get("/claim", (req, res) => {
    res.render(path.join(__dirname + "/views/claim.ejs"));
});


app.get("/donateEdit", (req, res) => {
    res.render(path.join(__dirname + "/views/donateEdit.ejs"));
});

app.get("/createAccount", (req, res) => {
    res.render(path.join(__dirname + "/views/createAccount.ejs"));
});

app.post('/createAccount', (req, res) => {
    const { username, password } = req.body
    //check if the username already exists
    const existingUser = users.find(login => login.username === username)

    if (existingUser) {
        res.render('login', {successMessage : null, error: 'Username already exists. Please choose another username.'});
    } else {
        users.push({username, password})
        setTimeout(() => {
            res.render('login', {successMessage: 'Account created successfully!', error:null})

        }, 1000)
    }
    
});

app.get("/login", (req, res) => {
    res.render(path.join(__dirname + "/views/login.ejs"));
});

app.get("/donateAdd", (req, res) => {
    res.render(path.join(__dirname + "/views/donateAdd.ejs"));
});

app.post("/login", (req, res) => {
    const {username, password } = req.body

    const user = users.find(u => u.username === username && u.password === password);

    console.log('gah', user);

    res.render('donateAdd')
});

app.get("/donateFind", (req, res) => {
    knex.select().from('items').then(items => {
    res.render(path.join(__dirname + "/views/donateFind.ejs"), {myitems: items})
})
});

app.get("/browse", (req, res) => {
    knex.select().from('items').then(items => {
        res.render(path.join(__dirname + "/views/browse.ejs"), {myitems: items})
})
});

app.get("/browse", (req, res) => {
    knex.select().from('items').then(items => {
        res.render("browse", {myitems: items});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

app.post("/donateAdd", (req, res)=> {
    knex("items").insert({
      item_title: req.body.item_title,
      description: req.body.description,
      quantity: req.body.quantity,
      category: req.body.category,
   }).then(myitems => {
      res.redirect("/");
   })
 });

app.get("/donateEdit/:id", (req, res)=> {
    knex.select("item_title",
          "description",
          "quantity",
          "category").from("items").where("item_id", req.params.id).then(items => {
    res.render("donateEdit", {myitems: items});
   }).catch( err => {
      console.log(err);
      res.status(500).json({err});
   });
});

 app.post("/donateEdit", (req, res)=> {
    knex("items").where("item_id", parseInt(req.body.item_id)).update({
      item_title: req.body.item_title.toUpperCase(),
      description: req.body.description.toUpperCase(),
      quantity: req.body.quantity.toUpperCase(),
      category: req.body.category,}).then(myitems => {
      res.redirect("/donateFind");
   })
 });

 app.post("/donateDelete/:id", (req, res) => {
    knex("items").where("item_id",req.params.id).del().then( myitems => {
      res.redirect("/donateFind");
   }).catch( err => {
      console.log(err);
      res.status(500).json({err});
   });

});

app.post("/claimDelete/:id", (req, res) => {
    knex("items").where("item_id",req.params.id).del().then( myitems => {
      res.redirect("/donateFind");
   }).catch( err => {
      console.log(err);
      res.status(500).json({err});
   });

});




app.listen(port, () => console.log("Website started"));


