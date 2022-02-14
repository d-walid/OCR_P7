import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty, timestampParser } from '../Utils/Utils';
import { Button, Card, Container, Image, Row, Col, FormControl, Form } from 'react-bootstrap';
import { addPost, getPosts } from '../../actions/post.actions';

const NewPostForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [postPicture, setPostPicture] = useState(null);
  const [link, setLink] = useState('');
  const [file, setFile] = useState();

  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const handlePicture = (event) => {
    setPostPicture(URL.createObjectURL(event.target.files[0]));
    setFile(event.target.files[0]);
    setLink('')
  }

  const handlePost = async () => {
    if (message || postPicture || link) {
      const data = new FormData();
      data.append('message', message);
      data.append('posterId', userData.id);
      if (file) data.append('file', file);
      data.append('link', link);

      await dispatch(addPost(data));
      dispatch(getPosts());
      cancelPost();
    } else {
      alert('Veuillez entrer un message.')
    }
  }

  const cancelPost = () => {
    setMessage('');
    setPostPicture('');
    setLink('');
    setFile('');
  }

  useEffect(() => {
    if (!isEmpty(userData)) setIsLoading(false);

    const handleVideo = () => {
      let findLinkYoutube = message.split(' ');
      for (let i = 0; i < findLinkYoutube.length; i++) {
        if (
          findLinkYoutube[i].includes('https://www.yout') ||
          findLinkYoutube[i].includes('https://yout')
        ) {
          let embedVideo = findLinkYoutube[i].replace('watch?v=', 'embed/');
          setLink(embedVideo.split('&')[0]);
          findLinkYoutube.splice(i, 1);
          setMessage(findLinkYoutube.join(' '));
          setPostPicture('')
        }
      }
    };
    handleVideo();
  }, [userData, message, link])

  useEffect(() => {
    if (!isEmpty(userData)) setIsLoading(false);
  }, [userData])
  return (
    <Container>
      {isLoading ? (
        <h6>Chargement</h6>
      ) : (
        <>
          <Row>
            <Col sm={2}>
              <Image
                className='mb-3'
                roundedCircle
                width={100}
                height={100}
                fluid={true}
                src={userData.avatar}
                alt="avatar-post-author"
              />
            </Col>

            <Col sm={4}>
              <FormControl
                as="textarea"
                size="md"
                rows="4"
                name='message'
                id='message'
                placeholder='Dites quelque chose...'
                onChange={(event) => setMessage(event.target.value)}
                value={message}
              />
            </Col>

            {message || postPicture || link.length > 20 ? (
              <Container fluid>
                <Row>
                  <Col sm={4}>
                    <Card>
                      <Card.Header>
                        <h4>{userData.username}</h4>
                        <span>{timestampParser(Date.now())}</span>
                      </Card.Header>
                      <Card.Body>
                        <Card.Text>
                          {message}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Image src={postPicture} alt='' />
                {link && (
                  <iframe
                    title='link'
                    width="200"
                    height="200"
                    src={link}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </Container>
            ) : null}

            <div className="footer-form">
              <div className="icon">
                {isEmpty(link) && (
                  <>
                    <Form.Group controlId="formFile" className="mt-3 mb-3">
                      <Form.Control
                        className="w-50"
                        type="file"
                        onChange={handlePicture}
                      />
                    </Form.Group>
                  </>
                )}
                {link && (
                  <Button onClick={() => setLink('')}>Supprimer la vidéo</Button>
                )}
              </div>

              <div className="btn-send">
                {message || postPicture || link.length > 20 ? (
                  <Button variant='secondary' onClick={cancelPost}>Annuler</Button>
                ) : null}
                <Button variant='primary' onClick={handlePost}>Envoyer</Button>
              </div>

            </div>
          </Row>
        </>

      )
      }

    </Container >
  )
};

export default NewPostForm;
