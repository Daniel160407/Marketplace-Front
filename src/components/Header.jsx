import axios from 'axios';
import '../style/Header.scss';
import { useState } from 'react';

// eslint-disable-next-line react/prop-types
const Header = ({setProducts}) => {
    const [showAddNewWindow, setShowAddNewWindow] = useState(false);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const addNew = (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('submittionTime', new Date().toLocaleDateString());
        formData.append('image', image);

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

    return (
        <div id="header">
            <h1 id="title">Marketplace</h1>
            <button className="addNewBtn" onClick={() => setShowAddNewWindow(true)}>New</button>
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
