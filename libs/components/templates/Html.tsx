import * as React from 'react';

interface IProps {
  contents?: string;
  css?: Array<React.ReactElement<{}>>;
}

const Html = ({ contents, css }: IProps) => (
  <html lang="en">
  <head>
    <title>Redux Saga Demo</title>
    <meta charSet="UTF-8" />
    {css}
  </head>
  <body>
    <main id="app" dangerouslySetInnerHTML={{ __html: contents }} />
    <script src="http://localhost:3001/bundle.js" />
  </body>
  </html>
);

export default Html;
