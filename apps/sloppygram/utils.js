/**
 * Sloppygram v2.0 - Utility Module
 * Core utility functions extracted for modularization
 */

// ============================================
// HTML SANITIZATION & ESCAPING
// ============================================

/**
 * Escape HTML entities using DOMPurify - removes all HTML/scripts
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML insertion
 */
export function escapeHtml(text) {
    if (!text) return '';
    return DOMPurify.sanitize(String(text), { ALLOWED_TAGS: [] });
}

/**
 * Escape string for safe use in HTML attributes (onclick handlers, etc.)
 * @param {string} str - String to escape
 * @returns {string} Attribute-safe string
 */
export function escapeAttr(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\\/g, '&#92;');
}

/**
 * Sanitize HTML content - allows safe tags but removes scripts
 * @param {string} html - HTML to sanitize
 * @returns {string} Sanitized HTML
 */
export function sanitizeHtml(html) {
    if (!html) return '';
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p', 'span'],
        ALLOWED_ATTR: []
    });
}

/**
 * Sanitize plain text for database storage (defense-in-depth)
 * Strips all HTML tags, trims whitespace, limits length
 * @param {string} text - Text to sanitize
 * @param {number} maxLength - Maximum length (default 2000)
 * @returns {string} Clean text safe for storage
 */
export function sanitizeForStorage(text, maxLength = 2000) {
    if (!text) return '';
    let clean = DOMPurify.sanitize(String(text), { ALLOWED_TAGS: [] });
    clean = clean.trim().slice(0, maxLength);
    return clean;
}

/**
 * Sanitize URLs - block dangerous protocols but allow image data URLs
 * @param {string} url - URL to sanitize
 * @returns {string} Safe URL or empty string
 */
export function sanitizeUrl(url) {
    if (!url) return '';
    const str = String(url).trim();

    // Allow data:image URLs (base64 images)
    if (/^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/i.test(str)) {
        return str;
    }

    // Block javascript:, other data:, vbscript:, file: protocols
    if (/^(javascript|data|vbscript|file):/i.test(str)) {
        console.warn('Blocked dangerous URL:', str.slice(0, 50));
        return '';
    }

    // Allow http/https URLs and relative paths
    return DOMPurify.sanitize(str, { ALLOWED_TAGS: [] });
}

// ============================================
// SECURE LOCAL STORAGE
// ============================================

const STORAGE_KEY = 'sl0ppy_2024';
const STORAGE_VERSION = 'v1:';

/**
 * Obfuscate data for localStorage (defense-in-depth)
 * @param {*} data - Data to obfuscate
 * @returns {string|null} Obfuscated string
 */
export function obfuscateData(data) {
    try {
        const json = JSON.stringify(data);
        let obfuscated = '';
        for (let i = 0; i < json.length; i++) {
            obfuscated += String.fromCharCode(json.charCodeAt(i) ^ STORAGE_KEY.charCodeAt(i % STORAGE_KEY.length));
        }
        return STORAGE_VERSION + btoa(unescape(encodeURIComponent(obfuscated)));
    } catch (e) {
        console.error('Failed to obfuscate data:', e);
        return null;
    }
}

/**
 * Deobfuscate data from localStorage
 * @param {string} encoded - Obfuscated string
 * @returns {*} Original data or null
 */
export function deobfuscateData(encoded) {
    try {
        if (!encoded) return null;
        if (!encoded.startsWith(STORAGE_VERSION)) {
            return JSON.parse(encoded);
        }
        const base64 = encoded.slice(STORAGE_VERSION.length);
        const obfuscated = decodeURIComponent(escape(atob(base64)));
        let json = '';
        for (let i = 0; i < obfuscated.length; i++) {
            json += String.fromCharCode(obfuscated.charCodeAt(i) ^ STORAGE_KEY.charCodeAt(i % STORAGE_KEY.length));
        }
        return JSON.parse(json);
    } catch (e) {
        console.error('Failed to deobfuscate data:', e);
        return null;
    }
}

/**
 * Set data in localStorage with obfuscation
 * @param {string} key - Storage key
 * @param {*} data - Data to store
 */
export function secureStorageSet(key, data) {
    const obfuscated = obfuscateData(data);
    if (obfuscated) {
        localStorage.setItem(key, obfuscated);
    }
}

/**
 * Get data from localStorage with deobfuscation
 * @param {string} key - Storage key
 * @returns {*} Stored data or null
 */
export function secureStorageGet(key) {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    return deobfuscateData(stored);
}

// ============================================
// TIME FORMATTING
// ============================================

/**
 * Format a date as relative time ago
 * @param {Date|string} date - Date to format
 * @returns {string} Human-readable time ago
 */
export function formatTimeAgo(date) {
    const now = Date.now();
    if (typeof date === 'string') date = new Date(date);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
    return date.toLocaleDateString();
}

/**
 * Format a date as time string
 * @param {Date|string} date - Date to format
 * @returns {string} Time string (HH:MM)
 */
export function formatTime(date) {
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ============================================
// DATA CONVERSION
// ============================================

/**
 * Convert a data URL to a Blob
 * @param {string} dataURL - Data URL string
 * @returns {Blob} Blob object
 */
export function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

// ============================================
// RATE LIMITING
// ============================================

const rateLimits = {
    message: { count: 0, resetTime: 0, limit: 10, window: 60000 },
    post: { count: 0, resetTime: 0, limit: 5, window: 60000 },
    vote: { count: 0, resetTime: 0, limit: 30, window: 60000 },
    comment: { count: 0, resetTime: 0, limit: 15, window: 60000 }
};

/**
 * Check if action is rate limited
 * @param {string} actionType - Type of action (message, post, vote, comment)
 * @returns {boolean} True if allowed, false if rate limited
 */
export function checkRateLimit(actionType) {
    const limit = rateLimits[actionType];
    if (!limit) return true;

    const now = Date.now();
    if (now > limit.resetTime) {
        limit.count = 0;
        limit.resetTime = now + limit.window;
    }

    return limit.count < limit.limit;
}

/**
 * Record an action for rate limiting
 * @param {string} actionType - Type of action
 */
export function recordAction(actionType) {
    const limit = rateLimits[actionType];
    if (!limit) return;

    const now = Date.now();
    if (now > limit.resetTime) {
        limit.count = 1;
        limit.resetTime = now + limit.window;
    } else {
        limit.count++;
    }
}

// ============================================
// DOM UTILITIES
// ============================================

const domCache = new Map();

/**
 * Get a cached DOM element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Cached element
 */
export function getCachedElement(id) {
    if (!domCache.has(id)) {
        domCache.set(id, document.getElementById(id));
    }
    return domCache.get(id);
}

/**
 * Invalidate a cached DOM element
 * @param {string} id - Element ID to invalidate
 */
export function invalidateDomCache(id) {
    if (id) {
        domCache.delete(id);
    } else {
        domCache.clear();
    }
}

/**
 * Safely set a style property on an element
 * @param {HTMLElement|string} elementOrId - Element or ID
 * @param {string} property - CSS property
 * @param {string} value - CSS value
 */
export function safeSetStyle(elementOrId, property, value) {
    const el = typeof elementOrId === 'string' ? getCachedElement(elementOrId) : elementOrId;
    if (el && el.style) {
        el.style[property] = value;
    }
}

/**
 * Safely set display property
 * @param {string} id - Element ID
 * @param {string} value - Display value
 */
export function safeSetDisplay(id, value) {
    safeSetStyle(id, 'display', value);
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

let toastCounter = 0;

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'info', 'success', 'warning', 'error'
 * @param {number} duration - Duration in ms (default 4000)
 * @returns {string} Toast ID
 */
export function showToast(message, type = 'info', duration = 4000) {
    const toastId = `toast-${++toastCounter}`;
    let container = document.getElementById('toastContainer');

    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = 'position:fixed;top:80px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
        document.body.appendChild(container);
    }

    const colors = {
        info: '#3498db',
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c'
    };

    const toast = document.createElement('div');
    toast.id = toastId;
    toast.style.cssText = `
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-family: inherit;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        pointer-events: auto;
        cursor: pointer;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;
    toast.textContent = message;
    toast.onclick = () => dismissToast(toastId);

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    });

    // Auto dismiss
    if (duration > 0) {
        setTimeout(() => dismissToast(toastId), duration);
    }

    return toastId;
}

/**
 * Dismiss a toast notification
 * @param {string} toastId - Toast ID to dismiss
 */
export function dismissToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 300);
    }
}

// ============================================
// EXPORT DEFAULT BUNDLE
// ============================================

export default {
    // Sanitization
    escapeHtml,
    escapeAttr,
    sanitizeHtml,
    sanitizeForStorage,
    sanitizeUrl,

    // Storage
    obfuscateData,
    deobfuscateData,
    secureStorageSet,
    secureStorageGet,

    // Time
    formatTimeAgo,
    formatTime,

    // Data
    dataURLtoBlob,

    // Rate limiting
    checkRateLimit,
    recordAction,

    // DOM
    getCachedElement,
    invalidateDomCache,
    safeSetStyle,
    safeSetDisplay,

    // Toast
    showToast,
    dismissToast
};
