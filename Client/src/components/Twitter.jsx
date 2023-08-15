import React from "react";
import { TwitterShareButton, TwitterIcon } from "react-share";

const Twitter = () => {
  return (
    <div>
      <TwitterShareButton url={"https://www.twitter.com"} hashtag="#muo">
        <TwitterIcon size={32} round />
      </TwitterShareButton>
    </div>
  );
};

export default Twitter;
