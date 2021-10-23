import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import About from "./components/About";
import PortfolioList from "./components/PortfolioList";

import { UserProvider } from "./UserContext";
import { PortfolioProvider } from "./PortfolioContext";
import { SiteStatusProvider } from "./SiteStatusContext";

function App() {
  return (
    <div>
      <Router>
        <UserProvider>
          <PortfolioProvider>
            <SiteStatusProvider>
              <Navbar />
              <Switch>
                <Route exact path="/">
                  <PortfolioList />
                </Route>
                <Route exact path="/login">
                  <Login />
                </Route>
                <Route exact path="/about">
                  <About />
                </Route>
              </Switch>
            </SiteStatusProvider>
          </PortfolioProvider>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
