import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';
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
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado. Por favor, usa otro.');
    }
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userWithHashedPassword = {
      ...userData,
      password: hashedPassword,
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
    const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Bienvenido a MagicTrade - Verifica tu cuenta',
      html: `
        <h1>Bienvenido, ${user.firstName}!</h1>
        <p>Gracias por registrarte en MagicTrade.</p>
        <p>Por favor, verifica tu correo haciendo clic en el siguiente enlace:</p>
        <a href="${verificationLink}">Verificar cuenta</a>
        <p>Este enlace caduca en 1 hora.</p>
      `,
    });
    return user;
  }

  delete(id: number): Promise<void> {
    return this.userRepository.remove(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
