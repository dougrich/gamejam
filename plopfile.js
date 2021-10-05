module.exports = function (plop) {
  plop.setGenerator('package', {
      description: 'new package',
      prompts: [{
          type: 'input',
          name: 'name',
          message: 'package name please'
      }],
      actions: [{
          type: 'addMany',
          destination: 'packages/{{name}}',
          base: 'templates/package',
          templateFiles: 'templates/package/**/*'
      }]
  });

  plop.setGenerator('loader', {
      description: 'new loader',
      prompts: [{
          type: 'input',
          name: 'name',
          message: 'package name please'
      },{
        type: 'input',
        name: 'filetype',
        message: 'filetype please'
      }],
      actions: [{
          type: 'addMany',
          destination: 'packages/{{name}}',
          base: 'templates/loader',
          globOptions: {
            dot: true,
          },
          templateFiles: 'templates/loader/**/*'
      }]
  })

  plop.setGenerator('scene', {
      description: 'new scene',
      prompts: [{
          type: 'input',
          name: 'name',
          message: 'package name please'
      }],
      actions: [{
          type: 'addMany',
          destination: 'scenes/{{name}}',
          base: 'templates/scene',
          globOptions: {
            dot: true,
          },
          templateFiles: 'templates/scene/**/*'
      }]
  })
};