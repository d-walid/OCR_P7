import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import Image from 'react-bootstrap/Image';
import { addComment, getPosts } from '../../actions/post.actions';
import DeleteComment from './DeleteComment';

const CardComments = ({ post }) => {
  const [message, setMessage] = useState('');
  const userData = useSelector(state => state.userReducer);
  const dispatch = useDispatch();

  const handleComment = (event) => {
    event.preventDefault();

    if (message) {
      dispatch(addComment(post.id, userData.id, message, userData.username))
        .then(() => dispatch(getPosts()))
        .then(() => setMessage(''));
    }
  }

  return (
    <div className="comments-container">
      {post.Comments.map((comment) => {
        return (
          <div key={comment.id}>
            <div className="left-part">
              <Image
                width={75}
                height={75}
                fluid={true}
                src={comment.User.avatar}
                alt="avatar"
              />
            </div>
            <div className="right-part">
              <div className="pseudo">
                <h6>{comment.User.username}</h6>
              </div>
              <div className="comment">
                <p>{comment.message}</p>
                <DeleteComment comment={comment} postId={post.id} />
              </div>
            </div>
          </div>
        )
      })}
      {userData.id && (
        <form
          action=''
          onSubmit={handleComment}
          className="comment-form"
        >
          <input
            type="text"
            name="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ajouter un commentaire"
          />
          <input type='submit' value='Envoyer' />
        </form>
      )}
    </div>
  )
};

export default CardComments;
