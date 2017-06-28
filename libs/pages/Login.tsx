import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import Button from '../components/atoms/Button';
import Form from '../components/atoms/Form';
import Input, { InputSize } from '../components/atoms/Input';
import Page from '../components/atoms/Page';
import { Dispatch } from '../store/action';
import { LOGIN_REQUEST } from '../store/modules/session';

export interface IDispatchProps {
  handleSubmit: (username: string, password: string) => void;
}

type Props = RouteComponentProps<{}>;

const Login = ({ handleSubmit }: IDispatchProps & Props) => {
  let username: HTMLInputElement;
  let password: HTMLInputElement;

  return (
    <Page centered>
      <Form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          handleSubmit(username.value, password.value);
          event.preventDefault();
        }}
      >
        <Input
          size={InputSize.Medium}
          innerRef={c => username = c}
          placeholder="Username"
          type="username"
        />
        <Input
          size={InputSize.Medium}
          innerRef={c => password = c}
          placeholder="Password"
          type="password"
        />
        <Button type="submit">Go</Button>
      </Form>
    </Page>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  handleSubmit: (username: string, password: string) => dispatch({
    payload: { username, password },
    type: LOGIN_REQUEST,
  }),
});

export default connect<void, IDispatchProps, Props>(undefined, mapDispatchToProps)(Login);
