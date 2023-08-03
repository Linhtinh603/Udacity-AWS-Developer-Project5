import { FC } from 'react';
import Auth from '../auth/Auth';
import { Button } from 'semantic-ui-react';

interface LoginProps {
  auth: Auth;
}

export const Login: FC<LoginProps> = ({ auth }) => {
  const onLogin = () => {
    auth.login();
  };

  return (
    <div>
      <h1>Please log in</h1>

      <Button onClick={onLogin} size="huge" color="olive">
        Log in
      </Button>
    </div>
  );
};
