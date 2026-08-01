import 'package:flutter/material.dart';
import 'package:sdkwork_news_flutter_mobile_commons/sdkwork_news_flutter_mobile_commons.dart';

import '../controllers/ai_store_controller.dart';
import '../models/ai_store_entry.dart';
import 'ai_store_detail_page.dart';

class AiStorePage extends StatefulWidget {
  const AiStorePage({
    super.key,
    required this.controller,
    this.onSecondaryPageChanged,
  });

  final AiStoreController controller;
  final ValueChanged<bool>? onSecondaryPageChanged;

  @override
  State<AiStorePage> createState() => _AiStorePageState();
}

class _AiStorePageState extends State<AiStorePage> {
  final _scrollController = ScrollController();
  AiStoreEntry? _selectedEntry;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_handleScroll);
    widget.controller.initialize();
  }

  void _handleScroll() {
    if (_scrollController.position.extentAfter < 240) {
      widget.controller.loadMore();
    }
  }

  void _openEntry(AiStoreEntry entry) {
    setState(() => _selectedEntry = entry);
    widget.onSecondaryPageChanged?.call(true);
  }

  void _closeEntry() {
    setState(() => _selectedEntry = null);
    widget.onSecondaryPageChanged?.call(false);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_handleScroll);
    _scrollController.dispose();
    widget.onSecondaryPageChanged?.call(false);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: widget.controller,
      builder: (context, _) {
        final strings = NewsStrings.of(context);
        if (_selectedEntry != null) {
          final entry = widget.controller.entries.firstWhere(
            (item) => item.id == _selectedEntry!.id,
            orElse: () => _selectedEntry!,
          );
          return AiStoreDetailPage(
            entry: entry,
            installed: widget.controller.installedIds.contains(entry.id),
            busy: widget.controller.busyIds.contains(entry.id),
            errorMessage: widget.controller.errorMessage,
            onBack: _closeEntry,
            onToggle: () => widget.controller.toggleInstalled(entry.id),
          );
        }
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
                      key: const ValueKey('store.search.open'),
                      tooltip:
                          MaterialLocalizations.of(context).searchFieldLabel,
                      onPressed: () => _showSearchSheet(context, strings),
                      icon: const Icon(Icons.search_rounded),
                    ),
                  ],
                ),
              ),
              _StoreTabs(controller: widget.controller, strings: strings),
              if (widget.controller.query != null)
                _StoreSearchContext(
                  query: widget.controller.query!,
                  strings: strings,
                  onClear: () => widget.controller.search(null),
                ),
              Expanded(
                child: ListView(
                  controller: _scrollController,
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
                    else if (widget.controller.errorMessage != null &&
                        widget.controller.entries.isEmpty)
                      _StoreLoadFailure(
                        message: strings.text('store.loadFailed'),
                        retryLabel: strings.text('common.retry'),
                        onRetry: widget.controller.retry,
                      )
                    else if (widget.controller.entries.isEmpty)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 38),
                        child: Center(
                          child: Text(strings.text('store.empty')),
                        ),
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
                          onOpen: () => _openEntry(entry),
                          strings: strings,
                        ),
                    if (widget.controller.isLoadingMore)
                      const Padding(
                        padding: EdgeInsets.all(16),
                        child: Center(
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
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

  Future<void> _showSearchSheet(
    BuildContext context,
    NewsStrings strings,
  ) async {
    final query = await showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (context) => _StoreSearchSheet(
        initialQuery: widget.controller.query ?? '',
        strings: strings,
      ),
    );
    if (query != null && mounted) {
      await widget.controller.search(query);
    }
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
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        border: Border(
          bottom: BorderSide(color: Theme.of(context).colorScheme.outline),
        ),
      ),
      child: SegmentedButton<AiStoreKind>(
        expandedInsets: EdgeInsets.zero,
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
    required this.onOpen,
    required this.strings,
  });

  final AiStoreEntry entry;
  final bool installed;
  final bool busy;
  final VoidCallback onToggle;
  final VoidCallback onOpen;
  final NewsStrings strings;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onOpen,
      child: Container(
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
                  if (entry.rating != null || entry.userCount != null)
                    Row(
                      children: [
                        if (entry.rating != null) ...[
                          const Icon(Icons.star_rounded,
                              size: 14, color: NewsPalette.warning),
                          Text('${entry.rating}',
                              style: const TextStyle(fontSize: 10)),
                        ],
                        if (entry.rating != null && entry.userCount != null)
                          const SizedBox(width: 12),
                        if (entry.userCount != null) ...[
                          const Icon(Icons.download_outlined,
                              size: 14, color: NewsPalette.muted),
                          Text(entry.userCount!,
                              style: const TextStyle(
                                  color: NewsPalette.muted, fontSize: 10)),
                        ],
                      ],
                    ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            if (!entry.installable)
              const SizedBox(
                width: 40,
                height: 40,
                child:
                    Icon(Icons.info_outline_rounded, color: NewsPalette.muted),
              )
            else if (installed)
              IconButton.filledTonal(
                tooltip: strings.text('store.uninstall'),
                onPressed: busy ? null : onToggle,
                icon: busy
                    ? const SizedBox.square(
                        dimension: 17,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.check_rounded),
              )
            else
              FilledButton(
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
      ),
    );
  }
}

class _StoreSearchContext extends StatelessWidget {
  const _StoreSearchContext({
    required this.query,
    required this.strings,
    required this.onClear,
  });

  final String query;
  final NewsStrings strings;
  final VoidCallback onClear;

  @override
  Widget build(BuildContext context) => Container(
        height: 42,
        padding: const EdgeInsets.only(left: 16, right: 6),
        color: NewsPalette.primarySoft,
        child: Row(
          children: [
            const Icon(Icons.search_rounded, size: 17),
            const SizedBox(width: 7),
            Expanded(
              child: Text(
                '“$query”',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            IconButton(
              key: const ValueKey('store.search.clear'),
              tooltip: strings.text('store.clearSearch'),
              onPressed: onClear,
              icon: const Icon(Icons.close_rounded),
            ),
          ],
        ),
      );
}

class _StoreSearchSheet extends StatefulWidget {
  const _StoreSearchSheet({
    required this.initialQuery,
    required this.strings,
  });

  final String initialQuery;
  final NewsStrings strings;

  @override
  State<_StoreSearchSheet> createState() => _StoreSearchSheetState();
}

class _StoreSearchSheetState extends State<_StoreSearchSheet> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialQuery);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Padding(
        padding: EdgeInsets.fromLTRB(
          16,
          16,
          16,
          MediaQuery.viewInsetsOf(context).bottom + 18,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              widget.strings.text('store.search'),
              style: Theme.of(context)
                  .textTheme
                  .titleMedium
                  ?.copyWith(fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 12),
            TextField(
              key: const ValueKey('store.search.input'),
              controller: _controller,
              autofocus: true,
              textInputAction: TextInputAction.search,
              onSubmitted: _submit,
              decoration: InputDecoration(
                hintText: widget.strings.text('store.searchHint'),
                prefixIcon: const Icon(Icons.search_rounded),
              ),
            ),
            const SizedBox(height: 12),
            FilledButton.icon(
              key: const ValueKey('store.search.submit'),
              onPressed: () => _submit(_controller.text),
              icon: const Icon(Icons.search_rounded),
              label: Text(widget.strings.text('store.searchAction')),
            ),
          ],
        ),
      );

  void _submit(String value) => Navigator.of(context).pop(value.trim());
}

class _StoreLoadFailure extends StatelessWidget {
  const _StoreLoadFailure({
    required this.message,
    required this.retryLabel,
    required this.onRetry,
  });

  final String message;
  final String retryLabel;
  final Future<void> Function() onRetry;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 38),
      child: Column(
        children: [
          const Icon(Icons.cloud_off_outlined, color: NewsPalette.muted),
          const SizedBox(height: 10),
          Text(message, textAlign: TextAlign.center),
          const SizedBox(height: 12),
          IconButton.filledTonal(
            tooltip: retryLabel,
            onPressed: onRetry,
            icon: const Icon(Icons.refresh_rounded),
          ),
        ],
      ),
    );
  }
}
