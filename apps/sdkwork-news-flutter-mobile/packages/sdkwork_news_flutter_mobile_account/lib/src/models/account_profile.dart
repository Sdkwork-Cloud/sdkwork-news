class AccountProfile {
  const AccountProfile({
    required this.displayName,
    required this.initial,
    this.email,
    this.planProgress,
    this.favoriteCount,
    this.historyCount,
    this.offlineCount,
  });

  final String displayName;
  final String? email;
  final String initial;
  final double? planProgress;
  final int? favoriteCount;
  final int? historyCount;
  final int? offlineCount;
}
