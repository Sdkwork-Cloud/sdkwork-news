import 'package:flutter/material.dart';
import 'package:sdkwork_news_flutter_mobile_commons/sdkwork_news_flutter_mobile_commons.dart';

import '../models/ai_store_entry.dart';

class AiStoreDetailPage extends StatelessWidget {
  const AiStoreDetailPage({
    super.key,
    required this.entry,
    required this.installed,
    required this.busy,
    required this.onBack,
    required this.onToggle,
    this.errorMessage,
  });

  final AiStoreEntry entry;
  final bool installed;
  final bool busy;
  final VoidCallback onBack;
  final VoidCallback onToggle;
  final String? errorMessage;

  @override
  Widget build(BuildContext context) {
    final strings = NewsStrings.of(context);
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) onBack();
      },
      child: SafeArea(
        bottom: false,
        child: Column(
          children: [
            Container(
              height: 58,
              padding: const EdgeInsets.symmetric(horizontal: 5),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                border: Border(
                  bottom: BorderSide(
                    color: Theme.of(context).colorScheme.outline,
                  ),
                ),
              ),
              child: Row(
                children: [
                  IconButton(
                    key: const ValueKey('store.detail.back'),
                    tooltip:
                        MaterialLocalizations.of(context).backButtonTooltip,
                    onPressed: onBack,
                    icon: const Icon(Icons.arrow_back_rounded),
                  ),
                  Expanded(
                    child: Text(
                      strings.text('store.detail'),
                      style: Theme.of(context)
                          .textTheme
                          .titleMedium
                          ?.copyWith(fontWeight: FontWeight.w800),
                    ),
                  ),
                  const SizedBox(width: 44),
                ],
              ),
            ),
            Expanded(
              child: ListView(
                key: ValueKey('store.detail.${entry.id}'),
                padding: const EdgeInsets.fromLTRB(16, 20, 16, 36),
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 70,
                        height: 70,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: Color(entry.colorValue),
                          borderRadius: BorderRadius.circular(7),
                        ),
                        child: Text(
                          entry.monogram,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 19,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Flexible(
                                  child: Text(
                                    entry.name,
                                    style: Theme.of(context)
                                        .textTheme
                                        .titleLarge
                                        ?.copyWith(
                                          fontWeight: FontWeight.w800,
                                        ),
                                  ),
                                ),
                                if (entry.verified) ...[
                                  const SizedBox(width: 5),
                                  const Icon(
                                    Icons.verified_rounded,
                                    color: NewsPalette.primary,
                                    size: 18,
                                  ),
                                ],
                              ],
                            ),
                            const SizedBox(height: 3),
                            Text(
                              entry.publisher,
                              style: const TextStyle(
                                color: NewsPalette.muted,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Wrap(
                              spacing: 10,
                              runSpacing: 6,
                              children: [
                                _Metadata(
                                  icon: Icons.category_outlined,
                                  label: strings.text(
                                    'store.kind.${entry.kind.name}',
                                  ),
                                ),
                                _Metadata(
                                  icon: Icons.layers_outlined,
                                  label: 'v${entry.version}',
                                ),
                                if (entry.rating != null)
                                  _Metadata(
                                    icon: Icons.star_rounded,
                                    label: '${entry.rating}',
                                  ),
                                if (entry.userCount != null)
                                  _Metadata(
                                    icon: Icons.download_outlined,
                                    label: entry.userCount!,
                                  ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text(
                    entry.description,
                    style: const TextStyle(fontSize: 15, height: 1.65),
                  ),
                  const SizedBox(height: 22),
                  if (entry.capabilities.isNotEmpty) ...[
                    Text(
                      strings.text('store.capabilities'),
                      style: Theme.of(context)
                          .textTheme
                          .titleMedium
                          ?.copyWith(fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.surface,
                        borderRadius: BorderRadius.circular(7),
                        border: Border.all(
                          color: Theme.of(context).colorScheme.outline,
                        ),
                      ),
                      child: Column(
                        children: entry.capabilities
                            .map(
                              (capability) => Padding(
                                padding:
                                    const EdgeInsets.symmetric(vertical: 7),
                                child: Row(
                                  children: [
                                    const Icon(
                                      Icons.check_circle_outline_rounded,
                                      size: 18,
                                      color: NewsPalette.primary,
                                    ),
                                    const SizedBox(width: 9),
                                    Expanded(child: Text(capability)),
                                  ],
                                ),
                              ),
                            )
                            .toList(growable: false),
                      ),
                    ),
                    const SizedBox(height: 22),
                  ],
                  if (errorMessage != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      color: NewsPalette.danger.withValues(alpha: 0.08),
                      child: Text(
                        strings.text('store.actionFailed'),
                        style: const TextStyle(color: NewsPalette.danger),
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],
                  if (!entry.installable)
                    Container(
                      padding: const EdgeInsets.all(13),
                      decoration: BoxDecoration(
                        color: NewsPalette.primarySoft,
                        borderRadius: BorderRadius.circular(7),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.info_outline_rounded,
                            color: NewsPalette.primary,
                          ),
                          const SizedBox(width: 9),
                          Expanded(
                            child: Text(
                              strings.text('store.installUnavailable'),
                            ),
                          ),
                        ],
                      ),
                    )
                  else if (installed)
                    OutlinedButton.icon(
                      key: const ValueKey('store.detail.uninstall'),
                      onPressed: busy ? null : onToggle,
                      icon: busy
                          ? const SizedBox.square(
                              dimension: 16,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Icon(Icons.delete_outline_rounded),
                      label: Text(strings.text('store.uninstall')),
                    )
                  else
                    FilledButton.icon(
                      key: const ValueKey('store.detail.install'),
                      onPressed: busy ? null : onToggle,
                      icon: busy
                          ? const SizedBox.square(
                              dimension: 16,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Icon(Icons.download_rounded),
                      label: Text(strings.text('store.install')),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Metadata extends StatelessWidget {
  const _Metadata({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) => Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: NewsPalette.muted),
          const SizedBox(width: 3),
          Text(
            label,
            style: const TextStyle(color: NewsPalette.muted, fontSize: 11),
          ),
        ],
      );
}
