import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/service/user.service';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/user/repository/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyEmailToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const user = await this.userRepository.findById(payload.sub);

      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      if (user.isEmailVerified) {
        return { message: 'El correo ya ha sido verificado.' };
      }

      user.isEmailVerified = true;
      await this.userRepository.save(user);

      return { message: 'Correo verificado correctamente' };
    } catch (error) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }
}
