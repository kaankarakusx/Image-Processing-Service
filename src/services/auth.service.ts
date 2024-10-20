import { randomBytes, scrypt as _scrypt } from "crypto";
import UserModel from "../models/user.model";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { promisify } from "util";
import jwtUtils from "../utils/jwtUtils";

const scrypt = promisify(_scrypt);

class AuthService {
  async login(email: string, password: string) {
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const [salt, storedHash] = user.password!.split(".");
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString("hex")) {
      throw new BadRequestError("Invalid password");
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = await jwtUtils.generateAccessToken(payload);

    return token;
  }
  async register(email: string, password: string) {
    const user = await UserModel.findOne({ where: { email } });

    if (user) {
      throw new BadRequestError("User already exists");
    }

    const salt = randomBytes(8).toString("hex");
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + "." + hash.toString("hex");

    const newUser = await UserModel.create({ email, password: result });

    const payload = {
      id: newUser.id,
      email: newUser.email,
    };

    const token = await jwtUtils.generateAccessToken(payload);

    return token;
  }
}

export default new AuthService();
