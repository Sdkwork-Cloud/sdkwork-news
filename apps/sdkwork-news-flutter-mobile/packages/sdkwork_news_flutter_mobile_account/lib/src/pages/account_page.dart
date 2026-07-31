import 'package:flutter/material.dart';
import 'package:sdkwork_news_flutter_mobile_commons/sdkwork_news_flutter_mobile_commons.dart';

import '../controllers/account_controller.dart';
import '../models/account_profile.dart';

class AccountPage extends StatefulWidget {
  const AccountPage({super.key, required this.controller});

  final AccountController controller;

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
                      tooltip: strings.text('account.settings'),
                      onPressed: () {},
                      icon: const Icon(Icons.tune_rounded),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: profile == null
                    ? const Center(child: CircularProgressIndicator())
                    : ListView(
                        key: const PageStorageKey('account'),
                        padding: const EdgeInsets.fromLTRB(12, 12, 12, 30),
                        children: [
                          _ProfileCard(profile: profile, strings: strings),
                          const SizedBox(height: 10),
                          _PlanCard(profile: profile, strings: strings),
                          const SizedBox(height: 10),
                          _SavedTimeCard(strings: strings),
                          const SizedBox(height: 10),
                          _SettingsGroup(
                            title: strings.text('account.content'),
                            rows: [
                              _SettingsRowData(
                                icon: Icons.bookmark_border_rounded,
                                label: strings.text('account.favorites'),
                                value: '${profile.favoriteCount}',
                              ),
                              _SettingsRowData(
                                icon: Icons.history_rounded,
                                label: strings.text('account.history'),
                                value: '${profile.historyCount}',
                              ),
                              _SettingsRowData(
                                icon: Icons.download_outlined,
                                label: strings.text('account.offline'),
                                value: '${profile.offlineCount}',
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
                                value: '重要更新',
                              ),
                              _SettingsRowData(
                                icon: Icons.translate_rounded,
                                label: strings.text('account.language'),
                                value: '简体中文',
                              ),
                              _SettingsRowData(
                                icon: Icons.dark_mode_outlined,
                                label: strings.text('account.appearance'),
                                value: '跟随系统',
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
                Text(profile.email,
                    style: const TextStyle(
                        color: NewsPalette.muted, fontSize: 10)),
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
                '${(profile.planProgress * 100).round()}%',
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
            value: profile.planProgress,
            minHeight: 5,
            borderRadius: BorderRadius.circular(3),
            color: const Color(0xFF74C5AD),
            backgroundColor: Colors.white12,
          ),
          const SizedBox(height: 9),
          Align(
            alignment: Alignment.centerRight,
            child: OutlinedButton(
              onPressed: () {},
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
  });

  final IconData icon;
  final String label;
  final String? value;
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
      onTap: () {},
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
