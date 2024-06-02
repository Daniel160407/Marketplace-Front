import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import '../../style/authorization/Login.scss';

const Login = ({ logIn }) => {
    const [name, setName] = useState(undefined);
    const [email, setEmail] = useState(undefined);
    const [password, setPassword] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState('');
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);

    useEffect(() => {
        const username = Cookies.get('username');
        const email = Cookies.get('email');
        const password = Cookies.get('password');

        if(username && email && password){
            setName(username);
            setEmail(email);
            setPassword(password);

            onLoginSubmit(null, email, password);
        }
    }, []);

    const onLoginSubmit = (event, savedEmail, savedPassword) => {
        if (event) event.preventDefault();

        const user = {
            email: savedEmail || email,
            password: savedPassword || password
        };
        
        axios.post('http://localhost:8080/marketplace/login', user)
            .then(response => {
                console.log(response.data.name);
                Cookies.set('username', response.data.name, {expires: 1});
                Cookies.set('email', user.email, {expires: 1});
                Cookies.set('password', user.password, {expires: 1});
                setName(response.data.name);
                logIn(true); 
            })
            .catch(() => setErrorMessage('Invalid email or password'));
    };

    const onRegisterSubmit = (event) => {
        event.preventDefault();

        const user = {
            name: name,
            email: email,
            password: password
        };

        axios.post('http://localhost:8080/marketplace/login/register', user)
            .then(() => {
                Cookies.set('username', user.name, {expires: 1});
                Cookies.set('email', user.email, {expires: 1});
                Cookies.set('password', user.password, {expires: 1});
                setShowRegistrationForm(false);
            })
            .catch(() => setErrorMessage('This account is already registered'));
    };

    return (
        <>
            {!showRegistrationForm ? (
                <div className="login">
                    <form onSubmit={onLoginSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <p className="account" onClick={() => setShowRegistrationForm(true)}>
                            Don’t have an account?
                        </p>
                        <p className="errorMessage">{errorMessage}</p>
                        <input type="submit" value="Log In" />
                    </form>
                </div>
            ) : (
                <div className="register">
                    <form onSubmit={onRegisterSubmit}>
                        <input
                            type="text"
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <p className="account" onClick={() => setShowRegistrationForm(false)}>
                            Already have an account?
                        </p>
                        <p className="errorMessage">{errorMessage}</p>
                        <input type="submit" value="Register" />
                    </form>
                </div>
            )}
        </>
    );
};

export default Login;
