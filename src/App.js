import React, { Component } from "react";
import { HashRouter as Router, Route, Link, NavLink, Redirect } from "react-router-dom";
import LogIn from "./components/LogIn/LogIn";
import LoggedIn from "./components/LogIn/LoggedIn";
import CRUDTable from "./components/CRUD Table/CRUDTable";
import facade from "./facades/ApiFacade";

import ShowTable from "./components/RestaurantTable/ShowSimpleSwapiTable";
import SwapiTable from "./components/RestaurantTable/SwapiTable";
import RestaurantsPag from "./components/RestaurantTable/RestaurantsPag";
import { CRUDTABLEURL } from "./settings";


const topics = [{ id: "topic-1", topic: <RestaurantsPag /> },
{ id: "topic-2", topic: <SwapiTable /> },
{ id: "topic-3", topic: "Yet another Topic" },
{ id: "topic-4", topic: <ShowTable /> }];

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            hasLoggedIn: false
        }
    }


    adminLogin = async (username, password) => {
        try {
            await facade.login(username, password)
            this.setState({ hasLoggedIn: true })
        }
        catch (error) {
            console.log(error.fullError.errorMessage)
        }
    }


    totalLogOut = () => {
        facade.logout()
        this.setState({ hasLoggedIn: false });
    }

    // componentDidMount()  {
    //     if(facade.loggedIn == true)
    //     this.setState({hasLoggedIn: true})
    // }

    checkifLoginIsTrue = () => {
        if (facade.loggedIn == true) {
            console.log(facade.loggedIn + "" + "else facade.loggedin true");
            this.setState({ hasLoggedIn: true })
            console.log(this.state.hasLoggedIn + "" + "else hasloggedn true");
        }
        else this.setState({ hasLoggedIn: false })
        console.log(this.state.hasLoggedIn + "" + "else statement called")
    }

    Admin = (facade) => {
        console.log(facade.loggedIn + "" + "before if")
        if (facade.loggedIn == true) {
            console.log(facade.loggedIn + "" + "else facade.loggedin true");
            this.setState({ hasLoggedIn: true })
            console.log(this.state.hasLoggedIn + "" + "else hasloggedn true");
        }
        return (
            <div>
                <h2>Admin Page</h2>
                <p>lad mig see mine data</p>
            </div>

        );

    }
    render() {
        return (
            <div>
                <Router>
                    <div>
                        <ul className="header">
                            <li>
                                <NavLink exact to="/">Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="/about">About</NavLink>
                            </li>
                            <li>
                                <NavLink to="/topics">Topics</NavLink>
                            </li>
                            {facade.loggedIn() ? (
                                <div>
                                    <li>
                                        <NavLink to="/admin">Admin Panel</NavLink>
                                    </li>
                                    <span className="navbar-text text-white">Logged in: {facade.username}</span>

                                    <div className="float-right">

                                        <button color="white" className="glyphicon glyphicon-log-out" onClick={this.totalLogOut}>Logout</button>

                                    </div>
                                </div>
                            ) : (
                                    <li className="float-right">
                                        <NavLink to="/login">
                                            <span className="glyphicon glyphicon-log-in"></span>  Admin Login
                                         </NavLink>
                                    </li>
                                )}
                        </ul>
                        <hr />
                        {console.log(this.state.hasLoggedIn)}
                        <Route exact path="/" component={Home} />
                        <Route path="/about" component={About} />
                        <Route path="/topics" component={Topics} />
                        <Route path="/login" render={() => <LogIn login={this.adminLogin} />} />
                        {/* <Route path="/admin" component= {Admin}/> */}
                        {this.state.hasLoggedIn ? <Route path="/admin" component={this.Admin} /> : null}

                    </div>
                </Router>
            </div>
        );
    }
}


function About() {
    return (
        <div>
            <h2>About</h2>
            <br />
            <h4>Quick Start Project for group #IkkeForLangt</h4>
            <CRUDTable />

        </div>
    );
}

function Home() {
    return (
        <div>
            <h2>Home</h2>
            <RestaurantsPag />
        </div>
    );
}



function Topics({ match }) {
    const lis = topics.map(t => <li key={t.id}> <Link to={`${match.url}/${t.id}`}>{t.id}</Link> </li>);
    return (
        <div>
            <h2>Topics</h2>
            <ul>
                {lis}
            </ul>


            <Route path={`${match.path}/:topicId`}
                render={(props) =>
                    <Topic {...props} detail={topics.find(t => t.id === props.match.params.topicId)} />} />


            <Route
                exact
                path={match.path}
                render={() => <h3>Please select a topic.</h3>}
            />
        </div>
    );
}

function Topic({ match, detail }) {
    return (
        <div>
            <h3>{match.params.topicId}</h3>
            <div>{detail.topic}</div>
        </div>
    );
}

export default App;
