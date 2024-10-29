export class Validator {
    constructor(form) {
        this.form = form;
        this.errors = new Map();
    }

    validateName(value) {
        if (!value.trim()) {
            return 'Имя обязательно для заполнения';
        }
        if (value.length < 2) {
            return 'Имя должно содержать минимум 2 символа';
        }
        return null;
    }

    validateEmail(value) {
        if (!value.trim()) {
            return 'Email обязателен для заполнения';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Введите корректный email адрес';
        }
        return null;
    }

    validatePhone(value) {
        if (!value.trim()) {
            return 'Телефон обязателен для заполнения';
        }
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length < 11) {
            return 'Введите корректный номер телефона';
        }
        return null;
    }

    validateMessage(value) {
        if (!value.trim()) {
            return 'Сообщение обязательно для заполнения';
        }
        return null;
    }

    validateField(field) {
        const { name, value } = field;
        let error = null;

        switch (name) {
            case 'name':
                error = this.validateName(value);
                break;
            case 'email':
                error = this.validateEmail(value);
                break;
            case 'phone':
                error = this.validatePhone(value);
                break;
            case 'message':
                error = this.validateMessage(value);
                break;
        }

        if (error) {
            this.errors.set(name, error);
            this.showError(field, error);
        } else {
            this.errors.delete(name);
            this.removeError(field);
        }

        return !error;
    }

    showError(field, error) {
        const errorElement = this.form.querySelector(`[data-error="${field.name}"]`);
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = error;
        }
    }

    removeError(field) {
        const errorElement = this.form.querySelector(`[data-error="${field.name}"]`);
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    validateAll() {
        const fields = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }
}