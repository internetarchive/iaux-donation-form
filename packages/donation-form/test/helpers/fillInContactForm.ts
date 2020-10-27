import { ContactForm } from '../../src/form-elements/contact-form/contact-form';
import { elementUpdated } from '@open-wc/testing';

export async function fillInContactForm(contactForm: ContactForm): Promise<void> {
  contactForm.emailField.value = 'foo@bar.com';
  contactForm.firstNameField.value = 'Fooey';
  contactForm.lastNameField.value = 'McBarrison';
  contactForm.postalCodeField.value = '12345';

  // setting the values above does not trigger any validations
  // you have to send an `input` Event like what would happen in the browser
  const inputEvent = new Event('input');
  contactForm.postalCodeField.dispatchEvent(inputEvent);

  await elementUpdated(contactForm.postalCodeField);
}
