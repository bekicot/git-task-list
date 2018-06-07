import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() {
  this.route('tasks', function() {
    this.route('gitlab');
    this.route('github');
  });
});

export default Router;
