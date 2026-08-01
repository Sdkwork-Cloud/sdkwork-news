import 'package:sdkwork_iam_app_sdk/sdkwork_iam_app_sdk.dart' as iam_sdk;
import 'package:sdkwork_news_flutter_mobile_account/sdkwork_news_flutter_mobile_account.dart';

class IamCurrentUser {
  const IamCurrentUser({
    required this.displayName,
    this.email,
  });

  final String displayName;
  final String? email;
}

abstract interface class IamCurrentUserGateway {
  Future<IamCurrentUser> retrieve();

  Future<void> updateDisplayName(String displayName);
}

class SdkworkIamCurrentUserGateway implements IamCurrentUserGateway {
  SdkworkIamCurrentUserGateway(this._client);

  final iam_sdk.SdkworkAppClient _client;

  @override
  Future<IamCurrentUser> retrieve() async {
    final response = await _client.iam.usersCurrentRetrieve();
    if (response == null || response.code != 0) {
      throw const FormatException('IAM SDK response is missing success data');
    }
    final data = _asMap(response.data);
    final item = _asMap(data?['item']) ?? data;
    if (item == null) {
      throw const FormatException('IAM SDK response is missing data.item');
    }
    final profile = _asMap(item['profile']);
    final displayName = _firstNonEmpty([
      profile?['displayName'],
      profile?['display_name'],
      profile?['nickname'],
      item['displayName'],
      item['display_name'],
      item['nickname'],
      item['name'],
      item['username'],
    ]);
    final email = _firstNonEmpty([
      profile?['email'],
      item['email'],
      item['primaryEmail'],
      item['primary_email'],
    ]);
    final resolvedName = displayName ?? email?.split('@').first;
    if (resolvedName == null || resolvedName.isEmpty) {
      throw const FormatException(
        'IAM current-user response has no display identity',
      );
    }
    return IamCurrentUser(displayName: resolvedName, email: email);
  }

  @override
  Future<void> updateDisplayName(String displayName) async {
    final response = await _client.iam.usersCurrentUpdate({
      'displayName': displayName,
    });
    if (response == null || response.code != 0) {
      throw const FormatException('IAM SDK response is missing success data');
    }
  }
}

class IamAccountRepository implements AccountRepository {
  IamAccountRepository(this._gateway);

  final IamCurrentUserGateway _gateway;

  @override
  Future<AccountProfile> currentProfile() async {
    final user = await _gateway.retrieve();
    return AccountProfile(
      displayName: user.displayName,
      email: user.email,
      initial: _initial(user.displayName),
    );
  }

  @override
  Future<AccountProfile> updateDisplayName(String displayName) async {
    final normalized = displayName.trim();
    if (normalized.isEmpty) {
      throw const FormatException('displayName is required');
    }
    await _gateway.updateDisplayName(normalized);
    return currentProfile();
  }
}

String _initial(String value) {
  final trimmed = value.trim();
  return trimmed.isEmpty ? 'U' : String.fromCharCode(trimmed.runes.first);
}

String? _firstNonEmpty(Iterable<dynamic> values) {
  for (final value in values) {
    final text = value?.toString().trim();
    if (text != null && text.isNotEmpty) {
      return text;
    }
  }
  return null;
}

Map<String, dynamic>? _asMap(dynamic value) {
  if (value is Map<String, dynamic>) {
    return value;
  }
  if (value is Map) {
    return value.map((key, item) => MapEntry('$key', item));
  }
  return null;
}
