import { ProductCard } from "../components/ProductCard";
import { data } from "../data/data.jsx";

export function HomePage({ onAddToCart }) {
    // const products = data.
    return (
        <div>
            <ProductCard
                products={data}
                onAddToCart={onAddToCart}
            />
        </div>
    )
}