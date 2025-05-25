import { Controller, Post, Body, Get, Query, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token no proporcionado');
    }

    return this.authService.verifyEmailToken(token);
  }
}
