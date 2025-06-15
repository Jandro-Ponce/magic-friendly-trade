import { Controller, Post, Body, Get, Query, BadRequestException, UnauthorizedException, Redirect } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Debes verificar tu correo electrónico para acceder');
    }
    return this.authService.login(user);
  }

  @Get('verify-email')
  @Redirect()
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token no proporcionado');
    }

    const user = await this.authService.verifyEmailToken(token);
    const { access_token } = await this.authService.login(user);

    return {
      url:
        this.configService.get('FRONTEND_URL') +
        `/dashboard?token=${access_token}`,
    };
  }
}
