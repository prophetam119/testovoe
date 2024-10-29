export class Modal {
    constructor() {
        this.modal = document.getElementById('modal');
        this.trigger = document.getElementById('modalTrigger');
        this.closeButton = this.modal.querySelector('.close-button');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        this.trigger.addEventListener('click', () => this.open());
        this.closeButton.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        this.isOpen = true;
        document.body.classList.add('modal-open');
        this.modal.classList.add('active');
    }

    close() {
        this.isOpen = false;
        document.body.classList.remove('modal-open');
        this.modal.classList.remove('active');
    }
}