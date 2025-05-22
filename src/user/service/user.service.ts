import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  findById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  create(userData: CreateUserDto): Promise<User> {
    return this.userRepository.createAndSave(userData);
  }

  delete(id: number): Promise<void> {
    return this.userRepository.remove(id);
  }
}
