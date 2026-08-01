use std::collections::HashMap;
use std::sync::Mutex;

use async_trait::async_trait;
use sdkwork_content_news_service::{
    NewNewsC2paProvenance, NewNewsEditorialAssignment, NewNewsExportJob, NewNewsImportJob,
    NewNewsItemRights, NewNewsReviewTask, NewNewsStory, NewNewsStoryItem,
    NewsProfessionalRepositoryPort, NewsRepositoryResult, NewsStoredStory,
};

#[derive(Default)]
pub struct MemoryNewsProfessionalRepository {
    stories: Mutex<HashMap<(String, String), NewsStoredStory>>,
}

pub async fn create_test_repo() -> MemoryNewsProfessionalRepository {
    MemoryNewsProfessionalRepository::default()
}

#[async_trait]
impl NewsProfessionalRepositoryPort for MemoryNewsProfessionalRepository {
    async fn create_story(&self, input: NewNewsStory) -> NewsRepositoryResult<NewsStoredStory> {
        let story = NewsStoredStory {
            id: input.id,
            tenant_id: input.tenant_id,
            slug: input.slug,
            title: input.title,
            summary: input.summary,
            story_type: input.story_type,
            status: "draft".to_string(),
            published_at: None,
            updated_at: input.now,
        };
        self.stories
            .lock()
            .expect("stories lock")
            .insert((story.tenant_id.clone(), story.id.clone()), story.clone());
        Ok(story)
    }

    async fn retrieve_story(
        &self,
        tenant_id: &str,
        story_id: &str,
    ) -> NewsRepositoryResult<Option<NewsStoredStory>> {
        Ok(self
            .stories
            .lock()
            .expect("stories lock")
            .get(&(tenant_id.to_string(), story_id.to_string()))
            .cloned())
    }

    async fn list_stories(
        &self,
        tenant_id: &str,
        status: Option<&str>,
        limit: i64,
    ) -> NewsRepositoryResult<Vec<NewsStoredStory>> {
        let mut stories = self
            .stories
            .lock()
            .expect("stories lock")
            .values()
            .filter(|story| {
                story.tenant_id == tenant_id
                    && status.is_none_or(|expected| story.status == expected)
            })
            .cloned()
            .collect::<Vec<_>>();
        stories.sort_by(|left, right| right.updated_at.cmp(&left.updated_at));
        stories.truncate(limit.max(0) as usize);
        Ok(stories)
    }

    async fn update_story(
        &self,
        tenant_id: &str,
        story_id: &str,
        title: &str,
        summary: &str,
        _expected_version: i64,
        now: &str,
    ) -> NewsRepositoryResult<bool> {
        let mut stories = self.stories.lock().expect("stories lock");
        let Some(story) = stories.get_mut(&(tenant_id.to_string(), story_id.to_string())) else {
            return Ok(false);
        };
        story.title = title.to_string();
        story.summary = summary.to_string();
        story.updated_at = now.to_string();
        Ok(true)
    }

    async fn delete_story(
        &self,
        tenant_id: &str,
        story_id: &str,
        _now: &str,
    ) -> NewsRepositoryResult<()> {
        self.stories
            .lock()
            .expect("stories lock")
            .remove(&(tenant_id.to_string(), story_id.to_string()));
        Ok(())
    }

    async fn publish_story(
        &self,
        tenant_id: &str,
        story_id: &str,
        now: &str,
    ) -> NewsRepositoryResult<()> {
        if let Some(story) = self
            .stories
            .lock()
            .expect("stories lock")
            .get_mut(&(tenant_id.to_string(), story_id.to_string()))
        {
            story.status = "published".to_string();
            story.published_at = Some(now.to_string());
            story.updated_at = now.to_string();
        }
        Ok(())
    }

    async fn attach_story_item(&self, _input: NewNewsStoryItem) -> NewsRepositoryResult<()> {
        Ok(())
    }

    async fn create_assignment(
        &self,
        _input: NewNewsEditorialAssignment,
    ) -> NewsRepositoryResult<()> {
        Ok(())
    }

    async fn update_assignment(
        &self,
        _tenant_id: &str,
        _assignment_id: &str,
        _status: &str,
        _now: &str,
    ) -> NewsRepositoryResult<()> {
        Ok(())
    }

    async fn create_review_task(&self, _input: NewNewsReviewTask) -> NewsRepositoryResult<()> {
        Ok(())
    }

    async fn update_review_task(
        &self,
        _tenant_id: &str,
        _task_id: &str,
        _decision: &str,
        _decision_reason: Option<&str>,
        _now: &str,
    ) -> NewsRepositoryResult<()> {
        Ok(())
    }

    async fn create_import_job(&self, _input: NewNewsImportJob) -> NewsRepositoryResult<()> {
        Ok(())
    }

    async fn create_export_job(&self, _input: NewNewsExportJob) -> NewsRepositoryResult<()> {
        Ok(())
    }

    async fn upsert_item_rights(&self, _input: NewNewsItemRights) -> NewsRepositoryResult<()> {
        Ok(())
    }

    async fn upsert_c2pa_provenance(
        &self,
        _input: NewNewsC2paProvenance,
    ) -> NewsRepositoryResult<()> {
        Ok(())
    }
}
