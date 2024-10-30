import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { db } from "../config/db";
import ImageModel from "./image.model";

interface UserModel
  extends Model<
    InferAttributes<UserModel>,
    InferCreationAttributes<UserModel>
  > {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  id: CreationOptional<number>;
  email: string;
  password?: string;
}

const UserModel = db.define<UserModel>(
  "User",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    hooks: {
      afterCreate: (user) => {
        if (user.password) {
          delete user.dataValues.password;
        }
      },
    },
  }
);

UserModel.hasMany(ImageModel, {
  foreignKey: "userId",
  as: "images",
});
ImageModel.belongsTo(UserModel, {
  foreignKey: "userId",
  as: "user",
});

export default UserModel;
