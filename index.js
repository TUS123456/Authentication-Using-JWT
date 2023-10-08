const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const secretKey = "secretkey"; 
app.use(express.json());
app.get("/", (req, resp) => {
    resp.json({
        "message": "A sample API"
    });
});

app.post("/login", (req, resp) => {
    const user = {
        id: 1,
        username: "anil",
        email: "tusar@gmail.com"
    };

    jwt.sign({ user }, secretKey, { expiresIn: "300s" }, (err, token) => {
        if (err) {
            resp.status(500).json({ error: "Error while generating token" });
        } else {
            resp.json({
                token,
                user
            });
        }
    });
});

app.post("/profile", verifyToken, (req, resp) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            resp.status(403).json({ message: "Token is not valid" });
        } else {
            resp.json({
                message: "You are verified",
                authData
            });
        }
    });
});

function verifyToken(req, resp, next) {
    const bearerHeader = req.headers["authorization"]; // Corrected the headers access

    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next(); // Call next() to move to the next middleware or route handler
    } else {
        resp.status(401).json({
            message: "Token is not provided"
        });
    }
}


app.listen(3000, () => {
    console.log(`API is running on port 3000`);
});
