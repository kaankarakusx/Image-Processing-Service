import jwt from "jsonwebtoken";

class JWTUtils {
  async generateAccessToken(payload: object): Promise<string> {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "15d",
    });
  }

  async verifyAccessToken(token: string): Promise<object | string> {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
  }
}

export default new JWTUtils();
