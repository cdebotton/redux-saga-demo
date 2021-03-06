import * as Koa from 'koa';
import * as React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { ServerStyleSheet } from 'styled-components';
import Html from '../../components/templates/Html';
import Root from '../../containers/Root';
import configureStore from '../../store';

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
