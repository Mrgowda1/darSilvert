const express = require("express");
const cors = require("cors");

const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const products = require("./data/products");

console.log("Running THIS server file");
console.log(__dirname);

const app = express();

app.use(cors());
app.use(express.json());

function verifyToken(req, res, next) {

    const token = req.headers["authorization"];

    if (!token) {
        return res.send("No token");
    }

    jwt.verify(token, "secret", (err, user) => {

        if (err) {
            return res.send("Invalid token");
        }

        req.user = user;

        next();

    });

}


// test
app.get("/", (req, res) => {
    res.send("Backend running");
});


// products API
app.get("/products", (req, res) => {



    res.json(products);

});

app.get("/products/:id", (req, res) => {

    const id = req.params.id;

    const product = products.find(
        p => String(p.id) === String(id)
    );

    if (!product) {

        return res
            .status(404)
            .json({
                message: "Product not found"
            });

    }

    res.json(product);

});


// register
app.post("/register", async (req, res) => {

    const { username, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hash],
        function (err) {

            if (err) {
                res.send(err);
            } else {
                res.json({ message: "User created" });
            }

        }
    );

});


// login
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, user) => {

            if (!user) {
                return res.json({ message: "User not found" });
            }

            const match = await bcrypt.compare(
                password,
                user.password
            );

            if (!match) {
                return res.json({ message: "Wrong password" });
            }

            const token = jwt.sign(
                { id: user.id },
                "secret"
            );

            res.json({
                message: "Login success",
                token: token
            });

        }
    );

});


// ✅ ORDER API (OUTSIDE login)

app.post("/order", verifyToken, (req, res) => {

    const total = req.body.total;

    const userId = req.user.id;

    db.run(
        "INSERT INTO orders (username, total) VALUES (?, ?)",
        [userId, total],
        function (err) {

            if (err) {
                res.send(err);
            } else {
                res.json({
                    message: "Order saved"
                });
            }

        }
    );

});

// ✅ GET ORDERS

app.get("/orders", (req, res) => {

    db.all(
        "SELECT * FROM orders",
        [],
        (err, rows) => {

            if (err) {
                res.send(err);
            } else {
                res.json(rows);
            }

        }
    );

});

app.get("/myorders", verifyToken, (req, res) => {

    const userId = req.user.id;

    db.all(
        "SELECT * FROM orders WHERE username = ?",
        [userId],
        (err, rows) => {

            if (err) {
                res.send(err);
            } else {
                res.json(rows);
            }

        }
    );

});


app.listen(5000, () => {
    console.log("Server running on 5000");
});