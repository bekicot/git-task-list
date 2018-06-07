import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  pushPayload(store, payload) {
    const task = {};
    task.id = payload.id;
    task.bodyText = payload.description;
    task.commentCount = payload.user_notes_count;
    // Set the default color to 65C8FF, otherwise, we need to refetch the default
    // color from `project/:id/labels` endpoint.
    task.labels = payload.labels.map(label => ({ color: '65C8FF', name: label }));
    task.updatedAt = payload.updated_at;
    task.title = payload.title;
    task.url = payload.web_url;

    task.author = {};
    task.author.url = payload.author.web_url;
    task.author.login = payload.author.username;
    task.author.avatarUrl = payload.author.avatar_url;

    task.repository = {};
    task.repository.nameWithOwner = payload.repository.path_with_namespace;
    task.repository.url = payload.repository.web_url;

    task.isPullRequest = payload._type === 'PullRequest';

    store.push(this.normalize(store.modelFor('gitlab-task'), task));
    return task;
  },
});
