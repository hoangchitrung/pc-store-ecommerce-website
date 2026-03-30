import ProfileSidebar from "../components/ProfileSidebar";
import ProfileForm from "../components/ProfileForm";

function ProfilePage() {
    return (
        <div className="profile-container">
            <ProfileSidebar />
            <ProfileForm />
        </div>
    );
}

export default ProfilePage;