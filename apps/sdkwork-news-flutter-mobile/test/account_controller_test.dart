import 'package:flutter_test/flutter_test.dart';
import 'package:sdkwork_news_flutter_mobile_account/sdkwork_news_flutter_mobile_account.dart';

void main() {
  test('account preferences persist local settings and content mutations',
      () async {
    final preferencesRepository = MemoryAccountPreferencesRepository(
      const AccountPreferences.demo(),
    );
    final controller = AccountController(
      DemoAccountRepository(),
      preferencesRepository: preferencesRepository,
    );

    await controller.initialize();
    expect(controller.preferences.savedItems, isNotEmpty);
    expect(controller.preferences.notificationsEnabled, isTrue);

    await controller.updatePreferences(
      (current) => current.copyWith(
        notificationsEnabled: false,
        appearance: AccountAppearance.dark,
      ),
    );
    await controller.removeSavedItem(
      controller.preferences.savedItems.first.id,
    );

    final restored = await preferencesRepository.load();
    expect(restored.notificationsEnabled, isFalse);
    expect(restored.appearance, AccountAppearance.dark);
    expect(restored.savedItems, hasLength(1));
  });

  test('account profile update trims and publishes the latest identity',
      () async {
    final controller = AccountController(DemoAccountRepository());
    await controller.initialize();

    expect(await controller.updateDisplayName('  政策观察员  '), isTrue);
    expect(controller.profile?.displayName, '政策观察员');
    expect(controller.profile?.initial, '政');
    expect(controller.mutationMessage, 'account.profile.updated');
  });

  test('production preference defaults contain no demo content', () {
    const preferences = AccountPreferences();
    expect(preferences.savedItems, isEmpty);
    expect(preferences.historyItems, isEmpty);
    expect(preferences.offlineItems, isEmpty);
    expect(preferences.devices, isEmpty);

    final restored = AccountPreferences.fromJson(preferences.toJson());
    expect(restored.toJson(), preferences.toJson());
  });
}
