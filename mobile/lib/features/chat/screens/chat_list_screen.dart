import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import 'package:timeago/timeago.dart' as timeago;

class ConvoData {
  final String id, name, emoji, lastMsg;
  final bool online, verified;
  final int unread;
  final DateTime time;
  const ConvoData({required this.id, required this.name, required this.emoji, required this.lastMsg, required this.online, required this.verified, required this.unread, required this.time});
}

class ChatListScreen extends StatelessWidget {
  const ChatListScreen({super.key});

  static final _convos = [
    ConvoData(id: '1', name: 'Amina', emoji: '👩🏾', lastMsg: 'That sounds amazing! When are you free?', online: true, verified: true, unread: 2, time: DateTime.now().subtract(const Duration(minutes: 2))),
    ConvoData(id: '2', name: 'Grace', emoji: '👩🏿', lastMsg: 'Haha yes! Kisumu has the best fish 🐟', online: true, verified: true, unread: 0, time: DateTime.now().subtract(const Duration(minutes: 15))),
    ConvoData(id: '3', name: 'Fatuma', emoji: '👩🏾', lastMsg: 'I loved your photos! Very creative ✨', online: false, verified: true, unread: 1, time: DateTime.now().subtract(const Duration(hours: 1))),
    ConvoData(id: '4', name: 'Kevin', emoji: '👨🏽', lastMsg: 'Are you into hiking? Ngong Hills is great', online: true, verified: false, unread: 0, time: DateTime.now().subtract(const Duration(hours: 3))),
    ConvoData(id: '5', name: 'Cynthia', emoji: '👩🏽', lastMsg: 'Thank you for the gift! 🌹', online: false, verified: true, unread: 0, time: DateTime.now().subtract(const Duration(days: 1))),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPrimary,
      appBar: AppBar(
        backgroundColor: AppColors.bgPrimary,
        title: const Text('Messages', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 22)),
        actions: [IconButton(icon: const Icon(Icons.edit_rounded, color: Colors.white), onPressed: () {})],
      ),
      body: Column(children: [
        // Search
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
          child: TextField(
            style: const TextStyle(color: Colors.white),
            decoration: const InputDecoration(
              hintText: 'Search conversations...',
              prefixIcon: Icon(Icons.search_rounded, color: AppColors.textMuted),
            ),
          ),
        ),

        // Match requests banner
        Container(
          margin: const EdgeInsets.fromLTRB(20, 0, 20, 16),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            gradient: AppColors.gradientPrimary,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(children: [
            const Text('💘', style: TextStyle(fontSize: 24)),
            const SizedBox(width: 12),
            const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('3 New Matches!', style: TextStyle(fontWeight: FontWeight.w800, color: Colors.white, fontSize: 15)),
              Text('Say hello before they forget you', style: TextStyle(color: Colors.white70, fontSize: 12)),
            ])),
            const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white70, size: 14),
          ]),
        ),

        // Conversations
        Expanded(
          child: ListView.separated(
            itemCount: _convos.length,
            separatorBuilder: (_, __) => const Divider(height: 1, color: Color(0x0AFFFFFF), indent: 84),
            itemBuilder: (context, i) => _ConvoTile(convo: _convos[i]),
          ),
        ),
      ]),
    );
  }
}

class _ConvoTile extends StatelessWidget {
  final ConvoData convo;
  const _ConvoTile({required this.convo});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: () => context.go('/chat/${convo.id}'),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      leading: Stack(children: [
        Container(
          width: 54, height: 54,
          decoration: BoxDecoration(shape: BoxShape.circle, color: AppColors.bgCard),
          child: Center(child: Text(convo.emoji, style: const TextStyle(fontSize: 28))),
        ),
        if (convo.online) Positioned(bottom: 1, right: 1, child: Container(
          width: 14, height: 14,
          decoration: BoxDecoration(color: AppColors.success, shape: BoxShape.circle,
            border: Border.all(color: AppColors.bgPrimary, width: 2)),
        )),
      ]),
      title: Row(children: [
        Text(convo.name, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
        if (convo.verified) ...[
          const SizedBox(width: 4),
          const Icon(Icons.verified_rounded, color: AppColors.success, size: 14),
        ],
        const Spacer(),
        Text(timeago.format(convo.time, locale: 'en_short'),
          style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
      ]),
      subtitle: Row(children: [
        Expanded(child: Text(convo.lastMsg,
          style: TextStyle(color: convo.unread > 0 ? AppColors.textSecondary : AppColors.textMuted, fontSize: 13),
          maxLines: 1, overflow: TextOverflow.ellipsis)),
        if (convo.unread > 0) Container(
          width: 20, height: 20,
          decoration: const BoxDecoration(gradient: AppColors.gradientPrimary, shape: BoxShape.circle),
          child: Center(child: Text('${convo.unread}', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700))),
        ),
      ]),
    );
  }
}
