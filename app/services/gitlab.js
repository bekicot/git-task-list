// https://gitlab.com/api/v4/projects/coala%2Fmobans/issues?order_by=created_at&state=opened
import AjaxService from 'ember-ajax/services/ajax';
import RSVP from 'rsvp';

const ENDPOINT = 'https://gitlab.com/api/v4';
const PROJECT_ENDPOINT = ENDPOINT + '/projects/{projectId}'
const ISSUE_ENDPOINT = PROJECT_ENDPOINT + '/issues?order_by=created_at&state=opened&per_page=100';

function buildIssuesUrl(projectId) {
  return ISSUE_ENDPOINT.replace('{projectId}', encodeURIComponent(projectId));
}

function buildProjectUrl(projectId) {
  return PROJECT_ENDPOINT.replace('{projectId}', encodeURIComponent(projectId));
}

export default AjaxService.extend({
  host: 'https://gitlab.com/',
  _issueUrl: '',
  init() {
    this._super(...arguments);
    this.set('headers', {'Private-Token':  'sVfZzagWtemrV-suxYK-'});
  },

  tasks({projects}) {
    let tasks = projects.map((projectId) => {
      const embedRepoInfo = (tasks) => {
        return new Promise((resolve, reject) => {
          this.fetchRepositoryInfo(projectId).then((repoInfo) => {
            tasks.map((task) => {
              task.repository = repoInfo;
              task.type = 'gitlab-task';
              return task;
            })
            resolve(tasks)
          }).catch((error) => reject(error));
        });
      }

      return this.fetchIssues(projectId).then(embedRepoInfo)
    });

    return RSVP.all(tasks).then((tasks) => {
      return tasks.reduce((combinedTasks, tasks) => {
        return combinedTasks.concat(tasks);
      }, [])
    })
  },

  fetchRepositoryInfo(projectId) {
    return this.request(buildProjectUrl(projectId));
  },

  fetchIssues(projectId) {
    return this.request(buildIssuesUrl(projectId));
  },

});
