import 'package:flutter/widgets.dart';

import 'app.dart';
import 'bootstrap/runtime.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final runtime = await bootstrapNewsRuntime();
  runApp(NewsApp(runtime: runtime));
}
