import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Mint from './components/Mint';
import nft from './components/nft';
import './App.css';
import ReferralList from './components/ReferralList';

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/mint" component={Mint} />
        <Route path="/nft" component={nft} />
        <Route path="/referrals" component={ReferralList} />
      </Switch>
    </Router>
  );
};

export default App;
