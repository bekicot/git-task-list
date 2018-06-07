import Service from '@ember/service';
import { visit, find } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

// Simulating empty gitlab Projects
const emptyGitlabOrgService = Service.extend({
  fetchGitlabProjects: () => [],
  fetch: () => ({}),
});

module('Acceptance/tasks/list-gitlab-tasks-test', function listGitlabTaskTests(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function beforeEach() {
    this.owner.register('service:organizations', emptyGitlabOrgService);
  });

  test('should show no gitlab repository', async function listGitlabTasks(assert) {
    await visit('/tasks/gitlab?org=discourse');
    const $noGitlabRepo = find('.is-three-quarters > p');
    assert.equal($noGitlabRepo.innerText, "This Org doesn't have any gitlab repository.");
  });
});
