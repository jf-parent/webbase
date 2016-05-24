import { browserHistory } from "react-router"
import axios from "axios"
import Observer from "Observer"

class Auth {
  constructor() {
      this.nextPath = false;

      this.getUser = this.getUser.bind(this);
      this.setUser = this.setUser.bind(this);
      this.isAuthenticated = this.isAuthenticated.bind(this);
      this.requireAuth = this.requireAuth.bind(this);
      this.requireNotAuth = this.requireNotAuth.bind(this);
      this.onLogin = this.onLogin.bind(this);
      this.onLogout = this.onLogout.bind(this);
  }

  onLogin(user) {
    this.setUser(user);
    if (user) {
      if (this.nextPath) {
        browserHistory.push(this.nextPath);
      } else {
        browserHistory.push("/profile");
      }
    }
    Observer.fire("updateAuth");
  }

  onLogout() {
      this.setUser(false);
      browserHistory.push("/");
      Observer.fire("updateAuth");
  }

  getUser() {
    return this.user;
  }

  setUser(user) {
    this.user = user;
  }

  isAuthenticated() {
    axios.get("/api/get_session")
      .then((response) => {
        console.log("get_session", response);
        if (response.data.success) {
          this.onLogin(response.data.user);
        } else {
          this.onLogin(false);
        }
      })
      .catch((response) => {
        console.log("get_session error", response);
        this.onLogin(false);
      });
  }

  requireNotAuth(nextState, replace) {
    console.log("requireNotAuth", this.getUser());
    if (this.getUser()) {
      replace({
        pathname: "/profile"
      })
    }
  }

  requireAuth(nextState, replace) {
    console.log("requireAuth", this.getUser());
    if (!this.getUser()) {
      this.nextPath = nextState.location.pathname;
      replace({
        pathname: "/login"
      })
    }
  }
}

module.exports = Auth
