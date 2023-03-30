hljs.highlightAll();

document.getElementById('top').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/**
 * Code copying functionality from Polar (@notpolar):
 * https://www.khanacademy.org/computer-programming/chameleonic-header-tutorial-html/4667187347374080
 */
const pres = document.querySelectorAll('pre > code');

pres.forEach((p) => {
    const copyThis = p.innerText;
    const div = document.createElement('div');
    div.classList = 'copy';
    div.title = 'Copy to clipboard';
    div.addEventListener('click', () => {
        div.innerHTML =
            '<span class="material-icons">check_circle</span>Copied!';
        div.style = 'color: var(--emerald-color)';
        copyToClipboard(copyThis);
        window.setTimeout(() => {
            div.innerHTML =
                '<span class="material-icons">content_copy</span>Copy';
            div.style = '';
        }, 3000);
    });
    div.innerHTML = '<span class="material-icons">content_copy</span>Copy';
    p.appendChild(div);
});

function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData('Text', text);
    } else if (
        document.queryCommandSupported &&
        document.queryCommandSupported('copy')
    ) {
        var textarea = document.createElement('textarea');
        textarea.textContent = text;
        textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand('copy'); // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn('Copy to clipboard failed.', ex);
            return prompt('Copy to clipboard: Ctrl+C, Enter', text);
        } finally {
            document.body.removeChild(textarea);
        }
    }
}