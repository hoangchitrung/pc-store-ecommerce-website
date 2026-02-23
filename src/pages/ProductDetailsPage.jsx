import { useParams } from "react-router-dom"

export function ProductDetailsPage() {
    const { id } = useParams();
    return (
        <h1>Product Detail - ID: {id}</h1>
    )
}