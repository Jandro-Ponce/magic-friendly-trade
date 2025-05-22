import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

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

  async createAndSave(user: Partial<User>): Promise<User> {
    const newUser = this.repository.create(user);
    return this.repository.save(newUser);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
