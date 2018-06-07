import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  pushPayload(store, payload) {
    const task = {};
    task.id = payload.id
    task.bodyText = payload.description
    task.commentCount = payload.user_notes_count
    task.updatedAt = payload.updated_at
    task.url = payload.web_url
    task.title = payload.title

    task.author = {}
    task.author.url = payload.author.web_url
    task.author.login = payload.author.username
    task.author.avatarUrl = payload.author.avatar_url

    task.repository = {}
    task.repository.nameWithOwner = payload.repository.path_with_namespace
    task.repository.url = payload.repository.web_url

    task.isPullRequest = payload._type == 'PullRequest';

    store.push(this.normalize(store.modelFor('gitlab-task'), task));
    return task;
  },
});
