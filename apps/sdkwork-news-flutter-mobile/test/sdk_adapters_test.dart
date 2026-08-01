import 'package:flutter_test/flutter_test.dart';
import 'package:sdkwork_news_flutter_mobile_ai_store/sdkwork_news_flutter_mobile_ai_store.dart';
import 'package:sdkwork_news_flutter_mobile_iam_sdk_adapter/sdkwork_news_flutter_mobile_iam_sdk_adapter.dart';
import 'package:sdkwork_news_flutter_mobile_mcp_sdk_adapter/sdkwork_news_flutter_mobile_mcp_sdk_adapter.dart';

void main() {
  test('MCP adapter maps a dependency-owned catalog page', () async {
    final repository = McpAiStoreRepository(
      _McpGateway(
        const McpCatalogPage(
          items: [
            McpCatalogRecord(
              id: 'server-1',
              key: 'knowledge-search',
              name: 'Knowledge Search',
              description: 'Search approved knowledge sources',
              categoryCode: 'knowledge',
              transport: 'streamable-http',
              lifecycleStatus: 'published',
              healthStatus: 'healthy',
            ),
          ],
          hasMore: true,
          nextCursor: 'next-page',
        ),
      ),
    );

    final page = await repository.list(kind: AiStoreKind.mcp, pageSize: 20);

    expect(page.items.single.id, 'server-1');
    expect(page.items.single.name, 'Knowledge Search');
    expect(page.items.single.publisher, 'knowledge');
    expect(page.items.single.installable, isFalse);
    expect(page.hasMore, isTrue);
    expect(page.nextCursor, 'next-page');
    expect(
      () => repository.list(kind: AiStoreKind.product),
      throwsA(isA<AiStoreCapabilityUnavailable>()),
    );
  });

  test('IAM adapter exposes identity without inventing account metrics',
      () async {
    final repository = IamAccountRepository(
      const _IamGateway(
        IamCurrentUser(
          displayName: '林然',
          email: 'linran@example.test',
        ),
      ),
    );

    final profile = await repository.currentProfile();

    expect(profile.displayName, '林然');
    expect(profile.initial, '林');
    expect(profile.email, 'linran@example.test');
    expect(profile.planProgress, isNull);
    expect(profile.favoriteCount, isNull);
  });
}

class _McpGateway implements McpCatalogGateway {
  const _McpGateway(this.page);

  final McpCatalogPage page;

  @override
  Future<McpCatalogPage> listServers({
    String? cursor,
    int pageSize = 20,
  }) async =>
      page;
}

class _IamGateway implements IamCurrentUserGateway {
  const _IamGateway(this.user);

  final IamCurrentUser user;

  @override
  Future<IamCurrentUser> retrieve() async => user;
}
