export function SignUpPage() {
    return (
        <div className="sign-up-form">
            <h1>Sign In</h1>
            <div className="input-field">
                <label htmlFor="fullname">Full Name:</label>
                <input type="text" />
            </div>

            <div className="input-field">
                <label htmlFor="email">Email:</label>
                <input type="text" />
            </div>

            <div className="input-field">
                <label htmlFor="password">Password:</label>
                <input type="text" />
            </div>

            <div className="input-field">
                <label htmlFor="address">Address:</label>
                <input type="text" />
            </div>

            <button className="sign-in-button">Sign In</button>
        </div>
    );
}