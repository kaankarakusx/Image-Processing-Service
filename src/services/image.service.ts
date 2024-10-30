import path from "path";
import ImageModel from "../models/image.model";
import { NotFoundError } from "../utils/errors";
import sharp from "sharp";
import { ITransformations } from "../interfaces/ITransformations";
import transformationService from "./transformation.service";
import S3Service from "./aws/s3";
import fs from "fs";
import s3 from "./aws/s3";
import cacheService from "./cache.service";

class ImageService {
  private imageUrl;
  public transformationService = transformationService;

  constructor() {
    this.imageUrl = process.env.UPLOAD_IMAGE_URL;
  }

  async uploadImage(
    file: Express.Multer.File,
    metadata: string,
    userId: number
  ) {
    // TODO : resim type kontrolü yapılacak
    const fileName = `${new Date().getTime()}`;

    const fileBuffer = file.buffer;
    const url = await S3Service.uploadFile(fileBuffer, fileName);

    const image = await ImageModel.create({ url, metadata, userId });

    await cacheService.del(`images:${userId}:1:10`);

    return image;
  }

  async transformImage(
    id: number,
    transformations: ITransformations,
    userId: number
  ) {
    const image = await ImageModel.findOne({ where: { id, userId } });

    if (!image) {
      throw new NotFoundError("Image not found");
    }

    const originalImage = await S3Service.getFile(this.getUrl(image.url));
    const imageTransform = sharp(originalImage);

    await this.applyTransformations(imageTransform, transformations);

    const date = new Date().getTime();
    const outputPath = path.join(__dirname, `../uploads/${date}.jpg`);
    await imageTransform.toFile(outputPath);

    const fileBuffer = fs.readFileSync(outputPath);
    console.log("fileBuffer", fileBuffer);

    const uploadBucket = await S3Service.uploadFile(fileBuffer, `${date}.jpg`);

    fs.unlinkSync(outputPath);

    await s3.deleteFile(this.getUrl(image.url));

    const callback = await ImageModel.update(
      { url: uploadBucket },
      { where: { id } }
    );

    return callback;
  }

  async getImage(id: number, userId: number) {
    const image = await ImageModel.findOne({ where: { id, userId } });

    if (!image) {
      throw new NotFoundError("Image not found");
    }

    return image;
  }

  async getImages(page: number, limit: number, userId: number) {
    console.log("page", page);
    page = isNaN(page) ? 1 : page;
    limit = isNaN(limit) ? 10 : limit;

    const cacheKey = `images:${userId}:${page}:${limit}`;
    const cachedImages = await cacheService.get(cacheKey);

    if (cachedImages) {
      return cachedImages;
    }
    const { count, rows: images } = await ImageModel.findAndCountAll({
      where: { userId },
      limit,
      offset: (page - 1) * limit,
      order: [["createdAt", "DESC"]],
    });

    await cacheService.set(cacheKey, {
      data: images,
      meta: {
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        totalCount: count,
      },
    });

    return {
      data: images,
      meta: {
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        totalCount: count,
      },
    };
  }

  private async applyTransformations(
    imageTransform: sharp.Sharp,
    transformations: ITransformations
  ) {
    this.transformationService.applyFormat(
      imageTransform,
      transformations.format
    );
    console.log(transformations.resize);
    this.transformationService.applyResize(
      imageTransform,
      transformations.resize
    );
    this.transformationService.applyCrop(imageTransform, transformations.crop);
    this.transformationService.applyRotate(
      imageTransform,
      transformations.rotate
    );
    this.transformationService.applyFilters(
      imageTransform,
      transformations.filters
    );

    return imageTransform;
  }

  private getUrl(url: string) {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
  }
}

export default new ImageService();
