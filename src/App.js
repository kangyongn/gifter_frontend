import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Routes from './pages/routes'
import NavComp from './components/NavComp'
import LandingPage from './pages/landing/index'
import { withRouter } from 'react-router-dom'

class App extends Component {

  state = {
    user: null,
    gifts: []
  }

  handleSignup = (e, user) => {
    e.preventDefault()
    fetch("https://gifter-backend.herokuapp.com/api/v1/users", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(userObj => {
      localStorage.setItem('token', userObj.jwt)
      this.setState({
        user: userObj.user
    }, () => this.props.history.push(`/${this.state.user.first_name}/gifts`))
    })
  }

  handleLogin = (e, user) => {
    e.preventDefault()
    fetch("https://gifter-backend.herokuapp.com/api/v1/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(userObj => {
      if(!!userObj.message) {
        alert(userObj.message)
      } else {
        localStorage.setItem('token', userObj.jwt)
        this.setState({
          user: userObj.user,
          gifts: userObj.gifts
        }, () => this.props.history.push(`/${this.state.user.first_name}/gifts`))
      }
    })
  }

  handleLogout = () => {
   this.setState({
     user: null,
     gifts: []
   })
   localStorage.removeItem("token")
  }

  render() {
    console.log(localStorage.getItem('token'))
    return (
      <div>
        <NavComp user={this.state.user} handleLogout={this.handleLogout}/>
        { !!this.state.user ?
          <Routes userObj={this.state}/>
          :
          !localStorage.getItem('token') && <LandingPage handleLogin={this.handleLogin} handleSignup={this.handleSignup} />
        }
      </div>
    );
  }

  componentDidMount(){
    if(localStorage.getItem('token')){
      fetch("https://gifter-backend.herokuapp.com/api/v1/current_user", {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      })
      .then(res => res.json())
      .then(userJSON => {
        this.setState({
          user: userJSON.user,
          gifts: userJSON.gifts
        })
      })
    }
  }
}

export default withRouter(App);
