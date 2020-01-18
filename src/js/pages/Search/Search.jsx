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
    term: "",
    currentPage: 1
  });

  useEffect(() => {
    appendSearchForm(queryString.parse(props.location.search));
  }, []);

  const appendSearchForm = searchTerm => {
    const { term, category, city, currentPage = 1 } = searchTerm;
    setSearchVlaues({ term, category, city, currentPage });
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
    console.log("path", path);

    // path = ?term=&category=&city=
    const res = await fetch(baseUrl + path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const json = await res.json();
    setCurrentPage(parseInt(json.currentPage));
    setLastPage(parseInt(json.count) - 1);
    setPosts(json.post);
    setLoading(true);
  };

  // const submitSearchHandler = searchForm => {
  //   const { term, city, category } = searchForm;
  //   setSearchUrl("?term=" + term + "&category=" + category + "&city=" + city);
  // };

  useEffect(() => {
    props.history.push("/feed/search" + searchUrl);
    getSearchPosts(searchUrl);
  }, [searchUrl]);

  const nextSearchHandler = searchForm => {
    let num = parseInt(currentPage);
    num++;
    setCurrentPage(num++);
    let nextValue = searchVlaues;
    nextValue.currentPage = parseInt(searchVlaues.currentPage)+1;
    appendSearchForm(nextValue);
  };

  const prevSearchHandler = searchForm => {
    let num = parseInt(currentPage);
    num--;
    setCurrentPage(num--);
    let nextValue = searchVlaues;
    nextValue.currentPage = parseInt(searchVlaues.currentPage)-1;
    appendSearchForm(nextValue);
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
        <h1 className="br-0">Check out Best ME articles</h1>
        <div className="post-grid">
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
