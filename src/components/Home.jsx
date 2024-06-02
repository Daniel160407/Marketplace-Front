import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../style/Home.scss';

const Home = ({ updatedProducts }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [products, setProducts] = useState([]);
    const [showProduct, setShowProduct] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sortCriteria, setSortCriteria] = useState('name'); // Default sort by name
    const [sortDirection, setSortDirection] = useState('asc'); // Default sort direction

    useEffect(() => {
        axios.get('http://localhost:8080/marketplace/product/amount')
            .then(response => setTotalPages(response.data))
            .catch(error => console.error('Error fetching total pages:', error));
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8080/marketplace/product?page=${currentPage - 1}&sort=${sortCriteria}&direction=${sortDirection}`)
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, [currentPage, sortCriteria, sortDirection]);

    useEffect(() => {
        setProducts(updatedProducts);
    }, [updatedProducts]);

    const handlePageClick = (pageNumber) => {
        if (pageNumber !== currentPage && pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const renderPageNumbers = () => {
        return Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
            <li
                key={pageNumber}
                className={`pagination-item ${pageNumber === currentPage ? 'active' : ''}`}
                onClick={() => handlePageClick(pageNumber)}
            >
                {pageNumber}
            </li>
        ));
    };

    return (
        <div className="home-container">
            {!showProduct ? (
                <>
                    <div className="sort-options">
                        <label>
                            Sort by:
                            <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
                                <option value="name">Name</option>
                                <option value="price">Price</option>
                                <option value="submissionTime">Submission Time</option>
                            </select>
                        </label>
                        <label>
                            Direction:
                            <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </label>
                    </div>
                    <div className="products">
                        {products.map((product, index) => (
                            <div
                                className="product"
                                key={index}
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setShowProduct(true);
                                }}
                            >
                                <img src={product.photoUrl} alt={product.name} />
                                <h1>{product.name}</h1>
                                <p>{product.price}</p>
                            </div>
                        ))}
                    </div>
                    <div className="pagination-container">
                        <ul className="pagination">
                            <li
                                className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={() => handlePageClick(currentPage - 1)}
                            >
                                &laquo;
                            </li>
                            {renderPageNumbers()}
                            <li
                                className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={() => handlePageClick(currentPage + 1)}
                            >
                                &raquo;
                            </li>
                        </ul>
                    </div>
                </>
            ) : (
                <div className="productInfo">
                    <img className="arrow" src="/svg/arrow.svg" alt="Back" onClick={() => setShowProduct(false)} />
                    <img className="productImg" src={selectedProduct.photoUrl} alt={selectedProduct.name} />
                    <h1>{selectedProduct.name}</h1>
                    <p>{selectedProduct.submissionTime}</p>
                    <p>{selectedProduct.uploader}</p>
                    <p>{selectedProduct.description}</p>
                </div>
            )}
        </div>
    );
};

export default Home;
