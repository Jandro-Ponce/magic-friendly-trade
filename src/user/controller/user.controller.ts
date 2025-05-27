import { Controller, Post, Get, Body, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUserProfileResponse } from './response/get-user-profile.response';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        const filename = `${uuid()}.${ext}`;
        cb(null, filename);
      },
    }),
  }))
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/avatars/${file.filename}` };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Request() req) {
    const userId = req.user.userId;
    const user = await this.userService.findById(userId);
    return GetUserProfileResponse.create(user);
  }
}
