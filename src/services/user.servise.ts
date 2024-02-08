import fileUpload from "express-fileupload";
import { Types } from "mongoose";

import { User } from "../models/User.model";
import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/user.type";
import { EFileTypes, s3Service } from "./s3.service";

class UserService {
  public async getAll(): Promise<IUser[]> {
    const users = await userRepository.getAll();

    return users;
  }

  public async deleteUser(id: string): Promise<void> {
    await userRepository.Delete(id);
  }
  public async updateUser(id: string, user: any, file?: any): Promise<IUser> {
    const checkUser = await userRepository.findByID({ _id: id });

    console.log(file);

    if (checkUser.avatar) {
      await s3Service.deleteFile(checkUser.avatar);
    }

    const filePath = await s3Service.uploadFile(file, EFileTypes.User, id);

    console.log(filePath);

    return await userRepository.updateName(id, { ...user, avatar: filePath });
  }
  public async findUser(name: string): Promise<any> {
    return await userRepository.findByName(name);
  }

  public async uploadAvatar(
    avatar: fileUpload.UploadedFile,
    userId: Types.ObjectId,
  ): Promise<IUser> {
    const checkUser = await userRepository.findByID(userId);
    if (checkUser.avatar) {
      await s3Service.deleteFile(checkUser.avatar);
    }
    const filePath = await s3Service.uploadFile(
      avatar,
      EFileTypes.User,
      userId.toString(),
    );
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: filePath },
      {
        returnDocument: "after",
      },
    );

    return user;
  }
}

export const userService = new UserService();
