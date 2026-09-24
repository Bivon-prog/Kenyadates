import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('joinMatch')
  handleJoinRoom(@MessageBody('matchId') matchId: string, @ConnectedSocket() client: Socket) {
    client.join(matchId);
    return { status: 'joined', matchId };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() payload: { matchId: string; senderId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.createMessage(
      payload.matchId,
      payload.senderId,
      payload.content,
    );
    this.server.to(payload.matchId).emit('newMessage', message);
    return message;
  }
}
