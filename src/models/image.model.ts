import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { db } from "../config/db";

interface ImageModel
  extends Model<
    InferAttributes<ImageModel>,
    InferCreationAttributes<ImageModel>
  > {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  id: CreationOptional<number>;
  url: string;
}

const ImageModel = db.define<ImageModel>("Image", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  url: {
    type: DataTypes.STRING,
  },
});

export default ImageModel;
