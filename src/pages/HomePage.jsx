import { ProductCard } from "../components/ProductCard";
import { data } from "../data/data.jsx";

export function HomePage() {
    // const products = data.
    return (
        <div>
            <ProductCard products={data}/>
        </div>
    )
}