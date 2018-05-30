import {computed} from '@ember/object';
import Route from '@ember/routing/route';
import {inject} from '@ember/service';

export default Route.extend({
  // services
  github: inject(),
  organizations: inject(),
  store: inject(),

  queryParams: {
    org: {
      refreshModel: true,
    },
  },

  currentOrg: computed('params.org', function () {
    return this.get('organizations').fetch(this.get('params')['org']);
  }),

  model(params) {
    this.set('params', params);
    let org = this.get('organizations').fetch(params['org']);
    let githubParams = [];
    let store = this.get('store');

    if(org && org.trackers){
      githubParams = org.trackers
        .filter((tracker) => tracker.type == 'github')
        .map((tracker) => tracker.identifier);
    } else {
      throw 'Unsupported Org';
    }

    let tasks = this.github.tasks({orgs: githubParams});
    tasks.then((data) => {
      data.forEach(function(task) {
        task.organization = params['org'];
        store.pushPayload('github-task', task);
      });
      return data;
    });

    const onlySelectedOrg = (task) => {
      return task.organization == params['org'];
    }

    return tasks.then(() => {
      return this.store.peekAll('github-task').filter(onlySelectedOrg);
    });
  },

  setupController(controller, model) {
    controller.set('currentOrg', this.get('currentOrg'));
    controller.set('tasks', model);
  },
});
