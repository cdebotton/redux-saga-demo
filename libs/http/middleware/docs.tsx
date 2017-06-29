import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as Koa from 'koa';
import * as path from 'path';
import * as React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { ServerStyleSheet } from 'styled-components';
import Html from '../../components/templates/Html';
import Root from '../../containers/Root';
import configureStore from '../../store';

interface IPage {
  title: string;
  children: IPage[];
}

const getPages = (json: { [key: string]: any }): IPage[] => {
  return Object.keys(json)
    .map(key => ({
      children: json[key].children ? getPages(json[key].children) : null,
      title: key,
    }));
};

const docsMiddleware = () => (ctx: Koa.Context) => {
  const file = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'docs', 'slides.yaml'));
  const text = file.toString();
  const json = yaml.safeLoad(text);
  const routerContext = {};
  const store = configureStore();
  const sheet = new ServerStyleSheet();

  const data: IPage[] = getPages(json);

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

  // ctx.body = `<!doctype>${markup}`;
  ctx.body = json;
};

export default docsMiddleware;
