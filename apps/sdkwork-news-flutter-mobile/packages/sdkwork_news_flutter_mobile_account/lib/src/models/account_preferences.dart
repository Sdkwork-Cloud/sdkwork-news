enum AccountAppearance { system, light, dark }

class AccountContentItem {
  const AccountContentItem({
    required this.id,
    required this.title,
    required this.source,
    required this.meta,
  });

  final String id;
  final String title;
  final String source;
  final String meta;

  factory AccountContentItem.fromJson(Map<String, dynamic> json) =>
      AccountContentItem(
        id: json['id']?.toString() ?? '',
        title: json['title']?.toString() ?? '',
        source: json['source']?.toString() ?? '',
        meta: json['meta']?.toString() ?? '',
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'source': source,
        'meta': meta,
      };
}

class AccountDevice {
  const AccountDevice({
    required this.id,
    required this.name,
    required this.location,
    required this.lastActive,
    this.current = false,
  });

  final String id;
  final String name;
  final String location;
  final String lastActive;
  final bool current;

  factory AccountDevice.fromJson(Map<String, dynamic> json) => AccountDevice(
        id: json['id']?.toString() ?? '',
        name: json['name']?.toString() ?? '',
        location: json['location']?.toString() ?? '',
        lastActive: json['lastActive']?.toString() ?? '',
        current: json['current'] == true,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'location': location,
        'lastActive': lastActive,
        'current': current,
      };
}

class AccountPreferences {
  const AccountPreferences({
    this.localeTag = 'zh-CN',
    this.appearance = AccountAppearance.system,
    this.notificationsEnabled = true,
    this.breakingNews = true,
    this.agentDigests = true,
    this.quietHours = false,
    this.offlineWifiOnly = true,
    this.personalizedNews = true,
    this.agentLearning = true,
    this.analytics = false,
    this.savedItems = const <AccountContentItem>[],
    this.historyItems = const <AccountContentItem>[],
    this.offlineItems = const <AccountContentItem>[],
    this.devices = const <AccountDevice>[],
  });

  const AccountPreferences.demo()
      : this(
          savedItems: demoSavedItems,
          historyItems: demoHistoryItems,
          offlineItems: demoOfflineItems,
          devices: demoDevices,
        );

  final String localeTag;
  final AccountAppearance appearance;
  final bool notificationsEnabled;
  final bool breakingNews;
  final bool agentDigests;
  final bool quietHours;
  final bool offlineWifiOnly;
  final bool personalizedNews;
  final bool agentLearning;
  final bool analytics;
  final List<AccountContentItem> savedItems;
  final List<AccountContentItem> historyItems;
  final List<AccountContentItem> offlineItems;
  final List<AccountDevice> devices;

  AccountPreferences copyWith({
    String? localeTag,
    AccountAppearance? appearance,
    bool? notificationsEnabled,
    bool? breakingNews,
    bool? agentDigests,
    bool? quietHours,
    bool? offlineWifiOnly,
    bool? personalizedNews,
    bool? agentLearning,
    bool? analytics,
    List<AccountContentItem>? savedItems,
    List<AccountContentItem>? historyItems,
    List<AccountContentItem>? offlineItems,
    List<AccountDevice>? devices,
  }) =>
      AccountPreferences(
        localeTag: localeTag ?? this.localeTag,
        appearance: appearance ?? this.appearance,
        notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
        breakingNews: breakingNews ?? this.breakingNews,
        agentDigests: agentDigests ?? this.agentDigests,
        quietHours: quietHours ?? this.quietHours,
        offlineWifiOnly: offlineWifiOnly ?? this.offlineWifiOnly,
        personalizedNews: personalizedNews ?? this.personalizedNews,
        agentLearning: agentLearning ?? this.agentLearning,
        analytics: analytics ?? this.analytics,
        savedItems: List.unmodifiable(savedItems ?? this.savedItems),
        historyItems: List.unmodifiable(historyItems ?? this.historyItems),
        offlineItems: List.unmodifiable(offlineItems ?? this.offlineItems),
        devices: List.unmodifiable(devices ?? this.devices),
      );

  factory AccountPreferences.fromJson(Map<String, dynamic> json) =>
      AccountPreferences(
        localeTag: json['localeTag']?.toString() ?? 'zh-CN',
        appearance: AccountAppearance.values.firstWhere(
          (value) => value.name == json['appearance'],
          orElse: () => AccountAppearance.system,
        ),
        notificationsEnabled: json['notificationsEnabled'] != false,
        breakingNews: json['breakingNews'] != false,
        agentDigests: json['agentDigests'] != false,
        quietHours: json['quietHours'] == true,
        offlineWifiOnly: json['offlineWifiOnly'] != false,
        personalizedNews: json['personalizedNews'] != false,
        agentLearning: json['agentLearning'] != false,
        analytics: json['analytics'] == true,
        savedItems: _items(json['savedItems'], const []),
        historyItems: _items(json['historyItems'], const []),
        offlineItems: _items(json['offlineItems'], const []),
        devices: _devices(json['devices']),
      );

  Map<String, dynamic> toJson() => {
        'localeTag': localeTag,
        'appearance': appearance.name,
        'notificationsEnabled': notificationsEnabled,
        'breakingNews': breakingNews,
        'agentDigests': agentDigests,
        'quietHours': quietHours,
        'offlineWifiOnly': offlineWifiOnly,
        'personalizedNews': personalizedNews,
        'agentLearning': agentLearning,
        'analytics': analytics,
        'savedItems': savedItems.map((item) => item.toJson()).toList(),
        'historyItems': historyItems.map((item) => item.toJson()).toList(),
        'offlineItems': offlineItems.map((item) => item.toJson()).toList(),
        'devices': devices.map((device) => device.toJson()).toList(),
      };
}

List<AccountContentItem> _items(
  dynamic value,
  List<AccountContentItem> fallback,
) {
  if (value is! List) return fallback;
  return List.unmodifiable(
    value.whereType<Map>().map((item) => AccountContentItem.fromJson(
          item.map((key, value) => MapEntry('$key', value)),
        )),
  );
}

List<AccountDevice> _devices(dynamic value) {
  if (value is! List) return const [];
  return List.unmodifiable(
    value.whereType<Map>().map(
          (item) => AccountDevice.fromJson(
            item.map((key, value) => MapEntry('$key', value)),
          ),
        ),
  );
}

const demoSavedItems = <AccountContentItem>[
  AccountContentItem(
    id: 'saved-agent-workflow',
    title: 'AI Agent 进入企业核心工作流',
    source: 'SDKWork News',
    meta: '今天 08:20',
  ),
  AccountContentItem(
    id: 'saved-policy',
    title: '政策工具组合出现新的边际变化',
    source: '政策观察',
    meta: '昨天 18:40',
  ),
];

const demoHistoryItems = <AccountContentItem>[
  ...demoSavedItems,
  AccountContentItem(
    id: 'history-supply-chain',
    title: '全球供应链继续区域化',
    source: '产业前沿',
    meta: '7 月 30 日',
  ),
];

const demoOfflineItems = <AccountContentItem>[
  AccountContentItem(
    id: 'offline-weekly',
    title: '本周智能体阅读摘要',
    source: '市场雷达',
    meta: '2.4 MB',
  ),
];

const demoDevices = <AccountDevice>[
  AccountDevice(
    id: 'current',
    name: '当前手机',
    location: '上海',
    lastActive: '当前在线',
    current: true,
  ),
  AccountDevice(
    id: 'desktop',
    name: 'Windows PC',
    location: '上海',
    lastActive: '2 小时前',
  ),
];
