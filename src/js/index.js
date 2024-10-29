import '../scss/main.scss';
import { Form } from './modules/form';
import { Modal } from './modules/modal';

document.addEventListener('DOMContentLoaded', () => {
    const formElement = document.getElementById('feedbackForm');
    if (formElement) {
        new Form(formElement);
    }

    new Modal();
});