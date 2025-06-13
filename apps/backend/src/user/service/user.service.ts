import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { User, Role } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/services/mail.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async create(userData: CreateUserDto): Promise<User> {
    const email = userData.email.toLowerCase()
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado. Por favor, usa otro.');
    }
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userWithHashedPassword = {
      ...userData,
      password: hashedPassword,
      role: Role.USER,
    };

    const user = await this.userRepository.createAndSave(userWithHashedPassword);
      
    const token = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1h',
      },
    );
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const verificationLink = `${frontendUrl}/auth/verify-email?token=${token}`;

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Bienvenido a MagicTrade - Verifica tu cuenta',
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h1 style="color: #4CAF50;">Bienvenido, ${user.firstName}!</h1>
          <p>Gracias por registrarte en <strong>MagicTrade</strong> 🎉</p>
          <p>Por favor, verifica tu correo haciendo clic en el siguiente enlace:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            ✅ Verificar cuenta ✅
          </a>
          <p style="margin-top: 20px;">Este enlace caduca en 1 hora.</p>
      </div>
      `,
    });
    return user;
  }

  delete(id: string): Promise<void> {
    return this.userRepository.remove(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
