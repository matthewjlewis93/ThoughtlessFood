import jwt from 'jsonwebtoken';

const generateToken = (res, userID, expireTime = 365 * 24 * 60 * 60 * 1000) => {
  
  const expireInStr = expireTime > 90000 ? "365d" : "1d";
  
  const token = jwt.sign({ userID }, process.env.SESSIONSECRET, {
    expiresIn: expireInStr,
  });

  res.cookie("jwt", token, {
    maxAge: expireTime,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
}
export default generateToken;