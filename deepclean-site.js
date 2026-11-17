/* Deep Clean shared site include: analytics, click tracking, and the ONE enquiry path.
 *
 * Every page loads this before script.js. It owns:
 *   1. GA4 + Microsoft Clarity. Both stay OFF until the placeholder IDs below are replaced.
 *   2. Events: call_click, email_click, quote_cta_click, form_submit (success only).
 *   3. dcSubmitEnquiry(): Web3Forms first (emails Amie). Only after Web3Forms says OK does it
 *      copy the enquiry to OTS, fire-and-forget. OTS being down can never block or fail a submit.
 *   4. The short quote form (any <form data-dc-quote>), used inline on money pages and in the modal.
 */
(function () {
    'use strict';

    var DC = window.DC_CONFIG = {
        // ---- Fill these in to switch analytics on (see deepclean-conversion-REPORT.md) ----
        GA4_ID: 'G-XXXXXXX',          // GA4 > Admin > Data streams > Web > Measurement ID
        CLARITY_ID: 'XXXXXXX',        // clarity.microsoft.com > Settings > Overview > Project ID
        // ---- Enquiry delivery ----
        WEB3FORMS_KEY: '903713a9-09b9-4fc5-8088-05dc449eca97',  // existing key, emails deepclean.go2@gmail.com
        WEB3FORMS_URL: 'https://api.web3forms.com/submit',
        // OTS copy of each enquiry (Supabase edge function site-enquiry in the OTS repo).
        // Deploy that function BEFORE this site goes live. Set to '' to switch the copy off.
        OTS_URL: 'https://myffnovjpdnezazjxlhl.supabase.co/functions/v1/site-enquiry',
        OTS_SITE_KEY: 'deepclean-web',
        PHONE: '0433 147 018',
        PHONE_TEL: 'tel:0433147018'
    };

    var PLACEHOLDER = /X{5,}/;
    var page = location.pathname.replace(/^\/+/, '') || 'index.html';

    // ------------------------------------------------------------------ analytics loaders
    function loadScript(src) {
        var s = document.createElement('script');
        s.async = true;
        s.src = src;
        document.head.appendChild(s);
    }

    if (DC.GA4_ID && !PLACEHOLDER.test(DC.GA4_ID)) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', DC.GA4_ID);
        loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(DC.GA4_ID));
    }

    if (DC.CLARITY_ID && !PLACEHOLDER.test(DC.CLARITY_ID)) {
        window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
        loadScript('https://www.clarity.ms/tag/' + encodeURIComponent(DC.CLARITY_ID));
    }

    // Send an event to whatever is switched on. No-ops when nothing is.
    // Never pass names, phone numbers or emails in here.
    function track(name, params) {
        var p = Object.assign({ page_path: page }, params || {});
        try { if (typeof window.gtag === 'function') window.gtag('event', name, p); } catch (e) { /* analytics never breaks the page */ }
        try { if (typeof window.clarity === 'function') window.clarity('event', name); } catch (e) { /* same */ }
    }
    window.dcTrack = track;

    // Where on the page a click came from: an explicit data-pos wins, else the nearest landmark.
    function position(el) {
        var tagged = el.closest('[data-pos]');
        if (tagged) return tagged.getAttribute('data-pos');
        if (el.closest('.dc-callbar')) return 'sticky_bar';
        if (el.closest('header')) return 'header';
        if (el.closest('.quote-modal')) return 'quote_modal';
        if (el.closest('.dc-quote')) return 'quote_section';
        if (el.closest('.hero, .page-hero')) return 'hero';
        if (el.closest('.cta-section')) return 'cta_section';
        if (el.closest('footer')) return 'footer';
        return 'body';
    }

    // ------------------------------------------------------------------ OTS (fire-and-forget)
    function toOts(body) {
        if (!DC.OTS_URL) return;
        try {
            var payload = JSON.stringify(Object.assign({ site_key: DC.OTS_SITE_KEY, page: page }, body));
            // text/plain keeps it a "simple" CORS request: no preflight, works with keepalive on unload.
            fetch(DC.OTS_URL, {
                method: 'POST',
                mode: 'cors',
                keepalive: true,
                headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                body: payload
            }).catch(function () { /* OTS is a copy. Amie already has the email. */ });
        } catch (e) { /* same */ }
    }

    // ------------------------------------------------------------------ click tracking
    var callLogged = false;
    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href]');
        if (!a) return;
        var href = a.getAttribute('href') || '';
        if (href.indexOf('tel:') === 0) {
            var pos = position(a);
            track('call_click', { link_position: pos });
            if (!callLogged) {           // one "call intent" per page view, no personal data
                callLogged = true;
                toOts({ kind: 'call_click', position: pos });
            }
        } else if (href.indexOf('mailto:') === 0) {
            track('email_click', { link_position: position(a) });
        }
    }, true);

    // Quote CTAs. Runs in the capture phase so it fires before script.js opens the modal.
    function isQuoteCta(el) {
        if (el.closest('form')) return false;
        if (el.hasAttribute('data-quote-cta') || el.classList.contains('quote-trigger')) return true;
        var t = (el.textContent || '').toLowerCase();
        return (el.matches('.btn-primary, .cta-button, .package-btn, .service-cta .btn') && (t.indexOf('quote') > -1 || t.indexOf('pricing') > -1));
    }
    document.addEventListener('click', function (e) {
        var el = e.target.closest && e.target.closest('a, button');
        if (!el || !isQuoteCta(el)) return;
        track('quote_cta_click', { link_position: position(el), cta_text: (el.textContent || '').trim().slice(0, 40) });
    }, true);

    // ------------------------------------------------------------------ the one enquiry path
    // fields: plain object of what the customer typed. kind: 'quote' | 'contact' | 'application'.
    // Resolves with the Web3Forms result, rejects if Amie's email did not go.
    function submitEnquiry(fields, kind, formId) {
        kind = kind || 'quote';
        var name = (fields.name || [fields.firstName, fields.lastName].filter(Boolean).join(' ')).trim();
        var subjects = {
            quote: 'New quote request from ' + name,
            contact: 'New quote request from ' + name,
            application: 'New job application from ' + name
        };
        var data = Object.assign({}, fields, {
            access_key: DC.WEB3FORMS_KEY,
            subject: subjects[kind] || subjects.quote,
            from_name: name ? name + ' (deepclean.au)' : 'deepclean.au',
            page: location.href
        });
        // Web3Forms needs an email field to set reply-to. Leave it off when the customer didn't give one.
        if (!data.email) delete data.email;

        return fetch(DC.WEB3FORMS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data)
        }).then(function (r) {
            return r.json().catch(function () { return { success: false, message: 'Bad response (' + r.status + ')' }; });
        }).then(function (result) {
            if (!result || !result.success) throw new Error((result && result.message) || 'Form did not send');
            if (kind !== 'application') {
                track('form_submit', { form_id: formId || kind, service: fields.service || fields.serviceType || '' });
                toOts({
                    kind: 'enquiry',
                    form: formId || kind,
                    name: name,
                    phone: fields.phone || '',
                    email: fields.email || '',
                    suburb: fields.suburb || fields.address || '',
                    service: fields.service || fields.serviceType || '',
                    message: fields.message || '',
                    hp: fields.botcheck || ''
                });
            }
            return result;
        });
    }
    window.dcSubmitEnquiry = submitEnquiry;

    // ------------------------------------------------------------------ short quote form
    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
    }

    function wireQuoteForm(form) {
        if (form.__dcWired) return;
        form.__dcWired = true;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var f = Object.fromEntries(new FormData(form));
            var status = form.querySelector('.dc-form-status');
            var btn = form.querySelector('button[type="submit"]');
            if (f.botcheck) return;  // honeypot: bots fill hidden fields, people don't
            var missing = [];
            if (!(f.name || '').trim()) missing.push('your name');
            if ((f.phone || '').replace(/\D/g, '').length < 8) missing.push('a phone number');
            if (!(f.suburb || '').trim()) missing.push('your suburb');
            if (missing.length) {
                status.className = 'dc-form-status dc-error';
                status.textContent = 'Just need ' + (missing.length > 1 ? missing.slice(0, -1).join(', ') + ' and ' + missing[missing.length - 1] : missing[0]) + ' so Amie can get back to you.';
                return;
            }
            var label = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Sending...';
            status.className = 'dc-form-status';
            status.textContent = '';
            submitEnquiry(f, 'quote', form.id || 'quick_quote').then(function () {
                var first = esc((f.name || '').trim().split(/\s+/)[0]);
                form.innerHTML = '<div class="dc-form-done" role="status"><h3>Thanks ' + first + ', that\'s with Amie now.</h3>' +
                    '<p>She\'ll get back to you within 24 hours. Got photos of the job? Text them to ' +
                    '<a href="' + DC.PHONE_TEL + '">' + DC.PHONE + '</a> and she can quote faster.</p></div>';
            }).catch(function () {
                btn.disabled = false;
                btn.textContent = label;
                status.className = 'dc-form-status dc-error';
                status.innerHTML = 'Sorry, that didn\'t send. Please call or text Amie on <a href="' + DC.PHONE_TEL + '">' + DC.PHONE + '</a>.';
            });
        });
    }
    window.dcWireQuoteForm = wireQuoteForm;

    function init() {
        document.querySelectorAll('form[data-dc-quote]').forEach(wireQuoteForm);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
