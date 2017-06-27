import * as Koa from 'koa';
import * as React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { ServerStyleSheet } from 'styled-components';
import Root from '../../containers/Root';
import configureStore from '../../store';

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

const renderMiddleware = () => (ctx: Koa.Context) => {
  const routerContext = {};
  const sheet = new ServerStyleSheet();
  const store = configureStore();

  const contents = renderToString(
    sheet.collectStyles(
      <Provider store={store}>
        <StaticRouter location={ctx.req.url} context={routerContext}>
          <Root />
        </StaticRouter>
      </Provider>,
    ),
  );

  const css = sheet.getStyleElement();

  const markup = renderToStaticMarkup(
    <Html contents={contents} css={css} />,
  );

  ctx.body = `<!doctype>${markup}`;
};

export default renderMiddleware;
