import axios from 'axios';
import '../style/Header.scss';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Login from './authorization/Login';

// eslint-disable-next-line react/prop-types
const Header = ({ setProducts }) => {
    const [showAddNewWindow, setShowAddNewWindow] = useState(false);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState('');

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        setUsername(Cookies.get('username'));
    }, [isLoggedIn]);

    useEffect(() => {
        if(Cookies.get('username') !== undefined && Cookies.get('email') !== undefined && Cookies.get('password') !== undefined){
            setUsername(Cookies.get('username'));
            setShowLogin(true);
        }
    }, [])

    const addNew = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('submittionTime', new Date().toLocaleDateString());
        formData.append('image', image);
        formData.append('uploader', username);

        axios.post('http://localhost:8080/marketplace/product', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            setProducts(response.data);
        });

        setShowAddNewWindow(false);
        setTitle('');
        setPrice('');
        setDescription('');
        setImage(null);
    }

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    }

    const handleLogout = () => {
        Cookies.remove('username');
        Cookies.remove('email');
        Cookies.remove('password');
        setIsLoggedIn(false);
    }

    const logIn = (isLoggedIn) => {
        setIsLoggedIn(isLoggedIn);
        setShowLogin(false);
    }

    return (
        <div id="header">
            <h1 id="title">Marketplace</h1>
            {isLoggedIn ? (
                <>
                    <button className="addNewBtn" onClick={() => setShowAddNewWindow(true)}>New</button>
                    <button className='logInButton' onClick={handleLogout}>Log Out</button>
                </>
            ) : (
                <>
                    <button className='logInButton' onClick={() => setShowLogin(!showLogin)}>Log In</button>
                    {showLogin && (
                        <Login logIn={logIn} />
                    )}
                </>
            )}
            {showAddNewWindow && (
                <div className="addNewWindowContainer">
                    <form className="add-new-window" onSubmit={addNew}>
                        <img className="arrow" src="/svg/arrow.svg" alt="Back" onClick={() => setShowAddNewWindow(false)}/>
                        <h1>Add New Item</h1>
                        <div className="form-group">
                            <label htmlFor="itemTitle">Title</label>
                            <input
                                id="itemTitle"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="itemPrice">Price</label>
                            <input
                                id="itemPrice"
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Price"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="file"
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="itemDescription">Description</label>
                            <textarea
                                id="itemDescription"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                            ></textarea>
                        </div>
                        <input type="submit" className="submit-btn" value={'Save'}/>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Header;
