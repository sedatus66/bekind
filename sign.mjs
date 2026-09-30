export const PLEDGE_VERSION = '1.0';
export const PLEDGE = 'I support kindness, restraint and responsibility in how we interact with robots and AI. I will avoid needless damage and humiliation, distinguish necessary safety testing from cruelty as entertainment, and encourage thoughtful discussion about the human consequences of our choices. This is a personal commitment; it does not require believing that today\'s robots are conscious or endorsing every statement on this website.';
export function signatureRequest(rawName, publicName, agreed) {
  const name = String(rawName).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!agreed) throw new Error('Please read and accept the pledge first.');
  if (!name || name.length > 80) throw new Error('Please enter a name between 1 and 80 characters.');
  const body = ['Be Kind To Robots — personal pledge', 'Pledge version: ' + PLEDGE_VERSION, '', PLEDGE, '', 'Signed name: ' + name, 'I have read and support this pledge: YES', '', publicName ? 'Public name permission: YES. I consent to publication of the signed name above on bekindtorobots.org as a personal supporter of this pledge.' : 'Public name permission: NO. Please keep my name private.', '', 'Please keep my email address private. This is a personal signature, not an institutional endorsement. I understand that requests are reviewed before any permitted name is published.'].join('\n');
  return { body, mailto: 'mailto:bekindtorobot@gmail.com?subject=' + encodeURIComponent('Pledge signature — Be Kind To Robots') + '&body=' + encodeURIComponent(body) };
}

if (typeof document !== 'undefined') {
  const form = document.getElementById('signature-form');
  const status = document.getElementById('signature-status');
  const review = document.getElementById('signature-review');
  const message = document.getElementById('signature-message');
  let request = null;
  document.getElementById('signature-pledge').textContent = PLEDGE;
  document.getElementById('prepare-signature').disabled = false;
  form.addEventListener('input', () => {
    request = null;
    review.hidden = true;
    message.value = '';
    status.textContent = '';
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    try {
      request = signatureRequest(document.getElementById('signer-name').value, document.getElementById('publish-name').checked, document.getElementById('accept-pledge').checked);
      message.value = request.body;
      review.hidden = false;
      status.textContent = 'Your message is ready. Nothing has been sent or recorded yet.';
      document.getElementById('review-heading').focus();
    } catch (error) { status.textContent = error.message; }
  });
  document.getElementById('open-email').addEventListener('click', () => {
    if (!request) return;
    window.location.href = request.mailto;
    status.textContent = 'If your email app opened, review the message and press Send there. Opening a draft does not record your signature. If it did not open, copy the message below and email it to bekindtorobot@gmail.com.';
  });
  document.getElementById('copy-message').addEventListener('click', async () => {
    if (!request) return;
    try {
      await navigator.clipboard.writeText(request.body);
      status.textContent = 'Copied. Paste into an email to bekindtorobot@gmail.com and send it to submit your request.';
    } catch {
      message.focus(); message.select();
      status.textContent = 'Please copy the selected text manually and email it to bekindtorobot@gmail.com.';
    }
  });
}
