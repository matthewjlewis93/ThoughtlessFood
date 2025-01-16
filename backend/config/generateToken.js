import jwt from 'jsonwebtoken';

const generateToken = (res, userID) => {
    const token = jwt.sign({ userID }, process.env.SESSIONSECRET, {
      expiresIn: "365d",
    });

    res.cookie('jwt', token, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });

    // res.cookie('id', userID, {
    //     maxAge: 365 * 24 * 60 * 60 * 1000,
    //     httpOnly: false,
    //     secure: false,
    //     sameSite: "strict"
    // }
  }

export default generateToken;