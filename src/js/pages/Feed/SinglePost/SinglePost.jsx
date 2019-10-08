import React, {useState, useEffect, Fragment} from 'react';
import Moment from 'react-moment';
import Input from '../../../components/Form/Input/Input';
import Image from '../../../components/Image/Image.jsx';
import Back from '../../../components/Button/Back';
import StarRatingComponent from 'react-star-rating-component';
import avatarPng from "../../../../assets/images/User_Avatar.png";

export default (props) => {
    const fields = [
        {
            label: 'Entre your comment here',
            type: 'input',
            name: 'comment',
            value: ''
        }
    ];

    const [state, setState] = useState([]);
    const [postComments, setPostComments] = useState([]);
    const [rating, setRating] = useState(0);
    const [posttingComment, setPosttingComment] = useState(false);

    useEffect(() => {
        const postId = props.match.params.postId;
        fetch('http://localhost:8080/feed/post/' + postId, {
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error('Failed to fetch status');
                }
                return res.json();
            })
            .then((resData) => {
                setState(resData.post);
                setPostComments(resData.post.postComments);
                setRating(resData.post.starCount);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const addCommentHandler = (value) => {
        let method = 'POST';
        const postId = props.match.params.postId;
        fetch('http://localhost:8080/feed/post/' + postId, {
            method: method,
            body: JSON.stringify({
                text: value.comment
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + props.token
            }
        }).then((res) => {
            if (res.status !== 201 || res.status !== 201) {
                throw new Error('Failed to add comment');
            }
            return res.json();
        }).then(res => {
                setPosttingComment(true);
                setPostComments([...postComments, res.comment]);
                setPosttingComment(false);
            }
        );
    };

    const onStarClick = (nextValue, prevValue, name) => {
        const postId = props.match.params.postId;
        fetch('http://localhost:8080/feed/post/' + postId + '/' + nextValue, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + props.token,
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.status !== 201 || res.status !== 201) {
                throw new Error('Failed to add rate');
            }
            return res.json();
        }).then(res => {
            setRating(res.rate);
        });
    };

    return (
        <Fragment>
            <section className="feed_edit post-content">
                <Back click={props.history.goBack} text=" back to home"/>
                <h1>{state.title}</h1>
                <div className="single-post__image">
                    <StarRatingComponent name="rate1" starCount={5} value={rating} onStarClick={onStarClick}/>
                    <Image imageUrl={state.imageUrl}/>
                </div>
                <li className="post-content comment-contain">
                    {state.user && (
                        <Fragment>
                            <Image
                                previews={state.user.Avatar ? undefined : true}
                                local={state.user.Avatar ? undefined : true}
                                key={'imagesPreview avatar'}
                                className={'user-profile'}
                                imageUrl={state.user.Avatar ? state.user.Avatar.imageRef : avatarPng}
                                left
                            />
                            <div>
                                <div className="comment-right">
                                    <h5>{state.user.username}</h5>
                                    <Moment format="YYYY/MM/DD hh:mm">{state.createdAt}</Moment>
                                </div>
                            </div>
                        </Fragment>
                    )}
                </li>
                <p>{state.content}</p>
                <div className="post-action">
                    <i className="far fa-thumbs-up">
                        <StarRatingComponent
                            name="rate1"
                            starCount={5}
                            value={rating}
                            onStarClick={onStarClick}
                        />
                    </i>
                    <i className="far fa-comment-alt"/>
                </div>
                {/* profile public et profile privee */}
                {/* <div className="post-content">
          {state.user && (
            <Image
              key={"imagesPreview avatar"}
              className={"user-profile"}
              imageUrl={state.user.Avatar.imageRef}
              left
            />
          )}
          <p>{state.content}</p>
        </div> */}
            </section>
            <ul className="feed_edit comments">
                {postComments &&
                postComments.length > 0 && (
                    <Fragment>
                        <p>{postComments.length} comments</p>
                        {postComments.map((comment) => {
                            return (
                                <li key={comment.id} className="comment-contain">
                                    <Image
                                        key={'imagesPreview avatar'}
                                        className={'user-profile'}
                                        imageUrl={comment.imageRef}
                                        left
                                    />
                                    <div>
                                        <div className="comment-right">
                                            <h5>{comment.user.username}</h5>
                                            <Moment format="YYYY/MM/DD hh:mm">{comment.createdAt}</Moment>
                                            {/* <span>{comment.createdAt}</span> */}
                                        </div>
                                        <p>{comment.text}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </Fragment>
                )}
                <section className="comment-add">
                    {state.user && (
                        <Image
                            key={'imagesPreview avatar'}
                            className={'user-profile user-profile-commment'}
                            imageUrl={state.user.Avatar ? state.user.Avatar.imageRef : ""}
                            left
                        />
                    )}
                    {!posttingComment &&
                    <Input
                        control="form"
                        fields={fields}
                        //validation={newPostValid}
                        //onChange={postInputChangeHandler}
                        formSubmit={(value) => addCommentHandler(value)}
                        btnValue="Add commit"
                        //cancelPostChangeHandler={cancelPostChangeHandler}
                    />}
                </section>
            </ul>
        </Fragment>
    );
};
