import { Module } from '@nestjs/common';
import { ProfileController } from './controller/profile.controller';
import { UserModule } from 'src/user/user.module';
import { MyProfileController } from './controller/my-profile.controller';

@Module({
  imports: [UserModule],
  controllers: [ProfileController, MyProfileController],
})
export class ProfileModule {}
