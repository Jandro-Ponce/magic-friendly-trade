import {
  Controller,
  Get,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/service/user.service';
import { GetUserProfileResponse } from 'src/user/controller/response/get-user-profile.response';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get("user/:id/profile")
  async getProfile(@Param() params): Promise<GetUserProfileResponse> {
    const user = await this.userService.findById(params.id);
    return GetUserProfileResponse.create(user);
  }
}
