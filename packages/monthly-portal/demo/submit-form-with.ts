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

  form.submit();
}
