import ProfileSidebar from "../components/ProfileSidebar";
import ProfileForm from "../components/ProfileForm";

function ProfilePage() {
    return (
        <div className="container mt-5 mb-5">
            <div className="row gy-4">
                <div className="col-lg-4">
                    <ProfileSidebar />
                </div>
                <div className="col-lg-8">
                    <ProfileForm />
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;