import 'package:flutter/material.dart';
import 'package:sdkwork_news_flutter_mobile_commons/sdkwork_news_flutter_mobile_commons.dart';
import 'package:sdkwork_news_flutter_mobile_core/sdkwork_news_flutter_mobile_core.dart';

import '../controllers/assistant_controller.dart';

class AssistantPage extends StatefulWidget {
  const AssistantPage({super.key, required this.controller});

  final AssistantController controller;

  @override
  State<AssistantPage> createState() => _AssistantPageState();
}

class _AssistantPageState extends State<AssistantPage> {
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
        final agent = widget.controller.selectedAgent;
        return agent == null
            ? _AssistantInbox(controller: widget.controller)
            : _AssistantConversation(
                controller: widget.controller,
                agent: agent,
              );
      },
    );
  }
}

class _AssistantInbox extends StatelessWidget {
  const _AssistantInbox({required this.controller});

  final AssistantController controller;

  @override
  Widget build(BuildContext context) {
    final strings = NewsStrings.of(context);
    return SafeArea(
      bottom: false,
      child: CustomScrollView(
        key: const PageStorageKey('assistant-inbox'),
        slivers: [
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 0),
            sliver: SliverList.list(
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            strings.text('assistant.title'),
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall
                                ?.copyWith(fontWeight: FontWeight.w800),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            strings.text('assistant.updates'),
                            style: Theme.of(context)
                                .textTheme
                                .bodySmall
                                ?.copyWith(color: NewsPalette.muted),
                          ),
                        ],
                      ),
                    ),
                    IconButton.filled(
                      tooltip: strings.text('assistant.create'),
                      onPressed: () => _showCreateSheet(context, controller),
                      icon: const Icon(Icons.add_rounded),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                TextField(
                  decoration: InputDecoration(
                    hintText: strings.text('assistant.search'),
                    prefixIcon: const Icon(Icons.search_rounded, size: 20),
                    isDense: true,
                  ),
                ),
                const SizedBox(height: 12),
                _ReadingSummary(strings: strings),
                const SizedBox(height: 18),
                NewsSectionHeader(
                  title: strings.text('assistant.sessions'),
                  trailing: TextButton(
                    onPressed: controller.markAllRead,
                    child: Text(strings.text('assistant.markAllRead')),
                  ),
                ),
              ],
            ),
          ),
          if (controller.isLoading && controller.agents.isEmpty)
            const SliverFillRemaining(
              hasScrollBody: false,
              child: Center(child: CircularProgressIndicator()),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverList.separated(
                itemCount: controller.agents.length,
                separatorBuilder: (_, __) => const Divider(),
                itemBuilder: (context, index) {
                  final agent = controller.agents[index];
                  return _AgentRow(
                    agent: agent,
                    onTap: () => controller.selectAgent(agent),
                  );
                },
              ),
            ),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
            sliver: SliverToBoxAdapter(
              child: OutlinedButton.icon(
                onPressed: () => _showCreateSheet(context, controller),
                icon: const Icon(Icons.smart_toy_outlined),
                label: Align(
                  alignment: Alignment.centerLeft,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        strings.text('assistant.newCapability'),
                        style: const TextStyle(fontWeight: FontWeight.w700),
                      ),
                      Text(
                        strings.text('assistant.createHint'),
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ReadingSummary extends StatelessWidget {
  const _ReadingSummary({required this.strings});

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
        children: [
          Row(
            children: [
              Expanded(
                child: _Metric(
                  icon: Icons.auto_awesome_outlined,
                  label: strings.text('assistant.todayRead'),
                  value: '246',
                  unit: strings.text('assistant.items'),
                ),
              ),
              Container(width: 1, height: 48, color: Colors.white12),
              Expanded(
                child: _Metric(
                  icon: Icons.schedule_rounded,
                  label: strings.text('assistant.savedTime'),
                  value: '1.7',
                  unit: strings.text('assistant.hours'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            height: 40,
            padding: const EdgeInsets.symmetric(horizontal: 11),
            decoration: BoxDecoration(
              color: Colors.white10,
              borderRadius: BorderRadius.circular(5),
            ),
            child: Row(
              children: [
                const Icon(Icons.calendar_month_outlined,
                    color: Colors.white70, size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    strings.text('assistant.nextRun'),
                    style: const TextStyle(color: Colors.white, fontSize: 12),
                  ),
                ),
                const Icon(Icons.chevron_right_rounded, color: Colors.white70),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Metric extends StatelessWidget {
  const _Metric({
    required this.icon,
    required this.label,
    required this.value,
    required this.unit,
  });

  final IconData icon;
  final String label;
  final String value;
  final String unit;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 15, color: const Color(0xFF9ED9C6)),
              const SizedBox(width: 5),
              Text(label,
                  style: const TextStyle(color: Colors.white70, fontSize: 11)),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                value,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 23,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(width: 4),
              Padding(
                padding: const EdgeInsets.only(bottom: 3),
                child: Text(unit,
                    style:
                        const TextStyle(color: Colors.white70, fontSize: 10)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _AgentRow extends StatelessWidget {
  const _AgentRow({required this.agent, required this.onTap});

  final NewsAgent agent;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: agent.name,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 13),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AgentAvatar(
                initial: agent.initial,
                color: Color(agent.colorValue),
              ),
              const SizedBox(width: 11),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            agent.name,
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        Text(
                          agent.lastActivityLabel,
                          style: Theme.of(context)
                              .textTheme
                              .labelSmall
                              ?.copyWith(color: NewsPalette.muted),
                        ),
                      ],
                    ),
                    const SizedBox(height: 3),
                    Text(
                      agent.summary,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 12),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      agent.description,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context)
                          .textTheme
                          .labelSmall
                          ?.copyWith(color: NewsPalette.muted),
                    ),
                  ],
                ),
              ),
              if (agent.unreadCount > 0) ...[
                const SizedBox(width: 8),
                Container(
                  constraints:
                      const BoxConstraints(minWidth: 18, minHeight: 18),
                  alignment: Alignment.center,
                  padding: const EdgeInsets.symmetric(horizontal: 5),
                  decoration: const BoxDecoration(
                    color: NewsPalette.danger,
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    '${agent.unreadCount}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _AssistantConversation extends StatefulWidget {
  const _AssistantConversation({
    required this.controller,
    required this.agent,
  });

  final AssistantController controller;
  final NewsAgent agent;

  @override
  State<_AssistantConversation> createState() => _AssistantConversationState();
}

class _AssistantConversationState extends State<_AssistantConversation> {
  final _composer = TextEditingController();

  @override
  void dispose() {
    _composer.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    final value = _composer.text.trim();
    if (value.isEmpty) {
      return;
    }
    _composer.clear();
    await widget.controller.send(value);
  }

  @override
  Widget build(BuildContext context) {
    final strings = NewsStrings.of(context);
    return SafeArea(
      bottom: false,
      child: Column(
        children: [
          Container(
            height: 58,
            padding: const EdgeInsets.symmetric(horizontal: 4),
            color: NewsPalette.surface,
            child: Row(
              children: [
                IconButton(
                  tooltip: MaterialLocalizations.of(context).backButtonTooltip,
                  onPressed: widget.controller.closeConversation,
                  icon: const Icon(Icons.arrow_back_rounded),
                ),
                AgentAvatar(
                  initial: widget.agent.initial,
                  color: Color(widget.agent.colorValue),
                  size: 36,
                ),
                const SizedBox(width: 9),
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(widget.agent.name,
                          style: const TextStyle(fontWeight: FontWeight.w700)),
                      Row(
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            decoration: const BoxDecoration(
                              color: NewsPalette.primary,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            strings.text('assistant.working'),
                            style: Theme.of(context)
                                .textTheme
                                .labelSmall
                                ?.copyWith(color: NewsPalette.muted),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                IconButton(
                  tooltip: strings.text('assistant.settings'),
                  onPressed: () => _showProfileSheet(
                    context,
                    widget.controller,
                    widget.agent,
                  ),
                  icon: const Icon(Icons.tune_rounded),
                ),
              ],
            ),
          ),
          const Divider(),
          Expanded(
            child: widget.controller.isLoading
                ? Center(child: Text(strings.text('assistant.loading')))
                : ListView(
                    key: PageStorageKey(
                      'assistant-conversation-${widget.agent.id}',
                    ),
                    padding: const EdgeInsets.fromLTRB(14, 12, 14, 24),
                    children: [
                      Center(
                        child: Text(
                          strings.text('assistant.today'),
                          style: Theme.of(context)
                              .textTheme
                              .labelSmall
                              ?.copyWith(color: NewsPalette.muted),
                        ),
                      ),
                      const SizedBox(height: 12),
                      for (final message in widget.controller.messages)
                        _MessageBubble(
                          message: message,
                          agent: widget.agent,
                        ),
                      if (widget.controller.messages.isNotEmpty) ...[
                        const SizedBox(height: 2),
                        _DigestCard(strings: strings),
                        const SizedBox(height: 10),
                        _ActionCard(strings: strings),
                      ],
                      if (widget.controller.errorMessage != null)
                        Padding(
                          padding: const EdgeInsets.only(top: 10),
                          child: Text(
                            widget.controller.errorMessage!,
                            style: const TextStyle(
                              color: NewsPalette.danger,
                              fontSize: 12,
                            ),
                          ),
                        ),
                    ],
                  ),
          ),
          Container(
            padding: const EdgeInsets.fromLTRB(8, 8, 8, 10),
            decoration: const BoxDecoration(
              color: NewsPalette.surface,
              border: Border(top: BorderSide(color: NewsPalette.line)),
            ),
            child: SafeArea(
              top: false,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  IconButton(
                    tooltip:
                        MaterialLocalizations.of(context).openAppDrawerTooltip,
                    onPressed: () {},
                    icon: const Icon(Icons.add_circle_outline_rounded),
                  ),
                  Expanded(
                    child: TextField(
                      controller: _composer,
                      minLines: 1,
                      maxLines: 4,
                      textInputAction: TextInputAction.send,
                      onSubmitted: (_) => _send(),
                      decoration: InputDecoration(
                        hintText: strings.text('assistant.ask'),
                        isDense: true,
                      ),
                    ),
                  ),
                  const SizedBox(width: 5),
                  IconButton.filled(
                    tooltip: strings.text('assistant.send'),
                    onPressed: widget.controller.isSending ? null : _send,
                    icon: widget.controller.isSending
                        ? const SizedBox.square(
                            dimension: 18,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Icon(Icons.arrow_upward_rounded),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MessageBubble extends StatelessWidget {
  const _MessageBubble({required this.message, required this.agent});

  final NewsMessage message;
  final NewsAgent agent;

  @override
  Widget build(BuildContext context) {
    final isUser = message.role == NewsMessageRole.user;
    final bubble = Container(
      constraints: const BoxConstraints(maxWidth: 310),
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: isUser ? const Color(0xFFDDF2E9) : NewsPalette.surface,
        borderRadius: BorderRadius.circular(6),
        border: isUser ? null : Border.all(color: NewsPalette.line),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Flexible(
            child: Text(message.text, style: const TextStyle(height: 1.55)),
          ),
          if (message.streaming) ...[
            const SizedBox(width: 7),
            const SizedBox.square(
              dimension: 8,
              child: CircularProgressIndicator(strokeWidth: 1.3),
            ),
          ],
        ],
      ),
    );
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: isUser
          ? bubble
          : Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AgentAvatar(
                  initial: agent.initial,
                  color: Color(agent.colorValue),
                  size: 30,
                ),
                const SizedBox(width: 7),
                Flexible(child: bubble),
              ],
            ),
    );
  }
}

class _DigestCard extends StatelessWidget {
  const _DigestCard({required this.strings});

  final NewsStrings strings;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            child: Row(
              children: [
                const Icon(Icons.auto_awesome_rounded,
                    color: NewsPalette.primary, size: 17),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    strings.text('assistant.digest'),
                    style: const TextStyle(
                      color: NewsPalette.primary,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                const Text('08:31',
                    style: TextStyle(color: NewsPalette.muted, fontSize: 10)),
              ],
            ),
          ),
          const Divider(),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  strings.text('assistant.highImpact'),
                  style: const TextStyle(
                    color: NewsPalette.danger,
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  '公开市场操作节奏出现边际变化',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 6),
                const Text(
                  '连续三日净投放规模上升，短端资金价格回落。变化尚未构成政策转向。',
                  style: TextStyle(height: 1.5, fontSize: 12),
                ),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 12,
                  runSpacing: 6,
                  children: [
                    _Evidence(
                        icon: Icons.description_outlined,
                        label: strings.text('assistant.sources')),
                    _Evidence(
                        icon: Icons.verified_user_outlined,
                        label: strings.text('assistant.confidence')),
                    _Evidence(
                        icon: Icons.schedule_rounded,
                        label: strings.text('assistant.readingTime')),
                  ],
                ),
              ],
            ),
          ),
          const Divider(),
          Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () {},
                  child: Text(strings.text('assistant.followUp')),
                ),
                const SizedBox(width: 4),
                FilledButton(
                  onPressed: () {},
                  child: Text(strings.text('assistant.fullAnalysis')),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Evidence extends StatelessWidget {
  const _Evidence({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: NewsPalette.muted),
        const SizedBox(width: 3),
        Text(label,
            style: const TextStyle(color: NewsPalette.muted, fontSize: 10)),
      ],
    );
  }
}

class _ActionCard extends StatelessWidget {
  const _ActionCard({required this.strings});

  final NewsStrings strings;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        dense: true,
        leading: const Icon(Icons.notifications_active_outlined,
            color: NewsPalette.warning),
        title: Text(strings.text('assistant.action'),
            style: const TextStyle(fontWeight: FontWeight.w700)),
        subtitle: const Text('收盘后复核成交量与资金变化'),
        trailing: const Icon(Icons.chevron_right_rounded),
      ),
    );
  }
}

Future<void> _showCreateSheet(
  BuildContext context,
  AssistantController controller,
) async {
  final draft = await showModalBottomSheet<NewsAgentDraft>(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    builder: (_) => const _CreateAgentSheet(),
  );
  if (draft != null) {
    await controller.createAgent(draft);
  }
}

class _CreateAgentSheet extends StatefulWidget {
  const _CreateAgentSheet();

  @override
  State<_CreateAgentSheet> createState() => _CreateAgentSheetState();
}

class _CreateAgentSheetState extends State<_CreateAgentSheet> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _scope = TextEditingController();
  final _description = TextEditingController();

  @override
  void dispose() {
    _name.dispose();
    _scope.dispose();
    _description.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final strings = NewsStrings.of(context);
    return Padding(
      padding: EdgeInsets.fromLTRB(
        18,
        0,
        18,
        18 + MediaQuery.viewInsetsOf(context).bottom,
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(strings.text('assistant.create'),
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w800,
                    )),
            const SizedBox(height: 14),
            TextFormField(
              controller: _name,
              decoration: InputDecoration(
                labelText: strings.text('assistant.name'),
              ),
              validator: (value) => value == null || value.trim().length < 2
                  ? strings.text('assistant.name')
                  : null,
            ),
            const SizedBox(height: 10),
            TextFormField(
              controller: _scope,
              decoration: InputDecoration(
                labelText: strings.text('assistant.scope'),
              ),
              validator: (value) => value == null || value.trim().isEmpty
                  ? strings.text('assistant.scope')
                  : null,
            ),
            const SizedBox(height: 10),
            TextFormField(
              controller: _description,
              maxLines: 2,
              decoration: InputDecoration(
                labelText: strings.text('assistant.description'),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(strings.text('assistant.cancel')),
                ),
                const SizedBox(width: 8),
                FilledButton(
                  onPressed: () {
                    if (!_formKey.currentState!.validate()) {
                      return;
                    }
                    Navigator.pop(
                      context,
                      NewsAgentDraft(
                        name: _name.text.trim(),
                        description: _description.text.trim(),
                        scopes: [_scope.text.trim()],
                        schedule: const ReadingSchedule.standard(),
                      ),
                    );
                  },
                  child: Text(strings.text('assistant.createAction')),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

Future<void> _showProfileSheet(
  BuildContext context,
  AssistantController controller,
  NewsAgent agent,
) async {
  final updated = await showModalBottomSheet<NewsAgent>(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    builder: (_) => SafeArea(
      child: SingleChildScrollView(child: _ProfileSheet(agent: agent)),
    ),
  );
  if (updated != null) {
    await controller.saveProfile(updated);
  }
}

class _ProfileSheet extends StatefulWidget {
  const _ProfileSheet({required this.agent});

  final NewsAgent agent;

  @override
  State<_ProfileSheet> createState() => _ProfileSheetState();
}

class _ProfileSheetState extends State<_ProfileSheet> {
  late final TextEditingController _name =
      TextEditingController(text: widget.agent.name);
  late final TextEditingController _description =
      TextEditingController(text: widget.agent.description);
  late final TextEditingController _scopes =
      TextEditingController(text: widget.agent.scopes.join('、'));
  late final TextEditingController _trustedSources =
      TextEditingController(text: widget.agent.trustedSources.join('、'));
  late NewsAgentOutputStyle _outputStyle = widget.agent.outputStyle;
  late bool _enabled = widget.agent.schedule.enabled;
  late bool _trustedOnly = widget.agent.trustedSourcesOnly;
  late List<ReadingDailySlot> _daily = [...widget.agent.schedule.daily];
  late ReadingWeeklyRule _weekly = widget.agent.schedule.weekly;
  late ReadingMonthlyRule _monthly = widget.agent.schedule.monthly;

  @override
  void dispose() {
    _name.dispose();
    _description.dispose();
    _scopes.dispose();
    _trustedSources.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final strings = NewsStrings.of(context);
    final schedule = widget.agent.schedule.copyWith(
      daily: _daily,
      enabled: _enabled,
      monthly: _monthly,
      weekly: _weekly,
    );
    final profileIsValid =
        _name.text.trim().isNotEmpty && _description.text.trim().isNotEmpty;
    final scheduleIsValid = !_enabled ||
        _daily.any((slot) => slot.enabled) ||
        (_weekly.enabled && _weekly.weekdays.isNotEmpty) ||
        _monthly.enabled;
    return Padding(
      padding: const EdgeInsets.fromLTRB(18, 0, 18, 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(strings.text('assistant.settings'),
              style: Theme.of(context)
                  .textTheme
                  .titleLarge
                  ?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 3),
          Text(
            strings.text('assistant.settingsSubtitle'),
            style: Theme.of(context)
                .textTheme
                .bodySmall
                ?.copyWith(color: NewsPalette.muted),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _name,
            decoration: InputDecoration(
              labelText: strings.text('assistant.name'),
            ),
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _description,
            decoration: InputDecoration(
              labelText: strings.text('assistant.description'),
            ),
            maxLines: 2,
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _scopes,
            decoration: InputDecoration(
              labelText: strings.text('assistant.scope'),
              helperText: strings.text('assistant.listHint'),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _trustedSources,
            decoration: InputDecoration(
              labelText: strings.text('assistant.trustedSources'),
              helperText: strings.text('assistant.listHint'),
            ),
          ),
          const SizedBox(height: 10),
          DropdownButtonFormField<NewsAgentOutputStyle>(
            initialValue: _outputStyle,
            decoration: InputDecoration(
              labelText: strings.text('assistant.outputStyle'),
            ),
            items: [
              DropdownMenuItem(
                value: NewsAgentOutputStyle.brief,
                child: Text(strings.text('assistant.outputBrief')),
              ),
              DropdownMenuItem(
                value: NewsAgentOutputStyle.analytical,
                child: Text(strings.text('assistant.outputAnalytical')),
              ),
              DropdownMenuItem(
                value: NewsAgentOutputStyle.executive,
                child: Text(strings.text('assistant.outputExecutive')),
              ),
            ],
            onChanged: (value) {
              if (value != null) setState(() => _outputStyle = value);
            },
          ),
          const SizedBox(height: 18),
          Text(
            strings.text('assistant.schedule'),
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 10),
          _buildDailyEditor(context, strings),
          const Divider(height: 22),
          _buildWeeklyEditor(context, strings),
          const Divider(height: 22),
          _buildMonthlyEditor(context, strings),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(11),
            decoration: BoxDecoration(
              color: const Color(0xFF18251F),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Cron',
                  style: TextStyle(
                    color: Color(0xFF9ED9C6),
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 6),
                for (final expression in schedule.toCronExpressions())
                  Padding(
                    padding: const EdgeInsets.only(bottom: 3),
                    child: Text(
                      expression,
                      style: const TextStyle(
                        color: Colors.white,
                        fontFamily: 'monospace',
                        fontSize: 12,
                      ),
                    ),
                  ),
                if (schedule.toCronExpressions().isEmpty)
                  const Text(
                    '已暂停',
                    style: TextStyle(color: Colors.white70, fontSize: 12),
                  ),
              ],
            ),
          ),
          SwitchListTile.adaptive(
            contentPadding: EdgeInsets.zero,
            title: Text(strings.text('assistant.enabled')),
            subtitle:
                Text(strings.cronCount(schedule.toCronExpressions().length)),
            value: _enabled,
            onChanged: (value) => setState(() => _enabled = value),
          ),
          SwitchListTile.adaptive(
            contentPadding: EdgeInsets.zero,
            title: Text(strings.text('assistant.trustedOnly')),
            subtitle: Text(strings.text('assistant.trustedOnlyHint')),
            value: _trustedOnly,
            onChanged: (value) => setState(() => _trustedOnly = value),
          ),
          const SizedBox(height: 8),
          FilledButton(
            onPressed: profileIsValid && scheduleIsValid
                ? () => Navigator.pop(
                      context,
                      widget.agent.copyWith(
                        name: _name.text.trim(),
                        description: _description.text.trim(),
                        scopes: _parseProfileList(_scopes.text),
                        trustedSources:
                            _parseProfileList(_trustedSources.text),
                        outputStyle: _outputStyle,
                        schedule: schedule,
                        trustedSourcesOnly: _trustedOnly,
                      ),
                    )
                : null,
            child: Text(strings.text('assistant.save')),
          ),
        ],
      ),
    );
  }

  Widget _buildDailyEditor(BuildContext context, NewsStrings strings) {
    return Column(
      children: [
        SwitchListTile.adaptive(
          contentPadding: EdgeInsets.zero,
          title: Text(strings.text('assistant.daily')),
          subtitle: Text(strings.text('assistant.dailyHint')),
          value: _daily.any((slot) => slot.enabled),
          onChanged: (enabled) => setState(
            () => _daily = [
              for (final slot in _daily) slot.copyWith(enabled: enabled),
            ],
          ),
        ),
        for (var index = 0; index < _daily.length; index += 1)
          _TimeRow(
            label: strings
                .text('assistant.dailySlot')
                .replaceAll('{index}', '${index + 1}'),
            time: TimeOfDay(
              hour: _daily[index].hour,
              minute: _daily[index].minute,
            ),
            onTap: () => _pickDailyTime(context, index),
            onDelete: _daily.length > 1
                ? () => setState(
                      () => _daily = [
                        for (var itemIndex = 0;
                            itemIndex < _daily.length;
                            itemIndex += 1)
                          if (itemIndex != index) _daily[itemIndex],
                      ],
                    )
                : null,
          ),
        if (_daily.length < 4)
          Align(
            alignment: Alignment.centerLeft,
            child: TextButton.icon(
              onPressed: () => setState(
                () => _daily = [
                  ..._daily,
                  ReadingDailySlot(
                    id: 'daily-${_daily.length + 1}',
                    hour: 18,
                    minute: 0,
                  ),
                ],
              ),
              icon: const Icon(Icons.add_rounded, size: 18),
              label: Text(strings.text('assistant.addDailySlot')),
            ),
          ),
      ],
    );
  }

  Widget _buildWeeklyEditor(BuildContext context, NewsStrings strings) {
    final weekdayLabels = MaterialLocalizations.of(context).narrowWeekdays;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SwitchListTile.adaptive(
          contentPadding: EdgeInsets.zero,
          title: Text(strings.text('assistant.weekly')),
          subtitle: Text(strings.text('assistant.weeklyHint')),
          value: _weekly.enabled,
          onChanged: (value) =>
              setState(() => _weekly = _weekly.copyWith(enabled: value)),
        ),
        Wrap(
          spacing: 6,
          runSpacing: 6,
          children: [
            for (var day = DateTime.monday;
                day <= DateTime.sunday;
                day += 1)
              FilterChip(
                label: Text(
                  day == DateTime.sunday
                      ? weekdayLabels.first
                      : weekdayLabels[day],
                ),
                selected: _weekly.weekdays.contains(day),
                onSelected: (selected) => setState(() {
                  final weekdays = selected
                      ? {..._weekly.weekdays, day}.toList()
                      : _weekly.weekdays.where((item) => item != day).toList();
                  weekdays.sort();
                  _weekly = _weekly.copyWith(weekdays: weekdays);
                }),
              ),
          ],
        ),
        _TimeRow(
          label: strings.text('assistant.summaryTime'),
          time: TimeOfDay(hour: _weekly.hour, minute: _weekly.minute),
          onTap: () => _pickWeeklyTime(context),
        ),
      ],
    );
  }

  Widget _buildMonthlyEditor(BuildContext context, NewsStrings strings) {
    return Column(
      children: [
        SwitchListTile.adaptive(
          contentPadding: EdgeInsets.zero,
          title: Text(strings.text('assistant.monthly')),
          subtitle: Text(strings.text('assistant.monthlyHint')),
          value: _monthly.enabled,
          onChanged: (value) =>
              setState(() => _monthly = _monthly.copyWith(enabled: value)),
        ),
        DropdownButtonFormField<int>(
          initialValue: _monthly.day,
          decoration: InputDecoration(
            labelText: strings.text('assistant.monthlyDay'),
            prefixIcon: const Icon(Icons.event_outlined),
          ),
          items: [
            for (var day = 1; day <= 28; day += 1)
              DropdownMenuItem(value: day, child: Text('$day')),
          ],
          onChanged: (value) {
            if (value != null) {
              setState(() => _monthly = _monthly.copyWith(day: value));
            }
          },
        ),
        const SizedBox(height: 8),
        _TimeRow(
          label: strings.text('assistant.reviewTime'),
          time: TimeOfDay(hour: _monthly.hour, minute: _monthly.minute),
          onTap: () => _pickMonthlyTime(context),
        ),
      ],
    );
  }

  Future<void> _pickDailyTime(BuildContext context, int index) async {
    final current = _daily[index];
    final value = await showTimePicker(
      context: context,
      initialTime: TimeOfDay(hour: current.hour, minute: current.minute),
    );
    if (value != null) {
      setState(() {
        _daily = [
          for (var itemIndex = 0; itemIndex < _daily.length; itemIndex += 1)
            itemIndex == index
                ? current.copyWith(hour: value.hour, minute: value.minute)
                : _daily[itemIndex],
        ];
      });
    }
  }

  Future<void> _pickWeeklyTime(BuildContext context) async {
    final value = await showTimePicker(
      context: context,
      initialTime: TimeOfDay(hour: _weekly.hour, minute: _weekly.minute),
    );
    if (value != null) {
      setState(() => _weekly =
          _weekly.copyWith(hour: value.hour, minute: value.minute));
    }
  }

  Future<void> _pickMonthlyTime(BuildContext context) async {
    final value = await showTimePicker(
      context: context,
      initialTime: TimeOfDay(hour: _monthly.hour, minute: _monthly.minute),
    );
    if (value != null) {
      setState(() => _monthly =
          _monthly.copyWith(hour: value.hour, minute: value.minute));
    }
  }
}

List<String> _parseProfileList(String value) {
  return value
      .split(RegExp(r'[,，、\n]'))
      .map((item) => item.trim())
      .where((item) => item.isNotEmpty)
      .toSet()
      .toList(growable: false);
}

class _TimeRow extends StatelessWidget {
  const _TimeRow({
    required this.label,
    required this.time,
    required this.onTap,
    this.onDelete,
  });

  final String label;
  final TimeOfDay time;
  final VoidCallback onTap;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: const Icon(Icons.schedule_outlined),
      title: Text(label),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextButton(onPressed: onTap, child: Text(time.format(context))),
          if (onDelete != null)
            IconButton(
              tooltip: '删除时段',
              onPressed: onDelete,
              icon: const Icon(Icons.close_rounded, size: 18),
            ),
        ],
      ),
      onTap: onTap,
    );
  }
}
