import { configs } from "../configs/config";
import { IUser } from "../types/user.type";

interface IPresenter<I, O> {
  present(payload: I): O;
}

class UserPresenter implements IPresenter<IUser, Partial<IUser>> {
  present(data: IUser): Partial<IUser> {
    return {
      _id: data._id,
      name: data.name,
      age: data.age,
      email: data.email,
      rights: data.rights,
      city: data.city,
      userPremiumRights: data.userPremiumRights,
      last_Visited: data.last_Visited,
      confirmedRegistration: data.confirmedRegistration,
      avatar: data?.avatar ? `${configs.AWS_S3_URL}/${data.avatar}` : null,
    };
  }
}

export const userPresenter = new UserPresenter();
