import 'package:flutter/material.dart';
import 'package:sdkwork_news_flutter_mobile_commons/sdkwork_news_flutter_mobile_commons.dart';

import '../controllers/account_controller.dart';
import '../models/account_preferences.dart';
import '../models/account_profile.dart';

enum AccountDetailKind {
  profile,
  subscription,
  saved,
  history,
  offline,
  usage,
  notifications,
  language,
  appearance,
  privacy,
  security,
  devices,
  help,
  about,
}

class AccountDetailPage extends StatelessWidget {
  const AccountDetailPage({
    super.key,
    required this.controller,
    required this.kind,
    required this.profile,
    required this.locale,
    required this.onBack,
    required this.onLocaleChanged,
    required this.demoMode,
  });

  final AccountController controller;
  final AccountDetailKind kind;
  final AccountProfile profile;
  final Locale locale;
  final VoidCallback onBack;
  final ValueChanged<Locale>? onLocaleChanged;
  final bool demoMode;

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
            _DetailHeader(
              title: strings.text('account.detail.${kind.name}'),
              onBack: onBack,
            ),
            Expanded(
              child: ListView(
                key: ValueKey('account.detail.${kind.name}'),
                padding: const EdgeInsets.fromLTRB(12, 14, 12, 32),
                children: [
                  _content(context, strings),
                  if (controller.mutationError != null) ...[
                    const SizedBox(height: 12),
                    _StatusBanner(
                      message: strings.text('account.saveFailed'),
                      error: true,
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _content(BuildContext context, NewsStrings strings) => switch (kind) {
        AccountDetailKind.profile => _ProfileDetail(
            controller: controller,
            profile: profile,
            strings: strings,
          ),
        AccountDetailKind.subscription =>
          _SubscriptionDetail(strings: strings, available: demoMode),
        AccountDetailKind.saved => _ContentListDetail(
            emptyKey: 'account.saved.empty',
            icon: Icons.bookmark_border_rounded,
            items: controller.preferences.savedItems,
            onRemove: controller.removeSavedItem,
            strings: strings,
          ),
        AccountDetailKind.history => _HistoryDetail(
            controller: controller,
            strings: strings,
          ),
        AccountDetailKind.offline => _OfflineDetail(
            controller: controller,
            strings: strings,
          ),
        AccountDetailKind.usage =>
          _UsageDetail(strings: strings, available: demoMode),
        AccountDetailKind.notifications => _NotificationsDetail(
            controller: controller,
            strings: strings,
          ),
        AccountDetailKind.language => _LanguageDetail(
            controller: controller,
            locale: locale,
            onLocaleChanged: onLocaleChanged,
            strings: strings,
          ),
        AccountDetailKind.appearance => _AppearanceDetail(
            controller: controller,
            strings: strings,
          ),
        AccountDetailKind.privacy => _PrivacyDetail(
            controller: controller,
            strings: strings,
          ),
        AccountDetailKind.security =>
          _SecurityDetail(strings: strings, demoMode: demoMode),
        AccountDetailKind.devices => _DevicesDetail(
            controller: controller,
            strings: strings,
            available: demoMode,
          ),
        AccountDetailKind.help => _HelpDetail(strings: strings),
        AccountDetailKind.about => _AboutDetail(strings: strings),
      };
}

class _DetailHeader extends StatelessWidget {
  const _DetailHeader({required this.title, required this.onBack});

  final String title;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) => Container(
        height: 58,
        padding: const EdgeInsets.symmetric(horizontal: 5),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          border: Border(
            bottom: BorderSide(color: Theme.of(context).colorScheme.outline),
          ),
        ),
        child: Row(
          children: [
            IconButton(
              key: const ValueKey('account.detail.back'),
              tooltip: MaterialLocalizations.of(context).backButtonTooltip,
              onPressed: onBack,
              icon: const Icon(Icons.arrow_back_rounded),
            ),
            Expanded(
              child: Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(fontWeight: FontWeight.w800),
              ),
            ),
            const SizedBox(width: 44),
          ],
        ),
      );
}

class _ProfileDetail extends StatefulWidget {
  const _ProfileDetail({
    required this.controller,
    required this.profile,
    required this.strings,
  });

  final AccountController controller;
  final AccountProfile profile;
  final NewsStrings strings;

  @override
  State<_ProfileDetail> createState() => _ProfileDetailState();
}

class _ProfileDetailState extends State<_ProfileDetail> {
  late final TextEditingController _displayName;

  @override
  void initState() {
    super.initState();
    _displayName = TextEditingController(text: widget.profile.displayName);
  }

  @override
  void dispose() {
    _displayName.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => _Panel(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            CircleAvatar(
              radius: 30,
              backgroundColor: NewsPalette.primary,
              child: Text(
                widget.profile.initial,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            const SizedBox(height: 18),
            TextField(
              key: const ValueKey('account.profile.displayName'),
              controller: _displayName,
              maxLength: 40,
              decoration: InputDecoration(
                labelText: widget.strings.text('account.profile.displayName'),
              ),
            ),
            const SizedBox(height: 10),
            TextFormField(
              enabled: false,
              initialValue: widget.profile.email ??
                  widget.strings.text('common.unavailable'),
              decoration: InputDecoration(
                labelText: widget.strings.text('account.profile.email'),
              ),
            ),
            const SizedBox(height: 14),
            FilledButton.icon(
              key: const ValueKey('account.profile.save'),
              onPressed: widget.controller.isSaving
                  ? null
                  : () async {
                      final saved = await widget.controller
                          .updateDisplayName(_displayName.text);
                      if (!context.mounted || !saved) return;
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            widget.strings.text('account.profile.updated'),
                          ),
                        ),
                      );
                    },
              icon: widget.controller.isSaving
                  ? const SizedBox.square(
                      dimension: 16,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Icon(Icons.check_rounded),
              label: Text(widget.strings.text('account.profile.save')),
            ),
          ],
        ),
      );
}

class _SubscriptionDetail extends StatelessWidget {
  const _SubscriptionDetail({required this.strings, required this.available});

  final NewsStrings strings;
  final bool available;

  @override
  Widget build(BuildContext context) {
    if (!available) {
      return _UnavailableState(
        icon: Icons.credit_card_rounded,
        text: strings.text('account.subscription.unavailable'),
      );
    }
    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: NewsPalette.primaryDark,
            borderRadius: BorderRadius.circular(7),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('PRO', style: TextStyle(color: Colors.green.shade100)),
              const SizedBox(height: 7),
              Text(
                strings.text('account.subscription.pro'),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 5),
              Text(
                strings.text('account.subscription.description'),
                style: const TextStyle(color: Colors.white70, height: 1.5),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        _Panel(
          child: Column(
            children: [
              _MetricRow(
                label: strings.text('account.subscription.agentRuns'),
                value: '42 / 200',
              ),
              _MetricRow(
                label: strings.text('account.subscription.deepReading'),
                value: '18.7 / 60 h',
              ),
              _MetricRow(
                label: strings.text('account.subscription.offlineSpace'),
                value: '486 MB / 5 GB',
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _HistoryDetail extends StatelessWidget {
  const _HistoryDetail({required this.controller, required this.strings});

  final AccountController controller;
  final NewsStrings strings;

  @override
  Widget build(BuildContext context) => Column(
        children: [
          _ContentListDetail(
            emptyKey: 'account.history.empty',
            icon: Icons.history_rounded,
            items: controller.preferences.historyItems,
            strings: strings,
          ),
          if (controller.preferences.historyItems.isNotEmpty) ...[
            const SizedBox(height: 12),
            OutlinedButton.icon(
              key: const ValueKey('account.history.clear'),
              onPressed: controller.clearHistory,
              style: OutlinedButton.styleFrom(
                foregroundColor: NewsPalette.danger,
                side: const BorderSide(color: NewsPalette.danger),
              ),
              icon: const Icon(Icons.delete_outline_rounded),
              label: Text(strings.text('account.history.clear')),
            ),
          ],
        ],
      );
}

class _OfflineDetail extends StatelessWidget {
  const _OfflineDetail({required this.controller, required this.strings});

  final AccountController controller;
  final NewsStrings strings;

  @override
  Widget build(BuildContext context) => Column(
        children: [
          _Panel(
            child: _ToggleRow(
              key: const ValueKey('account.offline.wifiOnly'),
              icon: Icons.wifi_rounded,
              label: strings.text('account.offline.wifiOnly'),
              value: controller.preferences.offlineWifiOnly,
              onChanged: (value) => controller.updatePreferences(
                (current) => current.copyWith(offlineWifiOnly: value),
              ),
            ),
          ),
          const SizedBox(height: 12),
          _ContentListDetail(
            emptyKey: 'account.offline.empty',
            icon: Icons.download_outlined,
            items: controller.preferences.offlineItems,
            onRemove: controller.removeOfflineItem,
            strings: strings,
          ),
        ],
      );
}

class _UsageDetail extends StatelessWidget {
  const _UsageDetail({required this.strings, required this.available});

  final NewsStrings strings;
  final bool available;

  @override
  Widget build(BuildContext context) {
    if (!available) {
      return _UnavailableState(
        icon: Icons.schedule_rounded,
        text: strings.text('account.usage.unavailable'),
      );
    }
    return _Panel(
      child: Column(
        children: [
          Text(
            '24.6 h',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  color: NewsPalette.primary,
                  fontWeight: FontWeight.w800,
                ),
          ),
          Text(strings.text('account.usage.savedTime')),
          const SizedBox(height: 18),
          _MetricRow(
            label: strings.text('account.usage.marketRadar'),
            value: '18',
          ),
          _MetricRow(
            label: strings.text('account.usage.productWatch'),
            value: '14',
          ),
          _MetricRow(
            label: strings.text('account.usage.policyWeekly'),
            value: '10',
          ),
        ],
      ),
    );
  }
}

class _NotificationsDetail extends StatelessWidget {
  const _NotificationsDetail({required this.controller, required this.strings});

  final AccountController controller;
  final NewsStrings strings;

  @override
  Widget build(BuildContext context) {
    final value = controller.preferences;
    return _Panel(
      child: Column(
        children: [
          _ToggleRow(
            key: const ValueKey('account.notifications.enabled'),
            icon: Icons.notifications_none_rounded,
            label: strings.text('account.notifications.enabled'),
            value: value.notificationsEnabled,
            onChanged: (next) => controller.updatePreferences(
              (current) => current.copyWith(notificationsEnabled: next),
            ),
          ),
          _ToggleRow(
            icon: Icons.campaign_outlined,
            label: strings.text('account.notifications.breaking'),
            value: value.breakingNews,
            enabled: value.notificationsEnabled,
            onChanged: (next) => controller.updatePreferences(
              (current) => current.copyWith(breakingNews: next),
            ),
          ),
          _ToggleRow(
            icon: Icons.smart_toy_outlined,
            label: strings.text('account.notifications.digests'),
            value: value.agentDigests,
            enabled: value.notificationsEnabled,
            onChanged: (next) => controller.updatePreferences(
              (current) => current.copyWith(agentDigests: next),
            ),
          ),
          _ToggleRow(
            icon: Icons.dark_mode_outlined,
            label: strings.text('account.notifications.quietHours'),
            value: value.quietHours,
            enabled: value.notificationsEnabled,
            onChanged: (next) => controller.updatePreferences(
              (current) => current.copyWith(quietHours: next),
            ),
          ),
        ],
      ),
    );
  }
}

class _LanguageDetail extends StatelessWidget {
  const _LanguageDetail({
    required this.controller,
    required this.locale,
    required this.onLocaleChanged,
    required this.strings,
  });

  final AccountController controller;
  final Locale locale;
  final ValueChanged<Locale>? onLocaleChanged;
  final NewsStrings strings;

  @override
  Widget build(BuildContext context) => _Panel(
        child: Column(
          children: [
            _ChoiceRow(
              key: const ValueKey('account.locale.zh-CN'),
              label: strings.text('account.language.zhCN'),
              description: strings.text('account.language.zhDescription'),
              selected: locale.languageCode == 'zh',
              onTap: () => _select(const Locale('zh', 'CN')),
            ),
            _ChoiceRow(
              key: const ValueKey('account.locale.en-US'),
              label: strings.text('account.language.enUS'),
              description: strings.text('account.language.enDescription'),
              selected: locale.languageCode == 'en',
              onTap: () => _select(const Locale('en', 'US')),
            ),
          ],
        ),
      );

  void _select(Locale next) {
    onLocaleChanged?.call(next);
    controller.updatePreferences(
      (current) => current.copyWith(
        localeTag: next.languageCode == 'en' ? 'en-US' : 'zh-CN',
      ),
    );
  }
}

class _AppearanceDetail extends StatelessWidget {
  const _AppearanceDetail({required this.controller, required this.strings});

  final AccountController controller;
  final NewsStrings strings;

  @override
  Widget build(BuildContext context) => _Panel(
        child: Column(
          children: AccountAppearance.values
              .map(
                (appearance) => _ChoiceRow(
                  key: ValueKey('account.appearance.${appearance.name}'),
                  label: strings.text(
                    'account.appearance.${appearance.name}',
                  ),
                  description: strings.text(
                    'account.appearance.${appearance.name}Description',
                  ),
                  selected: controller.preferences.appearance == appearance,
                  onTap: () => controller.updatePreferences(
                    (current) => current.copyWith(appearance: appearance),
                  ),
                ),
              )
              .toList(growable: false),
        ),
      );
}

class _PrivacyDetail extends StatelessWidget {
  const _PrivacyDetail({required this.controller, required this.strings});

  final AccountController controller;
  final NewsStrings strings;

  @override
  Widget build(BuildContext context) {
    final value = controller.preferences;
    return _Panel(
      child: Column(
        children: [
          _ToggleRow(
            key: const ValueKey('account.privacy.personalized'),
            icon: Icons.newspaper_outlined,
            label: strings.text('account.privacy.personalized'),
            value: value.personalizedNews,
            onChanged: (next) => controller.updatePreferences(
              (current) => current.copyWith(personalizedNews: next),
            ),
          ),
          _ToggleRow(
            icon: Icons.psychology_outlined,
            label: strings.text('account.privacy.learning'),
            value: value.agentLearning,
            onChanged: (next) => controller.updatePreferences(
              (current) => current.copyWith(agentLearning: next),
            ),
          ),
          _ToggleRow(
            icon: Icons.analytics_outlined,
            label: strings.text('account.privacy.analytics'),
            value: value.analytics,
            onChanged: (next) => controller.updatePreferences(
              (current) => current.copyWith(analytics: next),
            ),
          ),
        ],
      ),
    );
  }
}

class _SecurityDetail extends StatefulWidget {
  const _SecurityDetail({required this.strings, required this.demoMode});

  final NewsStrings strings;
  final bool demoMode;

  @override
  State<_SecurityDetail> createState() => _SecurityDetailState();
}

class _SecurityDetailState extends State<_SecurityDetail> {
  final _current = TextEditingController();
  final _next = TextEditingController();
  final _confirm = TextEditingController();
  String? _statusKey;
  bool _error = false;

  @override
  void dispose() {
    _current.dispose();
    _next.dispose();
    _confirm.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.demoMode) {
      return _UnavailableState(
        icon: Icons.key_rounded,
        text: widget.strings.text('account.security.reviewRequired'),
      );
    }
    return _Panel(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _PasswordField(
            key: const ValueKey('account.password.current'),
            controller: _current,
            label: widget.strings.text('account.security.currentPassword'),
          ),
          const SizedBox(height: 10),
          _PasswordField(
            key: const ValueKey('account.password.new'),
            controller: _next,
            label: widget.strings.text('account.security.newPassword'),
          ),
          const SizedBox(height: 10),
          _PasswordField(
            key: const ValueKey('account.password.confirm'),
            controller: _confirm,
            label: widget.strings.text('account.security.confirmPassword'),
          ),
          const SizedBox(height: 14),
          FilledButton.icon(
            key: const ValueKey('account.password.submit'),
            onPressed: _validate,
            icon: const Icon(Icons.key_rounded),
            label: Text(widget.strings.text('account.security.update')),
          ),
          if (_statusKey != null) ...[
            const SizedBox(height: 12),
            _StatusBanner(
              message: widget.strings.text(_statusKey!),
              error: _error,
            ),
          ],
        ],
      ),
    );
  }

  void _validate() {
    setState(() {
      _error = true;
      if (_next.text.length < 8) {
        _statusKey = 'account.security.tooShort';
      } else if (_next.text != _confirm.text) {
        _statusKey = 'account.security.mismatch';
      } else if (_current.text.isEmpty) {
        _statusKey = 'account.security.currentRequired';
      } else {
        _current.clear();
        _next.clear();
        _confirm.clear();
        _error = false;
        _statusKey = 'account.security.demoValidated';
      }
    });
  }
}

class _DevicesDetail extends StatelessWidget {
  const _DevicesDetail({
    required this.controller,
    required this.strings,
    required this.available,
  });

  final AccountController controller;
  final NewsStrings strings;
  final bool available;

  @override
  Widget build(BuildContext context) {
    if (!available) {
      return _UnavailableState(
        icon: Icons.devices_outlined,
        text: strings.text('account.devices.unavailable'),
      );
    }
    return _Panel(
      child: Column(
        children: controller.preferences.devices
            .map(
              (device) => ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.smartphone_rounded),
                title: Text(device.name),
                subtitle: Text('${device.location} · ${device.lastActive}'),
                trailing: device.current
                    ? Text(
                        strings.text('account.devices.current'),
                        style: const TextStyle(
                          color: NewsPalette.primary,
                          fontSize: 11,
                        ),
                      )
                    : IconButton(
                        tooltip: strings.text('account.devices.signOut'),
                        onPressed: () => controller.removeDevice(device.id),
                        icon: const Icon(Icons.logout_rounded),
                      ),
              ),
            )
            .toList(growable: false),
      ),
    );
  }
}

class _HelpDetail extends StatelessWidget {
  const _HelpDetail({required this.strings});

  final NewsStrings strings;

  @override
  Widget build(BuildContext context) => _Panel(
        child: Column(
          children: List.generate(
            3,
            (index) => ExpansionTile(
              tilePadding: EdgeInsets.zero,
              childrenPadding: const EdgeInsets.only(bottom: 12),
              title: Text(strings.text('account.help.q${index + 1}')),
              children: [
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    strings.text('account.help.a${index + 1}'),
                    style: const TextStyle(
                      color: NewsPalette.muted,
                      height: 1.6,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
}

class _AboutDetail extends StatelessWidget {
  const _AboutDetail({required this.strings});

  final NewsStrings strings;

  @override
  Widget build(BuildContext context) => _Panel(
        child: Column(
          children: [
            Container(
              width: 58,
              height: 58,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: NewsPalette.primary,
                borderRadius: BorderRadius.circular(7),
              ),
              child: const Text(
                'N',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 26,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'SDKWork News',
              style: Theme.of(context)
                  .textTheme
                  .titleLarge
                  ?.copyWith(fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 3),
            Text(
              strings.text('account.about.version'),
              style: const TextStyle(color: NewsPalette.muted),
            ),
            const SizedBox(height: 18),
            _MetricRow(
              label: strings.text('account.about.privacy'),
              value: '2026.07',
            ),
            _MetricRow(
              label: strings.text('account.about.terms'),
              value: '2026.07',
            ),
            _MetricRow(
              label: strings.text('account.about.licenses'),
              value: strings.text('account.about.view'),
            ),
          ],
        ),
      );
}

class _ContentListDetail extends StatelessWidget {
  const _ContentListDetail({
    required this.emptyKey,
    required this.icon,
    required this.items,
    required this.strings,
    this.onRemove,
  });

  final String emptyKey;
  final IconData icon;
  final List<AccountContentItem> items;
  final NewsStrings strings;
  final Future<void> Function(String id)? onRemove;

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) {
      return _UnavailableState(icon: icon, text: strings.text(emptyKey));
    }
    return _Panel(
      child: Column(
        children: items
            .map(
              (item) => ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(icon, color: NewsPalette.primary),
                title: Text(item.title),
                subtitle: Text('${item.source} · ${item.meta}'),
                trailing: onRemove == null
                    ? null
                    : IconButton(
                        tooltip: strings.text('common.remove'),
                        onPressed: () => onRemove!(item.id),
                        icon: const Icon(Icons.delete_outline_rounded),
                      ),
              ),
            )
            .toList(growable: false),
      ),
    );
  }
}

class _Panel extends StatelessWidget {
  const _Panel({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) => Material(
        color: Theme.of(context).colorScheme.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(7),
          side: BorderSide(color: Theme.of(context).colorScheme.outline),
        ),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: child,
        ),
      );
}

class _ToggleRow extends StatelessWidget {
  const _ToggleRow({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
    required this.onChanged,
    this.enabled = true,
  });

  final IconData icon;
  final String label;
  final bool value;
  final bool enabled;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) => SwitchListTile(
        contentPadding: EdgeInsets.zero,
        secondary: Icon(icon, color: NewsPalette.primary),
        title: Text(label),
        value: value,
        onChanged: enabled ? onChanged : null,
      );
}

class _ChoiceRow extends StatelessWidget {
  const _ChoiceRow({
    super.key,
    required this.label,
    required this.description,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final String description;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => ListTile(
        contentPadding: EdgeInsets.zero,
        title: Text(label),
        subtitle: Text(description),
        trailing: selected
            ? const Icon(Icons.check_circle_rounded, color: NewsPalette.primary)
            : const Icon(Icons.circle_outlined, color: NewsPalette.muted),
        onTap: onTap,
      );
}

class _MetricRow extends StatelessWidget {
  const _MetricRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          children: [
            Expanded(child: Text(label)),
            Text(value, style: const TextStyle(fontWeight: FontWeight.w700)),
          ],
        ),
      );
}

class _UnavailableState extends StatelessWidget {
  const _UnavailableState({required this.icon, required this.text});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 54),
        child: Column(
          children: [
            Icon(icon, size: 30, color: NewsPalette.muted),
            const SizedBox(height: 10),
            Text(
              text,
              textAlign: TextAlign.center,
              style: const TextStyle(color: NewsPalette.muted),
            ),
          ],
        ),
      );
}

class _StatusBanner extends StatelessWidget {
  const _StatusBanner({required this.message, required this.error});

  final String message;
  final bool error;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(12),
        color: error
            ? NewsPalette.danger.withValues(alpha: 0.08)
            : NewsPalette.primarySoft,
        child: Text(
          message,
          style: TextStyle(
            color: error ? NewsPalette.danger : NewsPalette.primaryDark,
          ),
        ),
      );
}

class _PasswordField extends StatelessWidget {
  const _PasswordField({
    super.key,
    required this.controller,
    required this.label,
  });

  final TextEditingController controller;
  final String label;

  @override
  Widget build(BuildContext context) => TextField(
        controller: controller,
        obscureText: true,
        autocorrect: false,
        enableSuggestions: false,
        decoration: InputDecoration(labelText: label),
      );
}
