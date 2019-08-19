import React, { useState, useEffect } from "react";

import Image from "../../../components/Image/Image.jsx";
import "./SinglePost.css";

export default props => {
  const [state, setState] = useState({
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
    token:""
  });

  useEffect(() => {
    console.log('single', props.token);
    
    const postId = props.match.params.postId;
    fetch("http://localhost:8080/feed/post/" + postId, {
      headers: {
        Authorization: "Bearer " + props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then(resData => {
        setState({
          title: resData.post.title,
          author: resData.post.author,
          image: resData.post.imageUrl,
          date: new Date(resData.post.createdAt).toLocaleDateString("en-US"),
          content: resData.post.content
        });
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <section className="single-post">
      <h1>{state.title}</h1>
      <h2>
        Created by {state.author} on {state.date}
      </h2>
      <div className="single-post__image">
        <Image contain imageUrl={state.image} />
      </div>
      <p>{state.content}</p>
    </section>
  );
};
