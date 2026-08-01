# Component Specs

This directory defines the local component contract for `@sdkwork/news-feed-react`.

- Component root: `sdkwork-news/apps/sdkwork-news-common/packages/sdkwork-news-feed-react`
- Canonical standards: `../../../../../sdkwork-specs/README.md`
- Machine-readable contract: `specs/component.spec.json`

The controller owns cross-surface feed request state. It receives `NewsFeedService` through injection and never constructs or imports an SDK client.
