export default function (plop) {
  plop.setGenerator('store', {
    description: 'This is a generator simple template for Zustand!',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'File name (kabeb-case): ',
        default: 'counter'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/stores/{{name}}.store.ts',
        templateFile: 'plop-templates/store/counter.store.template.hbs'
      },
      {
        type: 'append',
        path: 'src/stores/index.ts',
        template: "export * from './{{name}}.store';"
      }
    ]
  });
}
