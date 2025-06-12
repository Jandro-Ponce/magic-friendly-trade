import { User, Role } from '../../entity/user.entity';

export class GetUserProfileResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;

  static create(user: User): GetUserProfileResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
