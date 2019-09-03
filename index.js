const express = require("express");

const Users = require("./data/db.js");

const server = express();

server.use(express.json());

server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;

  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    Users.insert(req.body)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(() => {
        res.status(500).json({
          errorMessage:
            "There was an error while saving the user to the database"
        });
      });
  }
});

server.get("/api/users", (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(() => {
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
});

server.get("/api/users/:id", (req, res) => {
  Users.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          // If the user with the specified id is not found
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(() => {
      // If there's an error in retrieving the user from the database
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

server.delete("/api/users/:id", (req, res) => {
  Users.remove(req.params.id)
    .then(user => {
      if (user && user > 0) {
        res.status(200).json(user);
      } else {
        res
          // If the user with the specified id is not found
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(() => {
      // If there's an error in removing the user from the database
      res.status(500).json({ error: "The user could not be removed" });
    });
});

server.listen(5000, () => console.log(`\nAPI on port 5000\n`));
