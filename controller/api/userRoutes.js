const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userData = await User.create({ username: name, email: email, password: password});
        //set up password hashing.. maybe
        req.session.save(() => {
            req.session.username = userData.username;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });

        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again :)' });
            return;
        }

        req.session.save(() => {
            req.session.username = userData.username;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'Now logged in!' });
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;