import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import { UploadedFile } from "express-fileupload";
import * as path from "path";

import { configs } from "../configs/config";

export enum EFileTypes {
  User = "user",
  Goods = "goods",
  Bought = "bought",
}

class S3Service {
  constructor(
    private s3Client = new S3Client({
      region: configs.AWS_REGION,
      credentials: {
        accessKeyId: configs.AWS_ACCESS_KEY,
        secretAccessKey: configs.AWS_SECRET_KEY,
      },
    }),
  ) {}

  public async uploadFile(
    file: UploadedFile,
    itemType: EFileTypes,
    itemId: string,
  ) {
    const filePath = this.buildPath(file.name, itemType, itemId);

    await this.s3Client.send(
      new PutObjectCommand({
        Key: filePath,
        Bucket: configs.AWS_BUCKED,
        Body: file.data,
        ContentType: file.mimetype,
        ACL: "public-read",
      }),
    );

    return filePath;
  }

  public async deleteFile(fileKey: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Key: fileKey,
        Bucket: configs.AWS_BUCKED,
      }),
    );
  }

  public buildPath(
    fileName: string,
    fileType: EFileTypes,
    fileId: string,
  ): string {
    return `${fileType}/${fileId}/${crypto.randomUUID()}${path.extname(
      fileName,
    )}`;
  }
}

export const s3Service = new S3Service();
