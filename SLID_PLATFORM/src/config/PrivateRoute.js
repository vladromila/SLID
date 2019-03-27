import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import SplashScreen from '../components/SplashScreen/SplashScreen';

const PrivateRoute = ({ component: Component, path, type, user, albums }) => {
    return (
        <Route
            exact
            path={path}
            render={(props) => {
                if (user === 'notVerified')
                    return <SplashScreen />
                else
                    if (type === "dashboard")
                        if (user !== null)
                            return <Component albums={albums} param={props.match.params.handle} {...props}/>
                        else
                            return <Redirect to="/login" />
                    else
                        if (type === "auth")
                            if (user === null)
                                return <Component {...props} albums={albums} />
                            else
                                return <Redirect to="/" />
            }}
        />)
}
export default PrivateRoute 