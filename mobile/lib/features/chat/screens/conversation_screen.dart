import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class _Message {
  final String text, from;
  final DateTime time;
  _Message({required this.text, required this.from, required this.time});
}

class ConversationScreen extends StatefulWidget {
  final String userId;
  const ConversationScreen({super.key, required this.userId});
  @override
  State<ConversationScreen> createState() => _ConversationScreenState();
}

class _ConversationScreenState extends State<ConversationScreen> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  bool _translateMode = false;
  bool _showQuick = false;

  final _quickMsgs = ['👋 Hey there!', '😊 You seem interesting!', '☕ Coffee sometime?', '🌟 Love your profile!'];

  final _messages = [
    _Message(text: "Hey! I saw your profile and I love that you're into travel too! 😊", from: 'them', time: DateTime.now().subtract(const Duration(minutes: 15))),
    _Message(text: "Hi Amina! Yes, I've been to 12 countries so far 🌍", from: 'me', time: DateTime.now().subtract(const Duration(minutes: 13))),
    _Message(text: "Oh wow! Mine has to be Zanzibar — the beaches there are just 😍", from: 'them', time: DateTime.now().subtract(const Duration(minutes: 10))),
    _Message(text: "Zanzibar is incredible! Stone Town is just magical", from: 'me', time: DateTime.now().subtract(const Duration(minutes: 8))),
    _Message(text: "We should plan a trip there together sometime 😄", from: 'them', time: DateTime.now().subtract(const Duration(minutes: 5))),
  ];

  void _sendMessage() {
    if (_controller.text.trim().isEmpty) return;
    setState(() {
      _messages.add(_Message(text: _controller.text.trim(), from: 'me', time: DateTime.now()));
      _controller.clear();
      _showQuick = false;
    });
    Future.delayed(const Duration(milliseconds: 100), () {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300), curve: Curves.easeOut,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPrimary,
      appBar: AppBar(
        backgroundColor: AppColors.bgSurface,
        titleSpacing: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back_rounded, color: Colors.white), onPressed: () => Navigator.pop(context)),
        title: Row(children: [
          Stack(children: [
            Container(width: 40, height: 40, decoration: const BoxDecoration(shape: BoxShape.circle, color: AppColors.bgCard),
              child: const Center(child: Text('👩🏾', style: TextStyle(fontSize: 22)))),
            Positioned(bottom: 0, right: 0, child: Container(width: 12, height: 12,
              decoration: BoxDecoration(color: AppColors.success, shape: BoxShape.circle, border: Border.all(color: AppColors.bgSurface, width: 2)))),
          ]),
          const SizedBox(width: 10),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              const Text('Amina', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
              const SizedBox(width: 4),
              const Icon(Icons.verified_rounded, color: AppColors.success, size: 14),
            ]),
            const Text('Online now', style: TextStyle(color: AppColors.success, fontSize: 11)),
          ]),
        ]),
        actions: [
          IconButton(
            icon: Icon(Icons.g_translate_rounded, color: _translateMode ? AppColors.accentPrimary : Colors.white),
            onPressed: () => setState(() => _translateMode = !_translateMode),
            tooltip: 'Translate',
          ),
          IconButton(icon: const Icon(Icons.call_rounded, color: Colors.white), onPressed: () {}),
          IconButton(icon: const Icon(Icons.videocam_rounded, color: Colors.white), onPressed: () {}),
          IconButton(icon: const Icon(Icons.more_vert_rounded, color: Colors.white), onPressed: () {}),
        ],
      ),
      body: Column(children: [
        // Translate bar
        if (_translateMode) Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          color: AppColors.accentPrimary.withOpacity(0.08),
          child: Row(children: [
            const Icon(Icons.g_translate_rounded, color: AppColors.accentPrimary, size: 16),
            const SizedBox(width: 8),
            const Text('Auto-translating: ', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
            _langChip('Swahili'), const Text(' → ', style: TextStyle(color: AppColors.textMuted)),
            _langChip('English'),
            const Spacer(),
            GestureDetector(onTap: () {}, child: const Text('Original', style: TextStyle(color: AppColors.accentSecondary, fontSize: 12, fontWeight: FontWeight.w600))),
          ]),
        ),

        // Messages
        Expanded(
          child: ListView.builder(
            controller: _scrollController,
            padding: const EdgeInsets.all(20),
            itemCount: _messages.length,
            itemBuilder: (context, i) {
              final msg = _messages[i];
              final isMe = msg.from == 'me';
              return Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: Row(
                  mainAxisAlignment: isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    if (!isMe) ...[
                      const CircleAvatar(radius: 16, backgroundColor: AppColors.bgCard,
                        child: Text('👩🏾', style: TextStyle(fontSize: 18))),
                      const SizedBox(width: 8),
                    ],
                    Column(crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                      children: [
                        Container(
                          constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.65),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          decoration: BoxDecoration(
                            gradient: isMe ? AppColors.gradientPrimary : null,
                            color: isMe ? null : AppColors.bgSurface,
                            borderRadius: BorderRadius.only(
                              topLeft: const Radius.circular(20),
                              topRight: const Radius.circular(20),
                              bottomLeft: Radius.circular(isMe ? 20 : 4),
                              bottomRight: Radius.circular(isMe ? 4 : 20),
                            ),
                          ),
                          child: Text(msg.text, style: TextStyle(
                            color: isMe ? Colors.white : AppColors.textPrimary,
                            fontSize: 14, height: 1.5,
                          )),
                        ),
                        const SizedBox(height: 4),
                        Text(isMe ? '${_fmtTime(msg.time)} ✓✓' : _fmtTime(msg.time),
                          style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ),

        // Quick messages
        if (_showQuick) Container(
          height: 50,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: _quickMsgs.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (context, i) => GestureDetector(
              onTap: () { setState(() { _controller.text = _quickMsgs[i]; _showQuick = false; }); },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.accentPrimary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(50),
                  border: Border.all(color: AppColors.accentPrimary.withOpacity(0.3)),
                ),
                child: Text(_quickMsgs[i], style: const TextStyle(fontSize: 13, color: AppColors.accentSecondary, fontWeight: FontWeight.w500)),
              ),
            ),
          ),
        ),

        // Input
        Container(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 16),
          decoration: BoxDecoration(
            color: AppColors.bgSurface,
            border: const Border(top: BorderSide(color: Color(0x14FFFFFF))),
          ),
          child: Row(children: [
            IconButton(
              icon: const Text('😊', style: TextStyle(fontSize: 20)),
              onPressed: () => setState(() => _showQuick = !_showQuick),
              padding: EdgeInsets.zero, constraints: const BoxConstraints(),
            ),
            const SizedBox(width: 8),
            IconButton(
              icon: const Text('🎁', style: TextStyle(fontSize: 20)),
              onPressed: () {},
              padding: EdgeInsets.zero, constraints: const BoxConstraints(),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                controller: _controller,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'Type a message...',
                  filled: true, fillColor: AppColors.bgCard,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  suffixIcon: IconButton(icon: const Icon(Icons.mic_rounded, color: AppColors.textMuted, size: 20), onPressed: () {}),
                ),
                maxLines: null,
                onSubmitted: (_) => _sendMessage(),
              ),
            ),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: _sendMessage,
              child: Container(
                width: 44, height: 44,
                decoration: const BoxDecoration(gradient: AppColors.gradientPrimary, shape: BoxShape.circle),
                child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
              ),
            ),
          ]),
        ),
      ]),
    );
  }

  Widget _langChip(String label) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
    decoration: BoxDecoration(gradient: AppColors.gradientPrimary, borderRadius: BorderRadius.circular(50)),
    child: Text(label, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700)),
  );

  String _fmtTime(DateTime t) => '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';
}
