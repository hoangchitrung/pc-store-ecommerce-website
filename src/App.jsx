import { ProductCard, UserCard } from "./components/ProductCard.jsx"
import { useState } from "react";
import "./App.css"

function App() {
    const user = { id: 1, name: "Trung" };

    const products = [
        { id: 1, name: "RTX 3050 4GB", brand: "ASUS" },
        { id: 2, name: "Intel Core I7-13400k", brand: "Intel" },
    ]

    const [count, setCount] = useState(0);

    const [inputValue, setInputValue] = useState("");

    function handleChange(e) {
        setInputValue(e.target.value);
    }
    function handleSubmit() {
        alert(`Input: ${inputValue}`)
    }
    return (
        <div>
            <h1>Prop section</h1>
            <ProductCard name={"RTX 3050"} brand={"Asus"}></ProductCard>
            <br />
            <UserCard {...user}></UserCard>

            <h1>useState Section</h1>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increase</button>
            <button onClick={() => setCount(count - 1)}>Decrease</button>

            <h1>Rendering List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Brand</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <ProductCard key={product.id} name={product.name} brand={product.brand}></ProductCard>
                    ))}
                </tbody>
            </table>

            <h1>Get Input data</h1>
            <input type="text" value={inputValue} onChange={handleChange} />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default App
