import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConversationService } from '../service/conversation.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { CreateConversationDto } from '../dto/create-conversation.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('conversations')
export class ConversationController {
  constructor(private readonly service: ConversationService) {}

  @Get()
  findAll(@Request() req) {
    return this.service.findConversations(req.user.userId);
  }

  @Post()
  create(
    @Request() req,
    @Body() dto: CreateConversationDto,
  ) {
    return this.service.findOrCreateConversation(req.user.userId, dto.userId);
  }

  @Get(':id/messages')
  findMessages(
    @Request() req,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.getMessages(req.user.userId, id);
  }

  @Post(':id/messages')
  sendMessage(
    @Request() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.service.sendMessage(req.user.userId, id, dto.content);
  }
}
