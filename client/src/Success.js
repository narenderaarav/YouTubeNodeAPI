import React from "react";

function Success() {
  return (
    <div
      style={{
        display: "flex",
        margin: "2em 0",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <section className="hero is-medium is-primary is-bold">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Success!{" "}
              <span role="img" aria-label="Thumbs Up Emoji">
                👍
              </span>
            </h1>
            <h2 className="subtitle">Your video will be uploaded shortly</h2>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Success;
