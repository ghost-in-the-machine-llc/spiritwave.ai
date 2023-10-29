const section = document.getElementById('intake-section');
const form = section.querySelector('form');
const colorInput = form.querySelector(`[name=color]`);

export function intakeSection(onSubmit) {
    colorInput.value = '#' + Math.floor(Math.random() * 16777215).toString(16);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        onSubmit(data);
    });

    return {
        fadeOut() {
            section.classList.add('fade-out');
        },
    };
}
