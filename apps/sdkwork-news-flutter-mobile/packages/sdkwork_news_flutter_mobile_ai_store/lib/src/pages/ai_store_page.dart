import 'package:flutter/material.dart';
import 'package:sdkwork_news_flutter_mobile_commons/sdkwork_news_flutter_mobile_commons.dart';

import '../controllers/ai_store_controller.dart';
import '../models/ai_store_entry.dart';

class AiStorePage extends StatefulWidget {
  const AiStorePage({super.key, required this.controller});

  final AiStoreController controller;

  @override
  State<AiStorePage> createState() => _AiStorePageState();
}

class _AiStorePageState extends State<AiStorePage> {
  @override
  void initState() {
    super.initState();
    widget.controller.initialize();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: widget.controller,
      builder: (context, _) {
        final strings = NewsStrings.of(context);
        return SafeArea(
          bottom: false,
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 14, 8, 12),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            strings.text('store.title'),
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall
                                ?.copyWith(fontWeight: FontWeight.w800),
                          ),
                          Text(
                            strings.text('store.subtitle'),
                            style: Theme.of(context)
                                .textTheme
                                .bodySmall
                                ?.copyWith(color: NewsPalette.muted),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      tooltip:
                          MaterialLocalizations.of(context).searchFieldLabel,
                      onPressed: () {},
                      icon: const Icon(Icons.search_rounded),
                    ),
                  ],
                ),
              ),
              _StoreTabs(controller: widget.controller, strings: strings),
              Expanded(
                child: ListView(
                  key: const PageStorageKey('ai-store'),
                  padding: const EdgeInsets.fromLTRB(14, 14, 14, 30),
                  children: [
                    _FeaturedStoreBand(strings: strings),
                    const SizedBox(height: 18),
                    Text(
                      strings.text('store.popular'),
                      style: Theme.of(context)
                          .textTheme
                          .titleMedium
                          ?.copyWith(fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 4),
                    if (widget.controller.isLoading &&
                        widget.controller.entries.isEmpty)
                      const Padding(
                        padding: EdgeInsets.all(32),
                        child: Center(child: CircularProgressIndicator()),
                      )
                    else
                      for (final entry in widget.controller.entries)
                        _StoreEntryRow(
                          entry: entry,
                          installed:
                              widget.controller.installedIds.contains(entry.id),
                          busy: widget.controller.busyIds.contains(entry.id),
                          onToggle: () =>
                              widget.controller.toggleInstalled(entry.id),
                          strings: strings,
                        ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _StoreTabs extends StatelessWidget {
  const _StoreTabs({required this.controller, required this.strings});

  final AiStoreController controller;
  final NewsStrings strings;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 52,
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: const BoxDecoration(
        color: NewsPalette.surface,
        border: Border(bottom: BorderSide(color: NewsPalette.line)),
      ),
      child: SegmentedButton<AiStoreKind>(
        showSelectedIcon: false,
        segments: [
          ButtonSegment(
            value: AiStoreKind.product,
            icon: const Icon(Icons.widgets_outlined, size: 17),
            label: Text(strings.text('store.products')),
          ),
          ButtonSegment(
            value: AiStoreKind.skill,
            icon: const Icon(Icons.build_outlined, size: 17),
            label: Text(strings.text('store.skills')),
          ),
          ButtonSegment(
            value: AiStoreKind.mcp,
            icon: const Icon(Icons.cable_rounded, size: 17),
            label: Text(strings.text('store.mcp')),
          ),
        ],
        selected: {controller.kind},
        onSelectionChanged: (selection) =>
            controller.selectKind(selection.single),
      ),
    );
  }
}

class _FeaturedStoreBand extends StatelessWidget {
  const _FeaturedStoreBand({required this.strings});

  final NewsStrings strings;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 150,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: NewsPalette.primaryDark,
        borderRadius: BorderRadius.circular(7),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Text(
            strings.text('store.featured'),
            style: const TextStyle(color: Color(0xFFA6DCCB), fontSize: 10),
          ),
          const SizedBox(height: 7),
          Text(
            strings.text('store.featureTitle'),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 19,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 5),
          Text(
            strings.text('store.featureSubtitle'),
            style: const TextStyle(color: Colors.white70, fontSize: 11),
          ),
        ],
      ),
    );
  }
}

class _StoreEntryRow extends StatelessWidget {
  const _StoreEntryRow({
    required this.entry,
    required this.installed,
    required this.busy,
    required this.onToggle,
    required this.strings,
  });

  final AiStoreEntry entry;
  final bool installed;
  final bool busy;
  final VoidCallback onToggle;
  final NewsStrings strings;

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minHeight: 120),
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: NewsPalette.line)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: Color(entry.colorValue),
              borderRadius: BorderRadius.circular(7),
            ),
            child: Text(
              entry.monogram,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 13,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
          const SizedBox(width: 11),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        entry.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                    if (entry.verified) ...[
                      const SizedBox(width: 4),
                      const Icon(Icons.verified_user_outlined,
                          size: 15, color: NewsPalette.primary),
                    ],
                  ],
                ),
                Text(entry.publisher,
                    style: const TextStyle(
                        color: NewsPalette.muted, fontSize: 10)),
                const SizedBox(height: 5),
                Text(entry.description,
                    style: const TextStyle(fontSize: 12, height: 1.4)),
                const SizedBox(height: 7),
                Row(
                  children: [
                    const Icon(Icons.star_rounded,
                        size: 14, color: NewsPalette.warning),
                    Text('${entry.rating}',
                        style: const TextStyle(fontSize: 10)),
                    const SizedBox(width: 12),
                    const Icon(Icons.download_outlined,
                        size: 14, color: NewsPalette.muted),
                    Text(entry.userCount,
                        style: const TextStyle(
                            color: NewsPalette.muted, fontSize: 10)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          installed
              ? IconButton.filledTonal(
                  tooltip: strings.text('store.installed'),
                  onPressed: busy ? null : onToggle,
                  icon: busy
                      ? const SizedBox.square(
                          dimension: 17,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Icon(Icons.check_rounded),
                )
              : FilledButton(
                  onPressed: busy ? null : onToggle,
                  style: FilledButton.styleFrom(
                    minimumSize: const Size(60, 38),
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                  ),
                  child: busy
                      ? const SizedBox.square(
                          dimension: 15,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : Text(
                          strings.text('store.install'),
                          style: const TextStyle(fontSize: 11),
                        ),
                ),
        ],
      ),
    );
  }
}
