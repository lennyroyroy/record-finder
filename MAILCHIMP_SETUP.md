# Mailchimp Integration — Spin or Stream Landing Page

_Complete this when you're ready to go live with email capture._

---

## What's already built

The landing page (`frontend/public/landing/index.html`) has two email forms:
- **Hero form** — above the fold, `id="hero-form"`
- **Capture form** — mid-page, `id="capture-form"`

Both forms are fully wired and submit via AJAX (no page redirect). They show a success
state on submit. Right now `action="#"` is the placeholder — they show success locally
but don't send anywhere. Three steps below is all you need to go live.

---

## Step 1 — Create a Mailchimp Audience

1. Log in to [mailchimp.com](https://mailchimp.com)
2. Go to **Audience → All contacts**
3. If you don't have an audience yet, click **Create Audience**
4. Name it "Spin or Stream Early Access" — keep all defaults

---

## Step 2 — Get your embed form URL

1. In Mailchimp: **Audience → Signup forms → Embedded forms**
2. Click **Continue**
3. In the generated `<form>` HTML, find the `action` attribute. It looks like:
   ```
   https://yourdomain.us1.list-manage.com/subscribe/post?u=abc123&amp;id=def456
   ```
4. Copy that URL (decode `&amp;` → `&` when you paste it)

---

## Step 3 — Update the landing page

In `frontend/public/landing/index.html`, find both `<form>` elements and:

**A. Replace the `action` attribute** on both forms:
```html
<!-- Before -->
<form class="email-form" action="#" method="POST" id="hero-form">

<!-- After -->
<form class="email-form" action="https://yourdomain.us1.list-manage.com/subscribe/post?u=abc123&id=def456" method="POST" id="hero-form">
```

Do the same for `id="capture-form"`.

**B. Update the honeypot field name** (Mailchimp bot protection):
```html
<!-- Before -->
<input type="hidden" name="b_PLACEHOLDER_REPLACE_ME" value="" />

<!-- After — copy the exact b_ field name from your Mailchimp embed code -->
<input type="hidden" name="b_abc123_def456" value="" />
```

That's it. The AJAX submission logic in the `<script>` block handles everything else.

---

## How the SOURCE field works

Each form sends a hidden `SOURCE` field:
- Hero form → `SOURCE = "hero-above-fold"`
- Capture form → `SOURCE = "mid-page-capture"`

To capture this in Mailchimp:
1. Go to **Audience → Signup forms → Form fields**
2. Add a hidden field named `SOURCE`
3. This lets you see in your audience which form each subscriber came from

---

## Testing before launch

1. Set the real action URL on one form
2. Submit with a test email address
3. Check your Mailchimp audience — the contact should appear within 30 seconds
4. Once confirmed, update the second form and commit

---

## Notes

- Mailchimp's embedded forms don't support standard CORS, so the script uses
  `mode: 'no-cors'` and treats any response as success. This is the standard
  approach for Mailchimp AJAX embeds.
- Double opt-in: Mailchimp may send a confirmation email depending on your
  audience settings. For a waitlist, consider turning double opt-in OFF
  (Audience → Settings → Audience name and defaults → uncheck "Enable double opt-in")
- GDPR: If you expect European users, add a checkbox to the form and note
  what you'll email them. The current copy ("one email when it's ready") is
  clear enough for most jurisdictions, but consult a lawyer if you're unsure.
