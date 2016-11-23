{ Meteor } = require 'meteor/meteor'
{ Users } = require 'api/users'

module.exports = ->
  Meteor.publish 'users', ->
    return unless @userId

    Users.find {}, fields:
      'username': 1
      'groupId': 1
      'profile.firstName': 1
      'profile.lastName': 1
      'profile.titlePrepend': 1
      'profile.titleAppend': 1
      'profile.gender': 1
      'profile.birthday': 1
      'profile.group': 1
      'profile.employee': 1
      'roles': 1
