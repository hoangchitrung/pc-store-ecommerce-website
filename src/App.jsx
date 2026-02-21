import { ProductCard, ProductCardObject } from "./components/ProductCard.jsx";
import { useState } from "react";

function App() {
    const price = 750;
    const productName = "RTX 3050 4GB";

    const product = {
        name: "Iphone 15",
        price: 1500
    };

    const [count, setCount] = useState(0); // value 0 when init
    return (
        <div>
            <h1>Hello World</h1>
            <ProductCard name={productName} price={price}></ProductCard>
            <ProductCardObject {...product}></ProductCardObject>
            <div className="countClick">
                <p>Count: {count}</p>
                <button onClick={() => setCount(count + 1)}>Increase</button>
                <button onClick={() => setCount(count - 1)}>Increase</button>
            </div>
        </div>
    )
}

export default App
