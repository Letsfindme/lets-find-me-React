import React, { Fragment, useEffect, useState } from "react";
import queryString from "query-string";
import FeedCard from "../../components/Feed/FeedCard/FeedCard";
import SearchCard from "../../components/Search/SearchCard";
import Paginator from "../../components/Paginator/Paginator";

export default props => {
  const baseUrl = "http://localhost:8080/feed/search";
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [searchUrl, setSearchUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [searchVlaues, setSearchVlaues] = useState({
    category: "",
    city: "",
    term: ""
  });

  useEffect(() => {
    appendSearchForm(queryString.parse(props.location.search));
  }, []);
  const appendSearchForm = searchTerm => {
    setSearchVlaues(searchTerm);
    const { term, category, city, currentPage = 0 } = searchTerm;
    setSearchUrl(
      "?term=" +
        term +
        "&category=" +
        category +
        "&city=" +
        city +
        "&currentPage=" +
        currentPage
    );
  };

  const getSearchPosts = async path => {
    // path = ?term=&category=&city=
    const res = await fetch(baseUrl + path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const json = await res.json();
    setCurrentPage(Number(json.currentPage));
    setLastPage(json.count - 1);
    setPosts(json.post);
    setLoading(true);
  };

  const submitSearchHandler = searchForm => {
    const { term, city, category } = searchForm;
    setSearchUrl("?term=" + term + "&category=" + category + "&city=" + city);
  };
  useEffect(() => {
    props.history.push("/feed/search" + searchUrl);
    getSearchPosts(searchUrl);
  }, [searchUrl]);

  const nextSearchHandler = searchForm => {
    let num = currentPage + 1;
    setCurrentPage(currentPage + 1);
    const nextPage = searchUrl + "&currentPage=" + num;
    props.history.push(nextPage);
    return getSearchPosts(nextPage);
  };

  const prevSearchHandler = searchForm => {
    let num = currentPage - 1;
    setCurrentPage(currentPage - 1);
    const nextPage = searchUrl + "&currentPage=" + num;
    props.history.push(nextPage);
    return getSearchPosts(nextPage);
  };

  return (
    <Fragment>
      <div className="search-container -result">
        <div className="search-card -result" position="sticky">
          <SearchCard
            {...props}
            searchVlaues={searchVlaues}
            className="box-shadow-7"
            acceptSearchChangeHandler={appendSearchForm}
          />
        </div>
      </div>
      <div className="posts-container">
        <div className="post-grid">
          <h1>Check out Best ME articles</h1>
          {loading &&
            posts &&
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
        <Paginator
          currentPage={currentPage}
          lastPage={lastPage}
          onPrevious={prevSearchHandler}
          onNext={nextSearchHandler}
        ></Paginator>
      </div>
    </Fragment>
  );
};
