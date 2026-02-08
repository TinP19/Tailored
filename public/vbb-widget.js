/**
 * Visitor Blend Boost - Plug-and-Play Personalization Widget
 * Add to any website with a single script tag.
 * VC Track: Plug-And-Play Dynamic Website Personalization
 */
(function () {
  "use strict";

  var VBB = {
    version: "1.0.0",
    script: null,
    config: {},
  };

  function getScript() {
    if (!VBB.script) {
      VBB.script = document.currentScript || document.querySelector('script[data-vbb-widget]');
    }
    return VBB.script;
  }

  function getParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function collectContext() {
    var params = new URLSearchParams(window.location.search);
    var queryParams = params.toString();
    var searchQuery = params.get("q") || params.get("query") || params.get("search") || params.get("intent");
    var personaOverride = params.get("persona") || (VBB.config.persona || (getScript() && getScript().getAttribute("data-persona")));
    return {
      url: window.location.href,
      query_params: queryParams,
      referrer: document.referrer || "",
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      search_query: searchQuery,
      persona_override: personaOverride,
    };
  }

  var INTENT_PATTERNS = [
    { pattern: /buy|order|purchase|add\s+to\s+cart|get\s+now/i, intent: "BUY_NOW", image: "img_gaming", cta: "buy_now" },
    { pattern: /compare|vs|versus|best|review|which/i, intent: "COMPARE", image: "img_comparison", cta: "compare" },
    { pattern: /gaming|gamer|esports|144hz/i, intent: "USE_CASE_GAMING", image: "img_gaming", cta: "buy_now" },
    { pattern: /work|coding|productivity|office/i, intent: "USE_CASE_WORK", image: "img_office", cta: "buy_now" },
    { pattern: /design|creative|photo|video\s*edit/i, intent: "USE_CASE_DESIGN", image: "img_design", cta: "buy_now" },
    { pattern: /cheap|budget|deal|discount|affordable|value/i, intent: "BUDGET", image: "img_deal", cta: "view_deals" },
  ];

  var DEFAULT_REGISTRY = {
    images: {
      img_gaming: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1920&q=80",
      img_office: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
      img_design: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=80",
      img_comparison: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=80",
      img_deal: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80",
      img_premium: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1920&q=80",
    },
    ctas: {
      buy_now: { text: "Shop Now", link: "/shop" },
      compare: { text: "Compare Models", link: "/compare" },
      explore: { text: "Explore Options", link: "/catalog" },
      view_deals: { text: "View Deals", link: "/deals" },
    },
    headlines: {
      BUY_NOW: "Ready to Level Up?",
      COMPARE: "Find Your Perfect Match",
      USE_CASE_GAMING: "Built for Gamers. Built to Perform.",
      USE_CASE_WORK: "Professional-Grade. Anywhere.",
      USE_CASE_DESIGN: "Create Without Limits.",
      BUDGET: "Premium Quality. Smart Prices.",
      BROWSE: "Discover What's Right for You",
    },
    subheadlines: {
      BUY_NOW: "High-performance tech that delivers. Free shipping on orders today.",
      COMPARE: "Compare specs, prices, and reviews to find the best fit.",
      USE_CASE_GAMING: "144Hz displays and blazing-fast hardware for competitive gaming.",
      USE_CASE_WORK: "Productivity laptops and monitors built for the modern workplace.",
      USE_CASE_DESIGN: "Color-accurate displays for creators who demand precision.",
      BUDGET: "Quality devices at prices that make sense. Deals you can trust.",
      BROWSE: "Laptops, tablets, and displays for every need and budget.",
    },
  };

  function runRules(context) {
    var text = [context.search_query || "", context.query_params, context.referrer, context.utm_campaign || ""].join(" ").toLowerCase();

    if (context.persona_override) {
      var overrideIntent = context.persona_override.toUpperCase().replace(/-/g, "_");
      var match = INTENT_PATTERNS.find(function (p) { return p.intent === overrideIntent; });
      if (!match && overrideIntent === "BROWSE") {
        match = { intent: "BROWSE", image: "img_comparison", cta: "explore" };
      }
      match = match || INTENT_PATTERNS[0];
      return {
        intent: overrideIntent,
        confidence: 1,
        image_id: match.image,
        cta_id: match.cta,
        headline: DEFAULT_REGISTRY.headlines[overrideIntent] || "Personalized for you",
        subheadline: DEFAULT_REGISTRY.subheadlines[overrideIntent] || "Showing content optimized for your intent.",
      };
    }

    for (var i = 0; i < INTENT_PATTERNS.length; i++) {
      var p = INTENT_PATTERNS[i];
      if (p.pattern.test(text)) {
        return {
          intent: p.intent,
          confidence: 0.85,
          image_id: p.image,
          cta_id: p.cta,
          headline: DEFAULT_REGISTRY.headlines[p.intent],
          subheadline: DEFAULT_REGISTRY.subheadlines[p.intent],
        };
      }
    }

    return {
      intent: "BROWSE",
      confidence: 0.5,
      image_id: "img_comparison",
      cta_id: "explore",
      headline: DEFAULT_REGISTRY.headlines.BROWSE,
      subheadline: DEFAULT_REGISTRY.subheadlines.BROWSE,
    };
  }

  function resolveDecision(decision, registry, baseUrl) {
    baseUrl = baseUrl || "";
    var imgUrl = (registry.images && registry.images[decision.image_id]) || DEFAULT_REGISTRY.images[decision.image_id];
    if (baseUrl && typeof imgUrl === "string" && imgUrl.indexOf("http") !== 0) {
      imgUrl = baseUrl.replace(/\/?$/, "/") + imgUrl;
    }
    var cta = (registry.ctas && registry.ctas[decision.cta_id]) || DEFAULT_REGISTRY.ctas[decision.cta_id];
    return {
      intent: decision.intent,
      headline: decision.headline,
      subheadline: decision.subheadline,
      image_url: imgUrl,
      cta_text: (cta && cta.text) || decision.cta_id,
      cta_link: (cta && cta.link) || "#",
    };
  }

  function inject(decision) {
    var baseUrl = (VBB.config.baseUrl || (getScript() && getScript().getAttribute("data-base-url"))) || "";
    var registry = VBB.config.registry || {};
    var resolved = resolveDecision(decision, registry, baseUrl);

    var selectors = {
      headline: "[data-vbb-headline], .hero-headline, [data-hero-headline]",
      subheadline: "[data-vbb-subheadline], .hero-subheadline, [data-hero-subheadline]",
      image: "[data-vbb-image], .hero-image, [data-hero-image]",
      cta: "[data-vbb-cta], .hero-cta, [data-hero-cta]",
      container: "[data-vbb-hero], .hero-section, [data-hero]",
    };

    function update(selector, updateFn) {
      var el = document.querySelector(selector);
      if (el) updateFn(el);
    }

    update(selectors.headline, function (el) { el.textContent = resolved.headline; });
    update(selectors.subheadline, function (el) { el.textContent = resolved.subheadline; });
    update(selectors.image, function (el) {
      el.src = resolved.image_url;
      if (el.alt === undefined || el.alt === "") el.alt = resolved.headline;
    });
    update(selectors.cta, function (el) {
      el.textContent = resolved.cta_text;
      if (el.tagName === "A" || el.href !== undefined) el.href = resolved.cta_link;
    });

    var container = document.querySelector(selectors.container);
    if (container && !document.querySelector(".vbb-badge")) {
      var badge = document.createElement("details");
      badge.className = "vbb-badge";
      badge.style.cssText = "position:absolute;bottom:16px;left:16px;z-index:10;";
      badge.innerHTML =
        '<summary style="cursor:pointer;font-size:12px;padding:8px 12px;background:rgba(0,0,0,0.6);color:#fff;border-radius:8px;">✨ Personalized for you</summary>' +
        '<div style="margin-top:8px;padding:12px;background:rgba(0,0,0,0.8);color:#fff;border-radius:8px;font-size:11px;max-width:280px;">' +
        '<strong>Intent:</strong> ' + resolved.intent + '<br>' +
        '<strong>Confidence:</strong> ' + Math.round((decision.confidence || 0.5) * 100) + '%' +
        '</div>';
      if (getComputedStyle(container).position === "static") {
        container.style.position = "relative";
      }
      container.appendChild(badge);
    }

    if (typeof console !== "undefined" && console.log) {
      console.log("[VBB] Personalization applied:", resolved);
    }

    return resolved;
  }

  function run() {
    VBB.config = window.VBB_CONFIG || {};
    var context = collectContext();
    var decision = runRules(context);
    return inject(decision);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  window.VBB = { run: run, version: VBB.version };
})();
