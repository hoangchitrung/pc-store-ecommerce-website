export function SignInPage() {
    return (
        <div className="sign-in-form">
            <h1>Sign In</h1>
            <div className="input-form">
                <label htmlFor="email">Email:</label>
                <input type="text" />
            </div>
            <div className="input-form">
                <label htmlFor="password">Password:</label>
                <input type="text" />
            </div>

            <button className="sign-in-button">Sign In</button>
        </div>
    );
}