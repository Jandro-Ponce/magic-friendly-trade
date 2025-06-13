import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { UserService } from 'src/user/service/user.service';
import { GetUserProfileResponse } from 'src/user/controller/response/get-user-profile.response';


@UseGuards(AuthGuard('jwt'))
@Controller()
export class MyProfileController {
  constructor(private readonly userService: UserService) {}

  @Get('me/profile')
  async getProfile(@Request() req): Promise<GetUserProfileResponse> {
    const userId = req.user.userId;
    const user = await this.userService.findById(userId);
    return GetUserProfileResponse.create(user);
  }

  @Post('me/profile/upload-avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const ext = file.originalname.split('.').pop();
          const filename = `${uuid()}.${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/avatars/${file.filename}` };
  }
}
