function ProfileSidebar() {
    return (
        <div className="card h-100">
            <div className="card-body">
                <h5 className="card-title mb-3">Account Settings</h5>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item active">Personal Info</li>
                    <li className="list-group-item">Security</li>
                    <li className="list-group-item">My Orders</li>
                    <li className="list-group-item">Addresses</li>
                    <li className="list-group-item">Notifications</li>
                </ul>
            </div>
            <div className="card-footer bg-transparent border-top-0">
                <button className="btn btn-outline-danger btn-sm w-100">Log Out</button>
            </div>
        </div>
    );
}

export default ProfileSidebar;