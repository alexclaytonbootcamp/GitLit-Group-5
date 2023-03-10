const router = require('express').Router();
const { User, Topic, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', /*withAuth,*/ async (req, res) => {
    try {
        const dbTopicData = await Topic.findAll({
        });

        const topics = dbTopicData.map((topic) =>
        topic.get({ plain: true })
        );

        res.render('topics', {
            topics,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/api/topics', async (req, res) => {
    try {
        const topics = await Topic.findAll();
        res.status(200).json(topics);
    } catch (err) {
        res.status(400).json(err)
    }
});

router.get('/api/comments', async (req, res) => {
    try {
        const comments = await Comment.findAll();
        res.status(200).json(comments);
    } catch (err) {
        res.status(400).json(err)
    }
});

router.get('/login', async (req, res) => {
   res.render('login');
});

router.get('/signup', async (req, res) => {
    res.render('signup');
});

router.get('/thankYou', async (req, res) => {
    res.render('thankYou');
});

router.get('/newTopic', withAuth, async (req, res) => {
    res.render('newTopic');
});

router.get('/comment', withAuth, async (req, res) => {
    res.render('comment');
});

router.get('/topic/:id', /*withAuth,*/ async (req, res) => {
    try {
        const dbTopicData = await Topic.findByPk(parseInt(req.params.id));

        const dbComments = await Comment.findAll({
            where: { topic_id: parseInt(req.params.id) }
        });

        const topic = dbTopicData.get({ plain: true });

        const comments = dbComments.map(comment => comment.get({ plain: true }))

        res.render('topicThread', {
            ...topic,
            comments: comments,
            logged_in: req.session.logged_in
        });
    
    } catch (err) {
        res.status(500).json(err)
    }
});



module.exports = router;