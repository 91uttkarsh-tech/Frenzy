import React from 'react';
import { FacebookShareButton, FacebookIcon } from 'react-share';
const Facebook = () => {
  return (
    <div>
      <FacebookShareButton url={'https://www.facbook.com'} hashtag="#muo">
        <FacebookIcon size={32} round />
      </FacebookShareButton>
    </div>
  );
};
export default Facebook;