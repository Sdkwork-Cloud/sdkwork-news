import 'package:flutter/material.dart';
import 'package:sdkwork_news_flutter_mobile_commons/sdkwork_news_flutter_mobile_commons.dart';

import '../controllers/account_controller.dart';
import '../models/account_profile.dart';

class AccountPage extends StatefulWidget {
  const AccountPage({
    super.key,
    required this.controller,
    this.locale = const Locale('zh', 'CN'),
    this.onLocaleChanged,
  });

  final AccountController controller;
  final Locale locale;
  final ValueChanged<Locale>? onLocaleChanged;

  @override
  State<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
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
        final profile = widget.controller.profile;
        return SafeArea(
          bottom: false,
          child: Column(
            children: [
              Container(
                height: 58,
                padding: const EdgeInsets.fromLTRB(16, 0, 8, 0),
                color: NewsPalette.surface,
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        strings.text('account.title'),
                        style: Theme.of(context)
                            .textTheme
                            .headlineSmall
                            ?.copyWith(fontWeight: FontWeight.w800),
                      ),
                    ),
                    IconButton(
                      key: const ValueKey('account.settings.open'),
                      tooltip: strings.text('account.settings'),
                      onPressed: widget.onLocaleChanged == null
                          ? null
                          : () => _showLanguagePicker(context, strings),
                      icon: const Icon(Icons.tune_rounded),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: profile == null
                    ? widget.controller.errorMessage == null
                        ? const Center(child: CircularProgressIndicator())
                        : _AccountLoadFailure(
                            message: strings.text('account.loadFailed'),
                            retryLabel: strings.text('common.retry'),
                            onRetry: widget.controller.retry,
                          )
                    : ListView(
                        key: const PageStorageKey('account'),
                        padding: const EdgeInsets.fromLTRB(12, 12, 12, 30),
                        children: [
                          _ProfileCard(profile: profile, strings: strings),
                          const SizedBox(height: 10),
                          if (profile.planProgress != null) ...[
                            _PlanCard(profile: profile, strings: strings),
                            const SizedBox(height: 10),
                            _SavedTimeCard(strings: strings),
                            const SizedBox(height: 10),
                          ],
                          _SettingsGroup(
                            title: strings.text('account.content'),
                            rows: [
                              _SettingsRowData(
                                icon: Icons.bookmark_border_rounded,
                                label: strings.text('account.favorites'),
                                value: _countLabel(
                                  profile.favoriteCount,
                                  strings,
                                ),
                              ),
                              _SettingsRowData(
                                icon: Icons.history_rounded,
                                label: strings.text('account.history'),
                                value: _countLabel(
                                  profile.historyCount,
                                  strings,
                                ),
                              ),
                              _SettingsRowData(
                                icon: Icons.download_outlined,
                                label: strings.text('account.offline'),
                                value: _countLabel(
                                  profile.offlineCount,
                                  strings,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          _SettingsGroup(
                            title: strings.text('account.settings'),
                            rows: [
                              _SettingsRowData(
                                icon: Icons.notifications_none_rounded,
                                label: strings.text('account.notifications'),
                                value:
                                    strings.text('account.notificationsValue'),
                              ),
                              _SettingsRowData(
                                icon: Icons.translate_rounded,
                                label: strings.text('account.language'),
                                value: widget.locale.languageCode == 'en'
                                    ? strings.text('account.language.enUS')
                                    : strings.text('account.language.zhCN'),
                                onTap: widget.onLocaleChanged == null
                                    ? null
                                    : () => _showLanguagePicker(
                                          context,
                                          strings,
                                        ),
                              ),
                              _SettingsRowData(
                                icon: Icons.dark_mode_outlined,
                                label: strings.text('account.appearance'),
                                value: strings.text('account.appearanceValue'),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          _SettingsGroup(
                            title: strings.text('account.security'),
                            rows: [
                              _SettingsRowData(
                                icon: Icons.shield_outlined,
                                label: strings.text('account.privacy'),
                              ),
                              _SettingsRowData(
                                icon: Icons.devices_outlined,
                                label: strings.text('account.devices'),
                              ),
                            ],
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

  Future<void> _showLanguagePicker(
    BuildContext context,
    NewsStrings strings,
  ) async {
    final selectedLocale = await showModalBottomSheet<Locale>(
      context: context,
      useSafeArea: true,
      builder: (context) => _LanguagePicker(
        selectedLocale: widget.locale,
        strings: strings,
      ),
    );
    if (selectedLocale != null && mounted) {
      widget.onLocaleChanged?.call(selectedLocale);
    }
  }
}

class _LanguagePicker extends StatelessWidget {
  const _LanguagePicker({
    required this.selectedLocale,
    required this.strings,
  });

  final Locale selectedLocale;
  final NewsStrings strings;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            strings.text('account.language'),
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 8),
          _LanguageOption(
            key: const ValueKey('account.locale.zh-CN'),
            locale: const Locale('zh', 'CN'),
            label: strings.text('account.language.zhCN'),
            selected: selectedLocale.languageCode == 'zh',
          ),
          _LanguageOption(
            key: const ValueKey('account.locale.en-US'),
            locale: const Locale('en', 'US'),
            label: strings.text('account.language.enUS'),
            selected: selectedLocale.languageCode == 'en',
          ),
        ],
      ),
    );
  }
}

class _LanguageOption extends StatelessWidget {
  const _LanguageOption({
    super.key,
    required this.locale,
    required this.label,
    required this.selected,
  });

  final Locale locale;
  final String label;
  final bool selected;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 4),
      title: Text(label),
      trailing: selected
          ? const Icon(Icons.check_circle_rounded, color: NewsPalette.primary)
          : null,
      onTap: () => Navigator.of(context).pop(locale),
    );
  }
}

class _ProfileCard extends StatelessWidget {
  const _ProfileCard({required this.profile, required this.strings});

  final AccountProfile profile;
  final NewsStrings strings;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: NewsPalette.surface,
        borderRadius: BorderRadius.circular(7),
      ),
      child: Row(
        children: [
          Container(
            width: 54,
            height: 54,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: NewsPalette.primary,
              borderRadius: BorderRadius.circular(7),
            ),
            child: Text(
              profile.initial,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 22,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(profile.displayName,
                    style: const TextStyle(
                        fontSize: 17, fontWeight: FontWeight.w800)),
                if (profile.email?.isNotEmpty == true)
                  Text(
                    profile.email!,
                    style: const TextStyle(
                      color: NewsPalette.muted,
                      fontSize: 10,
                    ),
                  ),
                if (profile.planProgress != null) ...[
                  const SizedBox(height: 5),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                    color: NewsPalette.primarySoft,
                    child: Text(
                      strings.text('account.enterprise'),
                      style: const TextStyle(
                        color: NewsPalette.primary,
                        fontSize: 9,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
          const Icon(Icons.chevron_right_rounded, color: NewsPalette.muted),
        ],
      ),
    );
  }
}

class _PlanCard extends StatelessWidget {
  const _PlanCard({required this.profile, required this.strings});

  final AccountProfile profile;
  final NewsStrings strings;

  @override
  Widget build(BuildContext context) {
    final progress = profile.planProgress!;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: NewsPalette.primaryDark,
        borderRadius: BorderRadius.circular(7),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.credit_card_rounded,
                  color: Colors.white, size: 18),
              const SizedBox(width: 7),
              Expanded(
                child: Text(
                  strings.text('account.plan'),
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              Text(
                '${(progress * 100).round()}%',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
          const SizedBox(height: 5),
          Text(strings.text('account.agentUsage'),
              style: const TextStyle(color: Colors.white70, fontSize: 10)),
          const SizedBox(height: 12),
          LinearProgressIndicator(
            value: progress,
            minHeight: 5,
            borderRadius: BorderRadius.circular(3),
            color: const Color(0xFF74C5AD),
            backgroundColor: Colors.white12,
          ),
          const SizedBox(height: 9),
          Align(
            alignment: Alignment.centerRight,
            child: OutlinedButton(
              onPressed: null,
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.white,
                side: const BorderSide(color: Colors.white30),
                minimumSize: const Size(48, 34),
              ),
              child: Text(strings.text('account.manage'),
                  style: const TextStyle(fontSize: 10)),
            ),
          ),
        ],
      ),
    );
  }
}

String _countLabel(int? value, NewsStrings strings) =>
    value == null ? strings.text('common.unavailable') : '$value';

class _AccountLoadFailure extends StatelessWidget {
  const _AccountLoadFailure({
    required this.message,
    required this.retryLabel,
    required this.onRetry,
  });

  final String message;
  final String retryLabel;
  final Future<void> Function() onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
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
      ),
    );
  }
}

class _SavedTimeCard extends StatelessWidget {
  const _SavedTimeCard({required this.strings});

  final NewsStrings strings;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: NewsPalette.surface,
        borderRadius: BorderRadius.circular(7),
      ),
      child: Row(
        children: [
          const Icon(Icons.schedule_rounded, color: NewsPalette.primary),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(strings.text('account.saved'),
                    style: const TextStyle(fontWeight: FontWeight.w700)),
                Text(strings.text('account.savedHint'),
                    style: const TextStyle(
                        color: NewsPalette.muted, fontSize: 10)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SettingsRowData {
  const _SettingsRowData({
    required this.icon,
    required this.label,
    this.value,
    this.onTap,
  });

  final IconData icon;
  final String label;
  final String? value;
  final VoidCallback? onTap;
}

class _SettingsGroup extends StatelessWidget {
  const _SettingsGroup({required this.title, required this.rows});

  final String title;
  final List<_SettingsRowData> rows;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: NewsPalette.surface,
        borderRadius: BorderRadius.circular(7),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 12, 14, 5),
            child: Text(
              title,
              style: const TextStyle(color: NewsPalette.muted, fontSize: 10),
            ),
          ),
          for (var index = 0; index < rows.length; index += 1) ...[
            _SettingsRow(row: rows[index]),
            if (index < rows.length - 1)
              const Padding(
                padding: EdgeInsets.only(left: 52),
                child: Divider(),
              ),
          ],
        ],
      ),
    );
  }
}

class _SettingsRow extends StatelessWidget {
  const _SettingsRow({required this.row});

  final _SettingsRowData row;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: row.onTap,
      child: SizedBox(
        height: 52,
        child: Row(
          children: [
            const SizedBox(width: 14),
            Container(
              width: 28,
              height: 28,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: NewsPalette.primarySoft,
                borderRadius: BorderRadius.circular(5),
              ),
              child: Icon(row.icon, color: NewsPalette.primary, size: 17),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(row.label,
                  style: const TextStyle(
                      fontSize: 13, fontWeight: FontWeight.w600)),
            ),
            if (row.value != null)
              Text(row.value!,
                  style:
                      const TextStyle(color: NewsPalette.muted, fontSize: 10)),
            const SizedBox(width: 4),
            const Icon(Icons.chevron_right_rounded,
                color: NewsPalette.muted, size: 19),
            const SizedBox(width: 10),
          ],
        ),
      ),
    );
  }
}
