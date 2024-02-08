import { FilterQuery, UpdateQuery } from "mongoose";

import { User } from "../models/User.model";
import { IUser, IUserCredentialsForSeller } from "../types/user.type";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    return await User.find();
  }

  public async Delete(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  }
  public async updateName(
    id: string,
    newUser: UpdateQuery<Partial<IUser>>,
  ): Promise<IUser> {
    console.log(newUser);

    return await User.findByIdAndUpdate(id, newUser, {
      returnDocument: "after",
    });
  }
  public async findByName(name: string): Promise<any> {
    const user = await User.find({ name: name });

    return user;
  }

  public async findByID(id: FilterQuery<IUser>): Promise<IUser> {
    const user = await User.findOne({ _id: id });

    return user;
  }

  public async register(dto: IUserCredentialsForSeller): Promise<IUser> {
    return await User.create(dto);
  }
}

export const userRepository = new UserRepository();
