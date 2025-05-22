import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {

    return this.repository.find();
  }

  async findById(id: number): Promise<User | null> {

    return this.repository.findOneBy({ id });
  }

  async createAndSave(userData: CreateUserDto): Promise<User> {
  const newUser = this.repository.create(userData);
  
  return this.repository.save(newUser);
}

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
