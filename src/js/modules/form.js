import Inputmask from 'inputmask';
import { Validator } from './validator';

export class Form {
    constructor(formElement) {
        this.form = formElement;
        this.validator = new Validator(this.form);
        this.init();
    }

    init() {
        this.initPhoneMask();
        this.attachEventListeners();
    }

    initPhoneMask() {
        const phoneInput = this.form.querySelector('input[name="phone"]');
        const maskOptions = {
            mask: '+7 (999) 999-99-99',
            showMaskOnHover: true
        };
        Inputmask(maskOptions).mask(phoneInput);
    }

    attachEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.form.addEventListener('input', (e) => this.handleInput(e));
    }

    handleInput(e) {
        const field = e.target;
        this.validator.validateField(field);
    }

    async handleSubmit(e) {
        e.preventDefault();
    
        if (!this.validator.validateAll()) {
            return;
        }
    
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
    
        try {
            const response = await this.sendData(data);
            
            // Обрабатываем ответ
            this.handleResponse(response);
        } catch (error) {
            this.showError('Произошла ошибка при отправке формы');
        }
    }

    async sendData(data) {
        const response = await fetch('http://localhost:9090/api/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    
        // Уберите выброс ошибки здесь
        return await response.json(); // Возвращаем ответ, даже если он не успешный
    }

    handleResponse(response) {
        console.log(response);
        if (response.status === 'success') {
            
            
            this.showSuccess(response.msg);
            this.resetForm();
        } else if (response.status === 'error') {
            this.showFieldErrors(response.fields);
        }
    }

    showFieldErrors(fields) {
        Object.entries(fields).forEach(([fieldName, errorMessage]) => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                this.validator.showError(field, errorMessage);
            }
        });
    }

    showSuccess(message) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.textContent = message;
        this.form.appendChild(successElement);

        setTimeout(() => {
            successElement.remove();
        }, 3000);
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        this.form.appendChild(errorElement);

        setTimeout(() => {
            errorElement.remove();
        }, 3000);
    }

    resetForm() {
        this.form.reset();
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        const fields = this.form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            field.classList.remove('error');
        });
    }
}