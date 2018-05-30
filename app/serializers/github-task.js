import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  pushPayload(store, payload) {
    payload.commentCount = payload.comments.totalCount;
    payload.isPullRequest = payload._type == 'PullRequest';
    store.push(this.normalize(store.modelFor('github-task'), payload));
    return payload;
  },
});
