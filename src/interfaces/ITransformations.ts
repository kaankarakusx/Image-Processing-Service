import sharp from "sharp";

export interface ITransformations {
  resize?: {
    width: number;
    height: number;
  };
  crop?: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  rotate?: number;
  format?: keyof sharp.FormatEnum;
  filters?: {
    grayscale?: boolean;
    sepia?: boolean;
  };
}
