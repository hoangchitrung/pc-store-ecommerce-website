import { ProductCard } from "../components/ProductCard";

export function HomePage() {
    const products = [
        { id: 1, name: `MacBook 14"`, price: 1500.00, stock: 50 },
        { id: 2, name: `MacBook 15"`, price: 1500.00, stock: 50 },
        { id: 3, name: `MacBook 16"`, price: 1500.00, stock: 50 },
        { id: 4, name: `MacBook 17"`, price: 1500.00, stock: 50 },
    ];
    return (
        <div>
            <ProductCard products={products}/>
        </div>
    )
}