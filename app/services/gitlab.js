import { inject } from '@ember/service';
import AjaxService from 'ember-ajax/services/ajax';
import RSVP from 'rsvp';

const ENDPOINT = 'https://gitlab.com/api/v4';
const PROJECT_ENDPOINT = `${ENDPOINT}/projects/{projectId}`;
const ISSUE_ENDPOINT = `${PROJECT_ENDPOINT}/issues?order_by=created_at&state=opened&per_page=100`;

function buildIssuesUrl(projectId) {
  return ISSUE_ENDPOINT.replace('{projectId}', encodeURIComponent(projectId));
}

function buildProjectUrl(projectId) {
  return PROJECT_ENDPOINT.replace('{projectId}', encodeURIComponent(projectId));
}

export default AjaxService.extend({
  userSettings: inject(),

  host: 'https://gitlab.com/',
  _issueUrl: '',

  init(...arg) {
    this._super(...arg);
    this.set('headers', { 'Private-Token': this.get('userSettings').tokens.get('gitlab_com') });
  },

  tasks({ projects }) {
    const tasks = projects.map((projectId) => {
      const embedRepoInfo = taskList => this.fetchRepositoryInfo(projectId)
        .then(repoInfo => taskList.map((task) => {
          const decoratedTask = Object.assign({}, task);
          decoratedTask.repository = repoInfo;
          decoratedTask.type = 'gitlab-task';
          return decoratedTask;
        }));
      return this.fetchIssues(projectId).then(embedRepoInfo);
    });

    return RSVP.all(tasks).then(taskList =>
      taskList
        .reduce((combinedTasks, initialTasklist) => combinedTasks.concat(initialTasklist), []));
  },

  fetchRepositoryInfo(projectId) {
    return this.request(buildProjectUrl(projectId));
  },

  fetchIssues(projectId) {
    return this.request(buildIssuesUrl(projectId));
  },

});
