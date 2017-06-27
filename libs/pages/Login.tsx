import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Form from '../components/atoms/Form';
import Input from '../components/atoms/Input';
import Page from '../components/atoms/Page';

export interface IProps {
  handleSubmit: (username: string, password: string) => void;
}

const Login = ({ handleSubmit }: IProps & RouteComponentProps<{}>) => {
  let username: HTMLInputElement;
  let password: HTMLInputElement;

  return (
    <Page centered>
      <Form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          console.log(username.value, password.value);
          event.preventDefault();
        }}
      >
        <Input innerRef={c => username = c} placeholder="Username" type="username" />
        <Input innerRef={c => password = c} placeholder="Password" type="password" />
        <button type="submit">Go</button>
      </Form>
    </Page>
  );
};

export default Login;
