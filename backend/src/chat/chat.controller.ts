import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('matches')
  @ApiOperation({ summary: 'Get User Match List' })
  getUserMatches(@Req() req: any) {
    return this.chatService.getUserMatches(req.user.id);
  }

  @Get('messages/:matchId')
  @ApiOperation({ summary: 'Get Conversation Messages' })
  getMessages(@Param('matchId') matchId: string) {
    return this.chatService.getMessages(matchId);
  }
}
