const router = require('express').Router();

const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const authMiddleware = require('../middleware/authMiddleware');
router.post('/register', (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    User.findOne({ email }).then(user => {
        if (user) return res.status(400).json({ msg: 'User already exists' });
        const newUser = new User({
            username,
            email,
            password,
            role
        });
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(500).send({ status: "error", msg: "Internal servererror" });
            }
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    return res.status(500).send({ status: "error", msg: "Internal server error" });
                }
                // Replace plain password with hashed password
                newUser.password = hash;
                // Save the user to the database
                newUser.save()
                    .then((user) => {
                        // Generate JWT token
                        jwt.sign(
                            { id: user.id },
                            config.get("jwtSecret"),
                            { expiresIn: config.get("tokenExpire") },
                            (err, token) => {
                                if (err) {
                                    return res.status(500).send({ status: "error", msg: "Internalserver error" });
                                }
                                // Send response with token and user details
                                res.status(200).send({
                                    status: "ok", msg: "Successfully registered",
                                    token, user
                                });
                            }
                        );
                    })
                    .catch(err => {
                        return res.status(500).send({ status: "error", msg: "Internal servererror" });
                    });
            });
        });
    })
        .catch(err => {
            return res.status(500).send({
                status: "error", msg: "Internal server error"
            });
        });
}

);
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Vérification des champs
  if (!email || !password) {
    return res.status(400).send({
      status: "notok",
      msg: "Please enter all required data"
    });
  }

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({
        status: "notok",
        msg: "Email does not exist"
      });
    }

    // Comparer le mot de passe
    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(400).send({
        status: "notok",
        msg: "Invalid password"
      });
    }

    // Générer le token JWT
    jwt.sign(
      { id: user._id, role: user.role, name: user.username },
      config.get("jwtSecret"),
      { expiresIn: config.get("tokenExpire") },
      (err, token) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            msg: "Internal server error"
          });
        }

        res.status(200).send({
          status: "ok",
          msg: "Login successful",
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      }
    );

  } catch (error) {
    res.status(500).send({
      status: "error",
      msg: "Internal server error"
    });
  }
});
//route protectée /home
router.get("/home",authMiddleware, (req, res) => {
    res.json({msg: `Bienvenue ${req.user.name}! sur la page Home.`});
});


module.exports = router;