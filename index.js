/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});


const express = require("express");

let app = express();

let path = require("path");

const port = process.env.PORT || 3003;

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
            host: process.env.RDS_HOSTNAME || "localhost", 
            user: process.env.RDS_USERNAME || "postgres",
            password: process.env.RDS_PASSWORD || "password",
            database: process.env.RDS_DB_NAME || "postgres",
            port: process.env.RDS_PORT || 5432,
            // ssl: process.env.DB_SSL ? {rejectUnauthorized: false} : false
        }
    })

app.get("/", (req, res) => {
    res.render(path.join(__dirname + "/views/index.ejs"));
});

app.get("/donate", (req, res) => {
    res.render(path.join(__dirname + "/views/donate.ejs"));
});

app.get("/createAccount", (req, res) => {
    res.render(path.join(__dirname + "/views/createAccount.ejs"));
});

app.get("/login", (req, res) => {
    res.render(path.join(__dirname + "/views/donate.ejs"));
});

app.get("/browse", (req, res) => {
    res.render(path.join(__dirname + "/views/browse.ejs"));
});

app.listen(port, () => console.log("Website started"));


