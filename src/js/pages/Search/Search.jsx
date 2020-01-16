import React, { Fragment, useEffect, useState } from "react";
import queryString from "query-string";
import FeedCard from "../../components/Feed/FeedCard/FeedCard";
import SearchCard from "../../components/Search/SearchCard";

export default props => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [searchVlaues, setSearchVlaues] = useState({
    category: "",
    city: "",
    term: ""
  });
  useEffect(() => {
    appendSearchForm(queryString.parse(props.location.search));

    //console.log("search valu", searchVlaues);
    fetch("http://localhost:8080/feed/search" + props.location.search, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        return res.json();
      })
      .then(res => setPosts(res.post))
      .then(setLoading(true));
  }, []);

  const appendSearchForm = searchTerm => {
    setSearchVlaues(searchTerm);
  };
  return (
    <Fragment>
      <div className="search-container -result">
        <div className="search-card -result" position="sticky">
          <SearchCard
            {...props}
            searchVlaues={searchVlaues}
            className="box-shadow-7"
            onClick={() => {
              goToSearch;
            }}
          />
        </div>
      </div>
      <div className="posts-container">
        <h1>Check out Best ME articles</h1>
        <div className="post-grid">
          {loading && posts &&
            // getPosts &&
            posts.map(post => (
              <FeedCard
                key={post.id}
                id={post.id}
                startCount={post.starCount}
                author={post.user.username}
                date={new Date(post.createdAt).toLocaleDateString("en-US")}
                title={post.title}
                thumb={post.imageUrl}
                image={post.user.Avatar ? post.user.Avatar.imageRef : undefined}
                content={post.content}
                //onStartEdit={startEditPostHandler.bind(this, post.id)}
              />
            ))}
        </div>
      </div>
    </Fragment>
  );
};
