import { useState } from "react";
import Header from "./components/Header";
import Home from "./components/Home";

const App = () => {
    const [products, setProducts] = useState([]);

    return (
        <>
            <Header setProducts={setProducts}/>
            <Home updatedProducts={products}/>
        </>
    );
}

export default App;