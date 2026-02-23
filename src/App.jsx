import "./App.css"

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProductCard } from "./components/ProductCard.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ProductPage } from "./pages/ProductPage.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { ProductDetailsPage } from "./pages/ProductDetailsPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                {/* Static route */}
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/products" element={<ProductPage />}></Route>
                <Route path="/carts" element={<CartPage />}></Route>

                {/* Dynamic route */}
                <Route path="products/:id" element={<ProductDetailsPage />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

// function oldThings() {
//     const user = { id: 1, name: "Trung" };

//     const products = [
//         { id: 1, name: "RTX 3050 4GB", brand: "ASUS" },
//         { id: 2, name: "Intel Core I7-13400k", brand: "Intel" },
//     ]

//     const [count, setCount] = useState(0);

//     const [inputValue, setInputValue] = useState("");

//     function handleChange(e) {
//         setInputValue(e.target.value);
//     }
//     function handleSubmit() {
//         alert(`Input: ${inputValue}`)
//     }
//     <div>
//         <h1>Prop section</h1>
//         <ProductCard name={"RTX 3050"} brand={"Asus"}></ProductCard>
//         <br />
//         <UserCard {...user}></UserCard>

//         <h1>useState Section</h1>
//         <p>Count: {count}</p>
//         <button onClick={() => setCount(count + 1)}>Increase</button>
//         <button onClick={() => setCount(count - 1)}>Decrease</button>

//         <h1>Rendering List</h1>
//         <table>
//             <thead>
//                 <tr>
//                     <th>Name</th>
//                     <th>Brand</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {products.map((product) => (
//                     <ProductCard key={product.id} name={product.name} brand={product.brand}></ProductCard>
//                 ))}
//             </tbody>
//         </table>

//         <h1>Get Input data</h1>
//         <input type="text" value={inputValue} onChange={handleChange} />
//         <button onClick={handleSubmit}>Submit</button>
//     </div>
// }

export default App
