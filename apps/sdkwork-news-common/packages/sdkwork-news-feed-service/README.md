# @sdkwork/news-feed-service

Cross-architecture news feed service for PC and H5 clients. Consumers inject `NewsFeedPort`; runtime composition owns the concrete SDK adapter and TokenManager.

Verification: `pnpm --filter @sdkwork/news-feed-service test` and `pnpm --filter @sdkwork/news-feed-service typecheck`.
