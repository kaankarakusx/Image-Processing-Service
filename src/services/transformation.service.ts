import sharp from "sharp";

class TransformationService {
  public applyFormat(imageTransform: sharp.Sharp, format?: string) {
    switch (format) {
      case "png":
        imageTransform.png();
        break;
      case "webp":
        imageTransform.webp();
        break;
      case "jpeg":
      default:
        imageTransform.jpeg();
        break;
    }
  }

  public applyResize(
    imageTransform: sharp.Sharp,
    resize?: { width: number; height: number }
  ) {
    if (resize) {
      imageTransform.resize(resize.width, resize.height);
    }
  }

  public applyCrop(
    imageTransform: sharp.Sharp,
    crop?: { width: number; height: number; x: number; y: number }
  ) {
    if (crop) {
      imageTransform.extract({
        width: crop.width,
        height: crop.height,
        left: crop.x,
        top: crop.y,
      });
    }
  }

  public applyRotate(imageTransform: sharp.Sharp, rotate?: number) {
    if (rotate) {
      imageTransform.rotate(rotate);
    }
  }

  public applyFilters(
    imageTransform: sharp.Sharp,
    filters?: { grayscale?: boolean; sepia?: boolean }
  ) {
    if (filters?.grayscale) {
      imageTransform.grayscale();
    }
    if (filters?.sepia) {
      imageTransform.tint({ r: 112, g: 66, b: 20 });
    }
  }
}

export default new TransformationService();
