export const loginRegisterScript = () => {

const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

    // if none of the elements exist, do nothing
    if (!container && !registerBtn && !loginBtn) return;

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            if (container) container.classList.add('active');
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (container) container.classList.remove('active');
        });
    }

};

export default loginRegisterScript;