# Component Specs

This directory defines the local contract for `@sdkwork/news-agent-bootstrap`.

Browser roots import `./config` eagerly and load `./runtime` on demand. The runtime composes the Agents app SDK and SDKWork IM SDK with the single root `AuthTokenManager`, then exposes `NewsAgentService` to Assistant features.
