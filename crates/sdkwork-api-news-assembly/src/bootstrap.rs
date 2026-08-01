//! Gateway bootstrap for sdkwork-news.

use std::sync::Arc;

use axum::Router;
use sdkwork_routes_news_open_api::state::NewsHttpState;
use sdkwork_web_bootstrap::{ApiAssemblyContribution, PgPoolReadinessCheck, ReadinessCheck};
use sdkwork_web_core::HttpRouteManifest;

pub type ApiAssembly = ApiAssemblyContribution;

fn assemble_business_routes(state: Arc<NewsHttpState>) -> Router {
    Router::new()
        .merge(sdkwork_routes_news_open_api::gateway_mount(state.clone()))
        .merge(sdkwork_routes_news_app_api::gateway_mount(state.clone()))
        .merge(sdkwork_routes_news_backend_api::gateway_mount(state))
}

/// Assemble the news application router from environment variables.
///
/// This function prepares the authoritative News PostgreSQL database through
/// the lifecycle host and creates the HTTP state.
pub async fn assemble_api_router() -> Result<ApiAssembly, String> {
    let host = sdkwork_news_database_host::bootstrap_news_database_from_env().await?;
    let postgres_pool = host
        .pool()
        .as_postgres()
        .ok_or_else(|| "News authoritative server requires PostgreSQL".to_string())?
        .clone();
    let state = Arc::new(NewsHttpState {
        pool: postgres_pool.clone(),
    });
    build_api_contribution(
        assemble_business_routes(state),
        Arc::new(PgPoolReadinessCheck::new(postgres_pool)),
    )
}

fn build_api_contribution(
    router: Router,
    readiness_check: Arc<dyn ReadinessCheck>,
) -> Result<ApiAssembly, String> {
    ApiAssemblyContribution::from_openapi_documents(
        "sdkwork-news",
        "SDKWork News API",
        router,
        build_route_manifest(),
        openapi_documents()?,
        Vec::new(),
        readiness_check,
    )
}

fn build_route_manifest() -> HttpRouteManifest {
    let manifests = [
        sdkwork_routes_news_app_api::gateway_route_manifest(),
        sdkwork_routes_news_backend_api::gateway_route_manifest(),
        sdkwork_routes_news_open_api::gateway_route_manifest(),
    ];
    HttpRouteManifest::from_owned_routes(
        manifests
            .into_iter()
            .flat_map(|manifest| manifest.routes().to_vec())
            .collect(),
    )
}

fn openapi_documents() -> Result<Vec<serde_json::Value>, String> {
    [
        (
            "sdkwork-news-app-api",
            include_str!("../../../apis/app-api/content/news-app-api.openapi.json"),
        ),
        (
            "sdkwork-news-backend-api",
            include_str!("../../../apis/backend-api/content/news-backend-api.openapi.json"),
        ),
        (
            "sdkwork-news-open-api",
            include_str!("../../../apis/open-api/content/news-open-api.openapi.json"),
        ),
    ]
    .into_iter()
    .map(|(owner, source)| {
        serde_json::from_str(source).map_err(|error| format!("invalid {owner} OpenAPI: {error}"))
    })
    .collect()
}

#[cfg(test)]
mod tests {
    use std::collections::BTreeSet;

    use super::*;

    #[test]
    fn composes_indivisible_news_api_contract() {
        let route_manifest = build_route_manifest();
        let documents = openapi_documents().expect("authored OpenAPI documents parse");
        let manifest_inventory = route_manifest
            .routes()
            .iter()
            .map(|route| {
                (
                    method_name(route.method).to_owned(),
                    route.path.to_owned(),
                    route.operation_id.to_owned(),
                )
            })
            .collect::<BTreeSet<_>>();
        let openapi_inventory = documents
            .iter()
            .flat_map(|document| {
                document["paths"]
                    .as_object()
                    .into_iter()
                    .flat_map(|paths| paths.iter())
                    .flat_map(|(path, item)| {
                        item.as_object().into_iter().flat_map(move |operations| {
                            operations.iter().filter_map(move |(method, operation)| {
                                operation["operationId"].as_str().map(|operation_id| {
                                    (method.clone(), path.clone(), operation_id.to_owned())
                                })
                            })
                        })
                    })
            })
            .collect::<BTreeSet<_>>();
        let missing = openapi_inventory
            .difference(&manifest_inventory)
            .cloned()
            .collect::<Vec<_>>();
        let extra = manifest_inventory
            .difference(&openapi_inventory)
            .cloned()
            .collect::<Vec<_>>();
        assert!(
            missing.is_empty() && extra.is_empty(),
            "news API inventory drift; missing={missing:?}; extra={extra:?}"
        );

        let contribution =
            build_api_contribution(Router::new(), Arc::new(sdkwork_web_bootstrap::AlwaysReady))
                .expect("news route manifests and authored OpenAPI must agree");

        assert!(!contribution.route_manifest.routes().is_empty());
        contribution.validate().expect("news contribution is valid");
    }

    fn method_name(method: sdkwork_web_core::HttpMethod) -> &'static str {
        match method {
            sdkwork_web_core::HttpMethod::Delete => "delete",
            sdkwork_web_core::HttpMethod::Get => "get",
            sdkwork_web_core::HttpMethod::Patch => "patch",
            sdkwork_web_core::HttpMethod::Post => "post",
            sdkwork_web_core::HttpMethod::Put => "put",
        }
    }
}
