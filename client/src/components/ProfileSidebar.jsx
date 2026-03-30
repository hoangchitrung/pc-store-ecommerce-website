function ProfileSidebar() {
    return (
        <div className="sidebar">
            <h3>Settings</h3>

            <ul>
                <li className="active">Personal Info</li>
                <li>Security</li>
                <li>My Orders</li>
                <li>Addresses</li>
                <li>Notifications</li>
            </ul>

            <button className="logout">Log Out</button>
        </div>
    );
}

export default ProfileSidebar;