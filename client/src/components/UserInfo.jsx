function UserInfo({ user, size = "small" }) {
  const avatarSizes = {
    small: "w-6 h-6", // 24x24px
    medium: "w-8 h-8", // 32x32px
    large: "w-10 h-10", // 40x40px
  };

  const imageSize = avatarSizes[size] || avatarSizes.small;

  const imageUrl = user?.profile_image
    ? `${process.env.REACT_APP_API_BASE}/uploads/${user.profile_image}`
    : "/default-avatar.png";

  return (
    <div className="inline-flex items-center gap-2">
      <img
        src={imageUrl}
        alt="P"
        className={`${imageSize} rounded-full object-cover border border-gray-300 dark:border-gray-600`}
      />
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {user?.name || "Anonim"}
      </span>
    </div>
  );
}

export default UserInfo;
