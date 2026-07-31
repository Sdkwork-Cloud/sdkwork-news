import 'package:flutter/material.dart';

class AgentAvatar extends StatelessWidget {
  const AgentAvatar({
    super.key,
    required this.initial,
    required this.color,
    this.size = 44,
  });

  final String initial;
  final Color color;
  final double size;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      image: true,
      label: initial,
      child: Container(
        width: size,
        height: size,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(7),
        ),
        child: Text(
          initial,
          style: TextStyle(
            color: Colors.white,
            fontSize: size * 0.34,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
}
