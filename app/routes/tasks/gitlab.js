import Route from '@ember/routing/route';
import {inject} from '@ember/service';

export default Route.extend({
  gitlab: inject(),
  store: inject(),
  model() {
    const store = this.get('store');
    return this.get('gitlab').tasks({projects: ['coala/mobans']}).then(data => {
      for (let task of data) {
        store.pushPayload('gitlab-task', task);
      }
      return store.peekAll('gitlab-task');
    });
  }
});
