import type {
  NewsApiSurface,
  SdkworkNewsChannel,
  SdkworkNewsCorrectionNotice,
  SdkworkNewsFactCheck,
  SdkworkNewsItem,
  SdkworkNewsLiveEvent,
  SdkworkNewsLiveUpdate,
  SdkworkNewsMediaResource,
  SdkworkNewsSourceTrustProfile,
  SdkworkNewsTopic,
} from "@sdkwork/news-contracts";

export interface SdkworkNewsSdkResponse<T> {
  readonly data: T;
}

export interface SdkworkNewsProfessionalPage<T> {
  readonly cursor?: string;
  readonly hasMore: boolean;
  readonly items: readonly T[];
  readonly limit: number;
}

export interface SdkworkNewsProfessionalListParams {
  readonly cursor?: string;
  readonly limit?: number;
  readonly q?: string;
  readonly status?: string;
}

export interface SdkworkNewsStory {
  readonly id: string;
  readonly slug: string;
  readonly status: "archived" | "draft" | "published" | "scheduled";
  readonly summary: string;
  readonly tenantId: string;
  readonly title: string;
}

export interface SdkworkNewsProfessionalAuthor {
  readonly displayName: string;
  readonly id: string;
  readonly status: string;
  readonly tenantId: string;
}

export interface SdkworkNewsStoryCommand {
  readonly slug?: string;
  readonly summary?: string;
  readonly title?: string;
}

export interface SdkworkNewsStoryTimeline {
  readonly id: string;
  readonly occurredAt: string;
  readonly storyId: string;
  readonly title: string;
}

export interface SdkworkNewsProfessionalJob {
  readonly id: string;
  readonly status: "completed" | "failed" | "pending" | "running";
}

export interface SdkworkNewsEditorialAssignment {
  readonly id: string;
  readonly status: "cancelled" | "done" | "open";
}

export interface SdkworkNewsReviewTask {
  readonly id: string;
  readonly status: "approved" | "changes_requested" | "open" | "rejected";
}

export interface SdkworkNewsApiOperationAudit {
  readonly id: string;
  readonly operationId: string;
  readonly occurredAt: string;
}

export interface SdkworkNewsProfessionalOpenSdkPort {
  readonly news: {
    readonly authors: {
      // TODO(news-sdk): bind generated open SDK authors.list and authors.retrieve methods.
      list(params?: SdkworkNewsProfessionalListParams): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsProfessionalAuthor>>>;
      retrieve(authorId: string): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalAuthor>>;
    };
    readonly items: {
      readonly c2paProvenance: {
        // TODO(news-sdk): bind generated open SDK items.c2paProvenance.retrieve.
        retrieve(itemId: string): Promise<SdkworkNewsSdkResponse<unknown>>;
      };
      readonly rights: {
        // TODO(news-sdk): bind generated open SDK items.rights.retrieve.
        retrieve(itemId: string): Promise<SdkworkNewsSdkResponse<unknown>>;
      };
      readonly schemaOrg: {
        // TODO(news-sdk): bind generated open SDK items.schemaOrg.retrieve.
        retrieve(itemId: string): Promise<SdkworkNewsSdkResponse<unknown>>;
      };
    };
    readonly sources: {
      // TODO(news-sdk): bind generated open SDK sources.list and sources.retrieve methods.
      list(params?: SdkworkNewsProfessionalListParams): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<unknown>>>;
      retrieve(sourceId: string): Promise<SdkworkNewsSdkResponse<unknown>>;
    };
    readonly stories: {
      // TODO(news-sdk): bind generated open SDK story package read methods.
      list(params?: SdkworkNewsProfessionalListParams): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsStory>>>;
      retrieve(storyId: string): Promise<SdkworkNewsSdkResponse<SdkworkNewsStory>>;
      readonly items: {
        list(storyId: string, params?: SdkworkNewsProfessionalListParams): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsItem>>>;
      };
      readonly timeline: {
        list(storyId: string, params?: SdkworkNewsProfessionalListParams): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsStoryTimeline>>>;
      };
    };
  };
}

export interface SdkworkNewsProfessionalAppSdkPort {
  readonly news: {
    readonly feed: {
      readonly following: {
        // TODO(news-sdk): bind generated app SDK feed.following.list.
        list(params?: SdkworkNewsProfessionalListParams): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsItem>>>;
      };
      readonly latest: {
        // TODO(news-sdk): bind generated app SDK feed.latest.list.
        list(params?: SdkworkNewsProfessionalListParams): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsItem>>>;
      };
      readonly local: {
        // TODO(news-sdk): bind generated app SDK feed.local.list.
        list(params?: SdkworkNewsProfessionalListParams): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsItem>>>;
      };
    };
    readonly items: {
      readonly readingProgress: {
        // TODO(news-sdk): bind generated app SDK items.readingProgress.upsert.
        upsert(itemId: string, body: unknown): Promise<SdkworkNewsSdkResponse<unknown>>;
      };
      readonly shareEvents: {
        // TODO(news-sdk): bind generated app SDK items.shareEvents.create.
        create(itemId: string, body: unknown): Promise<SdkworkNewsSdkResponse<unknown>>;
      };
    };
    readonly stories: {
      // TODO(news-sdk): bind generated app SDK story package read methods.
      list(params?: SdkworkNewsProfessionalListParams): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsStory>>>;
      retrieve(storyId: string): Promise<SdkworkNewsSdkResponse<SdkworkNewsStory>>;
      readonly items: {
        list(storyId: string, params?: SdkworkNewsProfessionalListParams): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsItem>>>;
      };
    };
  };
}

export interface SdkworkNewsProfessionalBackendSdkPort {
  readonly news: {
    readonly apiOperationAudits: {
      // TODO(news-sdk): bind generated backend SDK apiOperationAudits.list.
      list(params?: SdkworkNewsProfessionalListParams): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsApiOperationAudit>>>;
    };
    readonly editorial: {
      readonly assignments: {
        // TODO(news-sdk): bind generated backend SDK editorial.assignments.* methods.
        create(body: unknown): Promise<SdkworkNewsSdkResponse<SdkworkNewsEditorialAssignment>>;
        list(params?: SdkworkNewsProfessionalListParams): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsEditorialAssignment>>>;
        update(assignmentId: string, body: unknown): Promise<SdkworkNewsSdkResponse<SdkworkNewsEditorialAssignment>>;
      };
      readonly reviewTasks: {
        // TODO(news-sdk): bind generated backend SDK editorial.reviewTasks.* methods.
        list(params?: SdkworkNewsProfessionalListParams): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsReviewTask>>>;
        update(reviewTaskId: string, body: unknown): Promise<SdkworkNewsSdkResponse<SdkworkNewsReviewTask>>;
      };
    };
    readonly exports: {
      readonly ninjs: {
        // TODO(news-sdk): bind generated backend SDK exports.ninjs.create.
        create(body: unknown): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalJob>>;
      };
      readonly schemaOrg: {
        // TODO(news-sdk): bind generated backend SDK exports.schemaOrg.create.
        create(body: unknown): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalJob>>;
      };
    };
    readonly imports: {
      // TODO(news-sdk): bind generated backend SDK imports.retrieve.
      retrieve(importJobId: string): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalJob>>;
      readonly newsmlG2: {
        // TODO(news-sdk): bind generated backend SDK imports.newsmlG2.create.
        create(body: unknown): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalJob>>;
      };
      readonly ninjs: {
        // TODO(news-sdk): bind generated backend SDK imports.ninjs.create.
        create(body: unknown): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalJob>>;
      };
    };
    readonly items: {
      readonly bodyBlocks: {
        // TODO(news-sdk): bind generated backend SDK items.bodyBlocks.* methods.
        create(itemId: string, body: unknown): Promise<SdkworkNewsSdkResponse<unknown>>;
        update(itemId: string, blockId: string, body: unknown): Promise<SdkworkNewsSdkResponse<unknown>>;
      };
      readonly c2paProvenance: {
        // TODO(news-sdk): bind generated backend SDK items.c2paProvenance.upsert.
        upsert(itemId: string, body: unknown): Promise<SdkworkNewsSdkResponse<unknown>>;
      };
      readonly rights: {
        // TODO(news-sdk): bind generated backend SDK items.rights.upsert.
        upsert(itemId: string, body: unknown): Promise<SdkworkNewsSdkResponse<unknown>>;
      };
      readonly schemaOrg: {
        // TODO(news-sdk): bind generated backend SDK items.schemaOrg.rebuild.
        rebuild(itemId: string, body?: unknown): Promise<SdkworkNewsSdkResponse<unknown>>;
      };
    };
    readonly stories: {
      // TODO(news-sdk): bind generated backend SDK stories.* methods.
      archive(storyId: string, body?: unknown): Promise<SdkworkNewsSdkResponse<SdkworkNewsStory>>;
      create(body: SdkworkNewsStoryCommand): Promise<SdkworkNewsSdkResponse<SdkworkNewsStory>>;
      delete(storyId: string): Promise<SdkworkNewsSdkResponse<unknown>>;
      list(params?: SdkworkNewsProfessionalListParams): Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsStory>>>;
      publish(storyId: string, body?: unknown): Promise<SdkworkNewsSdkResponse<SdkworkNewsStory>>;
      retrieve(storyId: string): Promise<SdkworkNewsSdkResponse<SdkworkNewsStory>>;
      update(storyId: string, body: SdkworkNewsStoryCommand): Promise<SdkworkNewsSdkResponse<SdkworkNewsStory>>;
      readonly items: {
        attach(storyId: string, body: unknown): Promise<SdkworkNewsSdkResponse<unknown>>;
        delete(storyId: string, itemId: string): Promise<SdkworkNewsSdkResponse<unknown>>;
      };
      readonly timeline: {
        create(storyId: string, body: unknown): Promise<SdkworkNewsSdkResponse<SdkworkNewsStoryTimeline>>;
        update(storyId: string, timelineId: string, body: unknown): Promise<SdkworkNewsSdkResponse<SdkworkNewsStoryTimeline>>;
      };
    };
  };
}

export interface NewsProfessionalSdkPortMethodDefinition {
  readonly methodKey: string;
  readonly requestSchema?: string;
  readonly responseSchema: string;
  readonly surface: NewsApiSurface;
  readonly todo: string;
}

function method(surface: NewsApiSurface, methodKey: string, responseSchema: string, requestSchema?: string): NewsProfessionalSdkPortMethodDefinition {
  return {
    methodKey,
    requestSchema,
    responseSchema,
    surface,
    todo: `TODO(news-sdk): bind ${methodKey} to generated SDK output or approved composed facade.`,
  };
}

export const NEWS_PROFESSIONAL_SDK_PORT_METHODS: readonly NewsProfessionalSdkPortMethodDefinition[] = [
  method("open-api", "open.news.stories.list", "NewsStoryPage"),
  method("open-api", "open.news.stories.retrieve", "NewsStory"),
  method("open-api", "open.news.stories.items.list", "NewsItemPage"),
  method("open-api", "open.news.stories.timeline.list", "NewsStoryTimelineListResponse"),
  method("open-api", "open.news.sources.list", "NewsSourceListResponse"),
  method("open-api", "open.news.sources.retrieve", "NewsSource"),
  method("open-api", "open.news.authors.list", "NewsAuthorListResponse"),
  method("open-api", "open.news.authors.retrieve", "NewsAuthor"),
  method("open-api", "open.news.items.schemaOrg.retrieve", "NewsSchemaOrgProjection"),
  method("open-api", "open.news.items.rights.retrieve", "NewsItemRights"),
  method("open-api", "open.news.items.c2paProvenance.retrieve", "NewsC2paProvenance"),
  method("app-api", "app.news.feed.following.list", "NewsFeedPage"),
  method("app-api", "app.news.feed.latest.list", "NewsFeedPage"),
  method("app-api", "app.news.feed.local.list", "NewsFeedPage"),
  method("app-api", "app.news.stories.list", "NewsStoryPage"),
  method("app-api", "app.news.stories.retrieve", "NewsStory"),
  method("app-api", "app.news.stories.items.list", "NewsItemPage"),
  method("app-api", "app.news.items.shareEvents.create", "NewsApiResult", "NewsShareEventCommand"),
  method("app-api", "app.news.items.readingProgress.upsert", "NewsApiResult", "NewsReadingProgressCommand"),
  method("backend-api", "backend.news.stories.management.list", "NewsStoryPage"),
  method("backend-api", "backend.news.stories.create", "NewsStory", "NewsStoryCommand"),
  method("backend-api", "backend.news.stories.retrieve", "NewsStory"),
  method("backend-api", "backend.news.stories.update", "NewsStory", "NewsStoryCommand"),
  method("backend-api", "backend.news.stories.delete", "NewsApiResult"),
  method("backend-api", "backend.news.stories.publish", "NewsStory", "NewsGenericCommand"),
  method("backend-api", "backend.news.stories.archive", "NewsStory", "NewsGenericCommand"),
  method("backend-api", "backend.news.stories.items.attach", "NewsApiResult", "NewsStoryItemCommand"),
  method("backend-api", "backend.news.stories.items.delete", "NewsApiResult"),
  method("backend-api", "backend.news.stories.timeline.create", "NewsStoryTimeline", "NewsStoryTimelineCommand"),
  method("backend-api", "backend.news.stories.timeline.update", "NewsStoryTimeline", "NewsStoryTimelineCommand"),
  method("backend-api", "backend.news.editorial.assignments.list", "NewsEditorialAssignmentListResponse"),
  method("backend-api", "backend.news.editorial.assignments.create", "NewsEditorialAssignment", "NewsEditorialAssignmentCommand"),
  method("backend-api", "backend.news.editorial.assignments.update", "NewsEditorialAssignment", "NewsEditorialAssignmentCommand"),
  method("backend-api", "backend.news.editorial.reviewTasks.list", "NewsReviewTaskListResponse"),
  method("backend-api", "backend.news.editorial.reviewTasks.update", "NewsReviewTask", "NewsReviewTaskCommand"),
  method("backend-api", "backend.news.imports.ninjs.create", "NewsImportJob", "NewsImportCommand"),
  method("backend-api", "backend.news.imports.newsmlG2.create", "NewsImportJob", "NewsImportCommand"),
  method("backend-api", "backend.news.imports.retrieve", "NewsImportJob"),
  method("backend-api", "backend.news.exports.ninjs.create", "NewsExportJob", "NewsExportCommand"),
  method("backend-api", "backend.news.exports.schemaOrg.create", "NewsExportJob", "NewsExportCommand"),
  method("backend-api", "backend.news.items.c2paProvenance.upsert", "NewsC2paProvenance", "NewsC2paProvenanceCommand"),
  method("backend-api", "backend.news.items.rights.upsert", "NewsItemRights", "NewsItemRightsCommand"),
  method("backend-api", "backend.news.items.bodyBlocks.create", "NewsBodyBlock", "NewsBodyBlockCommand"),
  method("backend-api", "backend.news.items.bodyBlocks.update", "NewsBodyBlock", "NewsBodyBlockCommand"),
  method("backend-api", "backend.news.items.schemaOrg.rebuild", "NewsSchemaOrgProjection", "NewsGenericCommand"),
  method("backend-api", "backend.news.apiOperationAudits.list", "NewsApiOperationAuditPage"),
];

export interface NewsSdkPortImplementationChecklistItem {
  readonly methodGroup: string;
  readonly todo: string;
}

export function createNewsSdkPortImplementationChecklist(): readonly NewsSdkPortImplementationChecklistItem[] {
  return [
    { methodGroup: "open.news.stories", todo: "TODO(news-sdk): generate and bind open story package SDK methods." },
    { methodGroup: "open.news.items.schemaOrg", todo: "TODO(news-sdk): generate JSON-LD retrieval method and response schema." },
    { methodGroup: "app.news.feed", todo: "TODO(news-sdk): generate following, latest, and local feed app SDK methods." },
    { methodGroup: "app.news.items.shareEvents", todo: "TODO(news-sdk): implement idempotent share event app SDK method." },
    { methodGroup: "backend.news.stories", todo: "TODO(news-sdk): generate backend story management resource tree." },
    { methodGroup: "backend.news.editorial", todo: "TODO(news-sdk): generate editorial assignment and review task resources." },
    { methodGroup: "backend.news.imports", todo: "TODO(news-sdk): generate ninjs and NewsML-G2 import resources." },
    { methodGroup: "backend.news.exports", todo: "TODO(news-sdk): generate ninjs and schema.org export resources." },
    { methodGroup: "backend.news.items.provenance", todo: "TODO(news-sdk): generate C2PA and rights upsert resources." },
  ];
}

export type SdkworkNewsProfessionalSdkPorts = {
  readonly app?: SdkworkNewsProfessionalAppSdkPort;
  readonly backend?: SdkworkNewsProfessionalBackendSdkPort;
  readonly open?: SdkworkNewsProfessionalOpenSdkPort;
};

export type SdkworkNewsProfessionalReadModel =
  | SdkworkNewsProfessionalAuthor
  | SdkworkNewsChannel
  | SdkworkNewsCorrectionNotice
  | SdkworkNewsFactCheck
  | SdkworkNewsItem
  | SdkworkNewsLiveEvent
  | SdkworkNewsLiveUpdate
  | SdkworkNewsMediaResource
  | SdkworkNewsSourceTrustProfile
  | SdkworkNewsTopic
  | SdkworkNewsStory;

export class NewsProfessionalSdkPort {
  bind_open_sdk(client: unknown): SdkworkNewsProfessionalOpenSdkPort {
    return NewsProfessionalSdkPort.buildOpenPort(client);
  }

  bind_app_sdk(client: unknown): SdkworkNewsProfessionalAppSdkPort {
    return NewsProfessionalSdkPort.buildAppPort(client);
  }

  bind_backend_sdk(client: unknown): SdkworkNewsProfessionalBackendSdkPort {
    return NewsProfessionalSdkPort.buildBackendPort(client);
  }

  bindOpenSdk(client: unknown): SdkworkNewsProfessionalOpenSdkPort {
    return this.bind_open_sdk(client);
  }

  bindAppSdk(client: unknown): SdkworkNewsProfessionalAppSdkPort {
    return this.bind_app_sdk(client);
  }

  bindBackendSdk(client: unknown): SdkworkNewsProfessionalBackendSdkPort {
    return this.bind_backend_sdk(client);
  }

  private static resolveMethod(client: unknown, ...path: string[]): (...args: unknown[]) => Promise<unknown> {
    let current: unknown = client;
    for (const segment of path) {
      if (current === null || current === undefined) {
        return async (...args: unknown[]) => {
          throw new Error(`SDK method ${path.join(".")} not available: client segment "${segment}" is ${current === null ? "null" : "undefined"}.`);
        };
      }
      current = (current as Record<string, unknown>)[segment];
    }
    if (typeof current !== "function") {
      return async (...args: unknown[]) => {
        throw new Error(`SDK method ${path.join(".")} is not a function.`);
      };
    }
    return current as (...args: unknown[]) => Promise<unknown>;
  }

  private static buildOpenPort(client: unknown): SdkworkNewsProfessionalOpenSdkPort {
    const resolve = (...path: string[]) => NewsProfessionalSdkPort.resolveMethod(client, ...path);
    return {
      news: {
        authors: {
          list: async (params?) => resolve("news", "authors", "list")(params) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsProfessionalAuthor>>>,
          retrieve: async (authorId) => resolve("news", "authors", "retrieve")(authorId) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalAuthor>>,
        },
        items: {
          c2paProvenance: {
            retrieve: async (itemId) => resolve("news", "items", "c2paProvenance", "retrieve")(itemId) as Promise<SdkworkNewsSdkResponse<unknown>>,
          },
          rights: {
            retrieve: async (itemId) => resolve("news", "items", "rights", "retrieve")(itemId) as Promise<SdkworkNewsSdkResponse<unknown>>,
          },
          schemaOrg: {
            retrieve: async (itemId) => resolve("news", "items", "schemaOrg", "retrieve")(itemId) as Promise<SdkworkNewsSdkResponse<unknown>>,
          },
        },
        sources: {
          list: async (params?) => resolve("news", "sources", "list")(params) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<unknown>>>,
          retrieve: async (sourceId) => resolve("news", "sources", "retrieve")(sourceId) as Promise<SdkworkNewsSdkResponse<unknown>>,
        },
        stories: {
          list: async (params?) => resolve("news", "stories", "list")(params) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsStory>>>,
          retrieve: async (storyId) => resolve("news", "stories", "retrieve")(storyId) as Promise<SdkworkNewsSdkResponse<SdkworkNewsStory>>,
          items: {
            list: async (storyId, params?) => resolve("news", "stories", "items", "list")(storyId, params) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsItem>>>,
          },
          timeline: {
            list: async (storyId, params?) => resolve("news", "stories", "timeline", "list")(storyId, params) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsStoryTimeline>>>,
          },
        },
      },
    };
  }

  private static buildAppPort(client: unknown): SdkworkNewsProfessionalAppSdkPort {
    const resolve = (...path: string[]) => NewsProfessionalSdkPort.resolveMethod(client, ...path);
    return {
      news: {
        feed: {
          following: {
            list: async (params?) => resolve("news", "feed", "following", "list")(params) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsItem>>>,
          },
          latest: {
            list: async (params?) => resolve("news", "feed", "latest", "list")(params) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsItem>>>,
          },
          local: {
            list: async (params?) => resolve("news", "feed", "local", "list")(params) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsItem>>>,
          },
        },
        items: {
          readingProgress: {
            upsert: async (itemId, body) => resolve("news", "items", "readingProgress", "upsert")(itemId, body) as Promise<SdkworkNewsSdkResponse<unknown>>,
          },
          shareEvents: {
            create: async (itemId, body) => resolve("news", "items", "shareEvents", "create")(itemId, body) as Promise<SdkworkNewsSdkResponse<unknown>>,
          },
        },
        stories: {
          list: async (params?) => resolve("news", "stories", "list")(params) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsStory>>>,
          retrieve: async (storyId) => resolve("news", "stories", "retrieve")(storyId) as Promise<SdkworkNewsSdkResponse<SdkworkNewsStory>>,
          items: {
            list: async (storyId, params?) => resolve("news", "stories", "items", "list")(storyId, params) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsItem>>>,
          },
        },
      },
    };
  }

  private static buildBackendPort(client: unknown): SdkworkNewsProfessionalBackendSdkPort {
    const resolve = (...path: string[]) => NewsProfessionalSdkPort.resolveMethod(client, ...path);
    return {
      news: {
        apiOperationAudits: {
          list: async (params?) => resolve("news", "apiOperationAudits", "list")(params) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsApiOperationAudit>>>,
        },
        editorial: {
          assignments: {
            create: async (body) => resolve("news", "editorial", "assignments", "create")(body) as Promise<SdkworkNewsSdkResponse<SdkworkNewsEditorialAssignment>>,
            list: async (params?) => resolve("news", "editorial", "assignments", "list")(params) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsEditorialAssignment>>>,
            update: async (assignmentId, body) => resolve("news", "editorial", "assignments", "update")(assignmentId, body) as Promise<SdkworkNewsSdkResponse<SdkworkNewsEditorialAssignment>>,
          },
          reviewTasks: {
            list: async (params?) => resolve("news", "editorial", "reviewTasks", "list")(params) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsReviewTask>>>,
            update: async (reviewTaskId, body) => resolve("news", "editorial", "reviewTasks", "update")(reviewTaskId, body) as Promise<SdkworkNewsSdkResponse<SdkworkNewsReviewTask>>,
          },
        },
        exports: {
          ninjs: {
            create: async (body) => resolve("news", "exports", "ninjs", "create")(body) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalJob>>,
          },
          schemaOrg: {
            create: async (body) => resolve("news", "exports", "schemaOrg", "create")(body) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalJob>>,
          },
        },
        imports: {
          retrieve: async (importJobId) => resolve("news", "imports", "retrieve")(importJobId) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalJob>>,
          newsmlG2: {
            create: async (body) => resolve("news", "imports", "newsmlG2", "create")(body) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalJob>>,
          },
          ninjs: {
            create: async (body) => resolve("news", "imports", "ninjs", "create")(body) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalJob>>,
          },
        },
        items: {
          bodyBlocks: {
            create: async (itemId, body) => resolve("news", "items", "bodyBlocks", "create")(itemId, body) as Promise<SdkworkNewsSdkResponse<unknown>>,
            update: async (itemId, blockId, body) => resolve("news", "items", "bodyBlocks", "update")(itemId, blockId, body) as Promise<SdkworkNewsSdkResponse<unknown>>,
          },
          c2paProvenance: {
            upsert: async (itemId, body) => resolve("news", "items", "c2paProvenance", "upsert")(itemId, body) as Promise<SdkworkNewsSdkResponse<unknown>>,
          },
          rights: {
            upsert: async (itemId, body) => resolve("news", "items", "rights", "upsert")(itemId, body) as Promise<SdkworkNewsSdkResponse<unknown>>,
          },
          schemaOrg: {
            rebuild: async (itemId, body?) => resolve("news", "items", "schemaOrg", "rebuild")(itemId, body) as Promise<SdkworkNewsSdkResponse<unknown>>,
          },
        },
        stories: {
          archive: async (storyId, body?) => resolve("news", "stories", "archive")(storyId, body) as Promise<SdkworkNewsSdkResponse<SdkworkNewsStory>>,
          create: async (body) => resolve("news", "stories", "create")(body) as Promise<SdkworkNewsSdkResponse<SdkworkNewsStory>>,
          delete: async (storyId) => resolve("news", "stories", "delete")(storyId) as Promise<SdkworkNewsSdkResponse<unknown>>,
          list: async (params?) => resolve("news", "stories", "list")(params) as Promise<SdkworkNewsSdkResponse<SdkworkNewsProfessionalPage<SdkworkNewsStory>>>,
          publish: async (storyId, body?) => resolve("news", "stories", "publish")(storyId, body) as Promise<SdkworkNewsSdkResponse<SdkworkNewsStory>>,
          retrieve: async (storyId) => resolve("news", "stories", "retrieve")(storyId) as Promise<SdkworkNewsSdkResponse<SdkworkNewsStory>>,
          update: async (storyId, body) => resolve("news", "stories", "update")(storyId, body) as Promise<SdkworkNewsSdkResponse<SdkworkNewsStory>>,
          items: {
            attach: async (storyId, body) => resolve("news", "stories", "items", "attach")(storyId, body) as Promise<SdkworkNewsSdkResponse<unknown>>,
            delete: async (storyId, itemId) => resolve("news", "stories", "items", "delete")(storyId, itemId) as Promise<SdkworkNewsSdkResponse<unknown>>,
          },
          timeline: {
            create: async (storyId, body) => resolve("news", "stories", "timeline", "create")(storyId, body) as Promise<SdkworkNewsSdkResponse<SdkworkNewsStoryTimeline>>,
            update: async (storyId, timelineId, body) => resolve("news", "stories", "timeline", "update")(storyId, timelineId, body) as Promise<SdkworkNewsSdkResponse<SdkworkNewsStoryTimeline>>,
          },
        },
      },
    };
  }
}
