import Route from '@ember/routing/route';
import {inject} from '@ember/service';
import {getTrackerIdentifiers} from '../../utils/task-utils';

export default Route.extend({
  // services
  github: inject(),
  organizations: inject(),
  store: inject(),

  model(params, transition) {
    let currentOrg = transition.queryParams['org']
    let org = this.get('organizations').fetch(currentOrg);
    let store = this.get('store');
    let github = this.get('github');
    let identifiers = getTrackerIdentifiers(org, 'github');

    let tasks = github.tasks({orgs: identifiers});
    tasks.then((data) => {
      data.forEach(function(task) {
        task.organization = currentOrg;
        store.pushPayload('github-task', task);
      });
      return data;
    });

    const onlySelectedOrg = (task) => {
      return task.organization == currentOrg;
    }

    return tasks.then(() => {
      return store.peekAll('github-task').filter(onlySelectedOrg);
    });
  },

  setupController(controller, model) {
    controller.set('tasks', model);
  },
});
