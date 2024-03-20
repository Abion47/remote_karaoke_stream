import 'package:flutter/foundation.dart';
import 'package:record/record.dart';

class MicrophoneService {
  AudioRecorder recorder;
  late InputDevice inputDevice;

  MicrophoneService() : recorder = AudioRecorder();

  Future<void> initialize() async {
    final devices = await listDevices();
    debugPrint(devices.toString());

    inputDevice = devices.first;
  }

  Future<List<InputDevice>> listDevices() async {
    return await recorder.listInputDevices();
  }

  void useDevice(InputDevice device) {
    inputDevice = device;
  }

  start() async {
    final config = RecordConfig(
      numChannels: 1,
      device: inputDevice,
    );

    final stream = await recorder.startStream(config);
    stream.listen(_onSamples);
  }

  stop() async {
    if (!(await recorder.isRecording())) return;
    await recorder.stop();
  }

  void _onSamples(samples) {}
}
