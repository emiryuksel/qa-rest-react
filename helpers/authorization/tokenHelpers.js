const sendJwtToClient = (user, res) => {
  const token = user.generateJwtFromUser(); // veya generateJwtFromUser(user)

  res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    })
    .json({
      success: true,
      token, // ✅ EKLİYORUZ
    });
};

const isTokenIncluded = (req) => {
  return (
    req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
  );
};

const getAccessTokenFromHeader = (req) => {
  const authorization = req.headers.authorization;
  const access_token = authorization.split(" ")[1];
  return access_token;
};

module.exports = {
  sendJwtToClient,
  isTokenIncluded,
  getAccessTokenFromHeader,
};
