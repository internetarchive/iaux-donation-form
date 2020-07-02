export function submitFormWith({ method = 'POST', fields, action }) {
  const form = document.createElement('form');
  form.method = method;
  form.action = action;
  form.style.display = 'none';
  form.target = '_top';

  document.body.appendChild(form);

  console.debug(method, fields, action);

  Object.keys(fields).forEach((name) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = name;
    input.value = fields[name];

    form.appendChild(input)
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
