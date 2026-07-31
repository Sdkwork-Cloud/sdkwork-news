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
                  tooltip: strings.text('assistant.schedule'),
                  onPressed: () => _showScheduleSheet(
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
                        schedule: const ReadingSchedule(
                          cadence: ReadingCadence.daily,
                          hour: 8,
                          minute: 30,
                        ),
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

Future<void> _showScheduleSheet(
  BuildContext context,
  AssistantController controller,
  NewsAgent agent,
) async {
  final updated = await showModalBottomSheet<NewsAgent>(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    builder: (_) => _ScheduleSheet(agent: agent),
  );
  if (updated != null) {
    await controller.saveSchedule(updated);
  }
}

class _ScheduleSheet extends StatefulWidget {
  const _ScheduleSheet({required this.agent});

  final NewsAgent agent;

  @override
  State<_ScheduleSheet> createState() => _ScheduleSheetState();
}

class _ScheduleSheetState extends State<_ScheduleSheet> {
  late ReadingCadence _cadence = widget.agent.schedule.cadence;
  late bool _enabled = widget.agent.schedule.enabled;
  late bool _trustedOnly = widget.agent.trustedSourcesOnly;

  @override
  Widget build(BuildContext context) {
    final strings = NewsStrings.of(context);
    final schedule = widget.agent.schedule.copyWith(
      cadence: _cadence,
      enabled: _enabled,
    );
    return Padding(
      padding: const EdgeInsets.fromLTRB(18, 0, 18, 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(strings.text('assistant.schedule'),
              style: Theme.of(context)
                  .textTheme
                  .titleLarge
                  ?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 3),
          Text(
            strings.text('assistant.scheduleSubtitle'),
            style: Theme.of(context)
                .textTheme
                .bodySmall
                ?.copyWith(color: NewsPalette.muted),
          ),
          const SizedBox(height: 16),
          SegmentedButton<ReadingCadence>(
            segments: [
              ButtonSegment(
                value: ReadingCadence.daily,
                label: Text(strings.text('assistant.daily')),
              ),
              ButtonSegment(
                value: ReadingCadence.weekly,
                label: Text(strings.text('assistant.weekly')),
              ),
              ButtonSegment(
                value: ReadingCadence.monthly,
                label: Text(strings.text('assistant.monthly')),
              ),
            ],
            selected: {_cadence},
            onSelectionChanged: (selection) {
              setState(() => _cadence = selection.single);
            },
          ),
          const SizedBox(height: 12),
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
            onPressed: () => Navigator.pop(
              context,
              widget.agent.copyWith(
                schedule: schedule,
                trustedSourcesOnly: _trustedOnly,
              ),
            ),
            child: Text(strings.text('assistant.save')),
          ),
        ],
      ),
    );
  }
}
