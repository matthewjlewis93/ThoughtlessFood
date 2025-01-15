import jwt from 'jsonwebtoken';

const generateToken = (res, userID) => {
    const token = jwt.sign({ userID }, process.env.SESSIONSECRET, {
      expiresIn: "365d",
    });

    res.cookie('jwt', token, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true
    })
}

export default generateToken;