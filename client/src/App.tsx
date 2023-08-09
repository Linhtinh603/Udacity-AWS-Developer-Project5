import { FC } from 'react';
import { Link, Route, Router, Switch } from 'react-router-dom';
import { Grid, Header, Menu, Segment } from 'semantic-ui-react';
import Auth from './auth/Auth';
import { Login } from './components/LogIn';
import { NotFound } from './components/NotFound';
import { Memories } from './components/Memories';
import { NewMemory } from './components/NewMemory';
import { EditMemory } from './components/EditMemory';

export interface AppProps {
  auth: Auth;
  history: any;
}

export const App: FC<AppProps> = ({ auth, history }) => {
  const handleLogin = () => {
    auth.login();
  };

  const handleLogout = () => {
    auth.logout();
  };

  const generateMenu = () => {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>

        <Menu.Menu position="right">{logInLogOutButton()}</Menu.Menu>
      </Menu>
    );
  };

  const logInLogOutButton = () => {
    if (auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={handleLogout}>
          Log Out
        </Menu.Item>
      );
    } else {
      return (
        <Menu.Item name="login" onClick={handleLogin}>
          Log In
        </Menu.Item>
      );
    }
  };

  const generateCurrentPage = () => {
    if (!auth.isAuthenticated()) {
      return <Login auth={auth} />;
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => {
            return <Memories {...props} auth={auth} />;
          }}
        />
        <Route
          path="/memories/new"
          exact
          render={(props) => {
            return <NewMemory {...props} auth={auth} />;
          }}
        />
        <Route
          path="/memories/:memoryId/edit"
          exact
          render={(props) => {
            return <EditMemory {...props} auth={auth}/>;
          }}
        />
        <Route component={NotFound} />
      </Switch>
    );
  };

  return (
    <div>
      <Segment style={{ padding: '8em 0em' }} vertical>
        <Grid container stackable verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={16}>
              <Router history={history}>
                {generateMenu()}
                <Header as="h1" textAlign="center" block color="orange">
                  Memory Pictures
                </Header>
                {generateCurrentPage()}
              </Router>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
};
