const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
client.setConfig({apiKey: process.env.API_KEY, server: process.env.API_SERVER});

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }

    const run = async () => {
        const response = await client.lists.addListMember(process.env.LIST_ID, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });

        res.sendFile(__dirname + "/success.html");
        console.log("Successfully added contact as an audience member");
    }

    run().catch(e => res.sendFile(__dirname + "/failure.html"));

});

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is runing on port 3000");
});

//Online: https://newsletter-signup-wi2d.onrender.com