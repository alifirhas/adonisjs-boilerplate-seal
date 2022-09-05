import Route from '@ioc:Adonis/Core/Route'

Route.group(function () {
  Route.delete('/', 'Post/PostController.destroyAll').as('posts.destroyAll')
}).prefix('posts')
Route.resource('posts', 'Post/PostController').apiOnly()
