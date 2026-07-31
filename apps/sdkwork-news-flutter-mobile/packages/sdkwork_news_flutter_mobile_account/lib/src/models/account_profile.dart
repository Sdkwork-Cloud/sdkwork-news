class AccountProfile {
  const AccountProfile({
    required this.displayName,
    required this.email,
    required this.initial,
    required this.planProgress,
    required this.favoriteCount,
    required this.historyCount,
    required this.offlineCount,
  });

  final String displayName;
  final String email;
  final String initial;
  final double planProgress;
  final int favoriteCount;
  final int historyCount;
  final int offlineCount;
}
