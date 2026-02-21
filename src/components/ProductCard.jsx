import "./ProductCard.css"

export function ProductCard({ name, brand }) {
    return (
        <tr>
            <td>{name}</td>
            <td>{brand}</td>
        </tr>
    )
}

export function UserCard(user) {
    return (
        <div>
            <p>Id: {user.id}</p>
            <p>Name: {user.name}</p>
        </div>
    )
}