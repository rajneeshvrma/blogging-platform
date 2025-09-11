// This is a placeholder for now. Full functionality would require
// an API service to get/update user profile data.
import useAuth from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <p>Please log in to see your profile.</p>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-5">Profile</h1>
      <div className="space-y-4">
        <div>
          <p className="font-semibold">Name:</p>
          <p>{user.name}</p>
        </div>
        <div>
          <p className="font-semibold">Email:</p>
          <p>{user.email}</p>
        </div>
      </div>
    </div>
  );
};
export default Profile;