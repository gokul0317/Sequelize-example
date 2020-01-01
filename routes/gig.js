const express = require('express');
const router = express.Router();
const db = require("../config/database");
const Gig = require("../models/Gigs");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.get("/", (req, res) => {
    Gig.findAll()
        .then(gigs => res.render('gigs', { gigs }))
        .catch(err => console.log("Err : " + err))
});

router.get('/add', (req, res) => {
    res.render("add");
});

router.post("/add", (req, res) => {

    let { title, technologies, budget, description, contact_email } = req.body;

    let errors = [];
    if (!title) {
        errors.push({ text: "Please Add A Title" });
    }
    if (!technologies) {
        errors.push({ text: "Please Add A some technologies" });
    }
    if (!description) {
        errors.push({ text: "Please Add A description" });
    }
    if (!contact_email) {
        errors.push({ text: "Please Add A contact_email" });
    }

    if (errors.length) {
        res.render("add", {
            errors,
            title,
            technologies,
            budget,
            description,
            contact_email
        });
    } else {
        if (!budget) {
            budget = "UNKNOW";
        }
        else {
            budget = `$${budget}`
        }

        //make lowercase and remove space
        technologies = technologies.toLowerCase().replace(/, /g, ",");

        Gig.create({
            title,
            technologies,
            budget,
            description,
            contact_email
        })
            .then(gig => {
                console.log(gig);
                res.redirect("/gigs");
            })
            .catch(err => console.log("__ERR__", err))

    }
    //Insert into table

});

router.get("/search", (req, res) => {
    let { term } = req.query;
    term = term.toLowerCase();
    Gig.findAll({ where: { technologies: { [Op.like]: "%" + term + "%" } } })
        .then(gigs => res.render('gigs', { gigs }))
        .catch(err => console.log("__ERR__", err));
})

module.exports = router;