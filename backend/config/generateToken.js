import jwt from 'jsonwebtoken';

const generateToken = (res, userID, expireTime = 365 * 24 * 60 * 60 * 1000) => {
  // console.log(userID);
  const expireInStr = expireTime > 90000000 ? "365d" : "1d";
  const guest = expireTime < 90000000;
  
  const token = jwt.sign({ userID, guest }, process.env.SESSIONSECRET, {
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