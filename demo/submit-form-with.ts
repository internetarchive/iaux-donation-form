export function submitFormWith(options: {
  method?: string;
  fields: { [key: string]: string | undefined };
  action: string;
}): void {
  const form = document.createElement('form') as HTMLFormElement;
  form.method = options.method ?? 'POST';
  form.action = options.action;
  form.style.display = 'none';
  form.target = '_top';

  document.body.appendChild(form);

  // console.debug(method, fields, action);

  const fields = options.fields ?? {};

  Object.keys(fields).forEach((name: string) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = name;

    const value = fields[name];

    if (value) {
      input.value = value;
    }

    form.appendChild(input);
  });

  console.debug('form', form);

  form.submit();

  // const form = $('<form />', {
  //   action,
  //   method,
  //   css: { display: 'none' },
  //   target: '_top',
  // }).appendTo(document.body);

  // Object.keys(fields).forEach((name) => {
  //   $('<input />', {
  //     type: 'text',
  //     name,
  //     value: fields[name],
  //   }).appendTo($form);
  // });

  // $form.submit();
}
