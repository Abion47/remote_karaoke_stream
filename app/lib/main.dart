import 'dart:io';

import 'package:flutter/material.dart';
import 'package:remote_karaoke_stream/services/microphone.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  print(Directory.current);

  final service = MicrophoneService();
  service.initialize();

  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text('Hello World!'),
        ),
      ),
    );
  }
}
