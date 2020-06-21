import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import VerifyPage from './VerifyPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/verify">
          <VerifyPage />
        </Route>
        <Route path="">
          <LoginPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
