import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  // Map userId -> socketId for online presence
  private onlineUsers = new Map<string, string>();

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query?.userId as string;
    if (userId) {
      this.onlineUsers.set(userId, client.id);
      this.server.emit('userOnline', { userId });
      this.logger.log(`User ${userId} connected (${client.id})`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.onlineUsers.entries()) {
      if (socketId === client.id) {
        this.onlineUsers.delete(userId);
        this.server.emit('userOffline', { userId });
        this.logger.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  @SubscribeMessage('joinRoom')
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

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() payload: { matchId: string; userId: string; isTyping: boolean },
  ) {
    // Broadcast to everyone in the room except sender
    this.server.to(payload.matchId).emit('typing', {
      userId: payload.userId,
      isTyping: payload.isTyping,
    });
  }

  @SubscribeMessage('markRead')
  async handleMarkRead(
    @MessageBody() payload: { matchId: string; userId: string },
  ) {
    await this.chatService.markMessagesRead(payload.matchId, payload.userId);
    this.server.to(payload.matchId).emit('messagesRead', { userId: payload.userId });
  }

  // ─── WebRTC Signaling ───────────────────────────────────────────────────────

  @SubscribeMessage('callOffer')
  handleCallOffer(
    @MessageBody() payload: { matchId: string; callerId: string; offer: RTCSessionDescriptionInit; callType: 'audio' | 'video' },
  ) {
    this.server.to(payload.matchId).emit('callOffer', payload);
    this.logger.log(`Call offer from ${payload.callerId} in match ${payload.matchId}`);
  }

  @SubscribeMessage('callAnswer')
  handleCallAnswer(
    @MessageBody() payload: { matchId: string; answer: RTCSessionDescriptionInit },
  ) {
    this.server.to(payload.matchId).emit('callAnswer', payload);
  }

  @SubscribeMessage('iceCandidate')
  handleIceCandidate(
    @MessageBody() payload: { matchId: string; candidate: RTCIceCandidateInit },
  ) {
    this.server.to(payload.matchId).emit('iceCandidate', payload);
  }

  @SubscribeMessage('callEnd')
  handleCallEnd(@MessageBody() payload: { matchId: string; userId: string }) {
    this.server.to(payload.matchId).emit('callEnd', payload);
    this.logger.log(`Call ended in match ${payload.matchId}`);
  }
}
