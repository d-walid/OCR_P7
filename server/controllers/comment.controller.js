const db = require('../models/index');
const token = require('../middlewares/token.middleware');


exports.createComment = async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      res.status(400).send({ error: 'Vous devez écrire un message pour que le commentaire soit publié.' });

    } else {
      const userId = token.getUserIdFromToken(req);
      const post = await db.Post.findOne({ where: { id: req.params.id } });
      const user = await db.User.findOne({ where: { id: userId } });

      const comment = await db.Comment.create({
        message,
        UserId: userId,
        PostId: post.id,
        username: user.username
      });

      res.status(201).json({
        message: 'Le commentaire a bien été publié.',
        Comment: comment,
      })
    }
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}


exports.deleteComment = async (req, res) => {
  try {
    const userId = token.getUserIdFromToken(req);
    const comment = await db.Comment.findOne({
      attributes: ['id', 'UserId', 'message', 'username'],
      where: {
        id: req.params.id,
        UserId: userId,
      },
    });
    const isAdmin = await db.User.findOne({ where: { id: userId } });

    if (comment.UserId === userId || isAdmin.isAdmin === true) {
      await db.Comment.destroy({
        where: {
          id: req.params.id
        }
      });
      res.status(200).json({
        message: 'Le commentaire a bien été supprimé.',
        Comment: comment
      })

    } else {
      res.status(401).send({ error: 'Vous n\'avez pas le droit de supprimer ce commentaire.' })
    }
  } catch (error) {
    res.status(500).send({ error: 'Une erreur est survenue.' })
  }
}


exports.getCommentsFromPost = async (req, res) => {
  try {
    const userId = token.getUserIdFromToken(req);
    const comments = await db.Comment.findAll({
      attributes: ['id', 'message'],
      where: {
        PostId: req.params.id
      },
      include: [{
        model: db.User,
        attributes: ['id', 'username']
      }]
    });

    res.status(200).json({
      comments
    })
  } catch (error) {
    res.status(500).send({ error: 'Une erreur est survenue.' })
  }
}
