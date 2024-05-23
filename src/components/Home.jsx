import {useEffect, useState} from 'react';
import axios from 'axios';
import '../style/Home.scss';

// eslint-disable-next-line react/prop-types
const Home = ({updatedProducts}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [products, setProducts] = useState([]);
    const [showProduct, setShowProduct] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8080/marketplace/product/amount')
            .then(response => setTotalPages(response.data))
            .catch(error => console.error('Error fetching total pages:', error));
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8080/marketplace/product?page=${currentPage - 1}`)
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, [currentPage]);

    useEffect(() => {
        setProducts(updatedProducts);
    }, [updatedProducts]);

    const handlePageClick = (pageNumber) => {
        if (pageNumber !== currentPage && pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const renderPageNumbers = () => {
        return Array.from({length: totalPages}, (_, i) => i + 1).map(pageNumber => (
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
                                <img src={product.photoUrl} alt={product.name}/>
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
                    <img className="arrow" src="/svg/arrow.svg" alt="Back" onClick={() => setShowProduct(false)}/>
                    <img className="productImg" src={selectedProduct.photoUrl} alt={selectedProduct.name}/>
                    <h1>{selectedProduct.name}</h1>
                    <p>{selectedProduct.submittionTime}</p>
                    <p>{selectedProduct.description}</p>
                </div>
            )}
        </div>
    );
};

export default Home;
