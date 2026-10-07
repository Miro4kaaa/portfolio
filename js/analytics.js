/**
 * ============================================================
 * АНАЛИТИКА И СБОР СТАТИСТИКИ (brand-AI-anna)
 * Яндекс.Метрика ID: 29457435 с Вебвизором 2.0 + Цели
 * ============================================================
 */

(function() {
    const YA_METRIKA_ID = 29457435;

    // Инициализация скрипта Яндекс.Метрики
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {
            if (document.scripts[j].src === r) { return; }
        }
        k=e.createElement(t); a=e.getElementsByTagName(t)[0];
        k.async=1; k.src=r; a.parentNode.insertBefore(k,a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

    // Запуск отслеживания с Вебвизором
    ym(YA_METRIKA_ID, 'init', {
        webvisor: true,
        clickmap: true,
        referrer: document.referrer,
        url: location.href,
        accurateTrackBounce: true,
        trackLinks: true
    });

    // Добавление noscript пикселя
    if (document.body && !document.getElementById('ym-noscript-pixel')) {
        var noscriptDiv = document.createElement('noscript');
        noscriptDiv.id = 'ym-noscript-pixel';
        noscriptDiv.innerHTML = '<div><img src="https://mc.yandex.ru/watch/' + YA_METRIKA_ID + '" style="position:absolute; left:-9999px;" alt="" /></div>';
        document.body.appendChild(noscriptDiv);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            if (!document.getElementById('ym-noscript-pixel')) {
                var noscriptDiv = document.createElement('noscript');
                noscriptDiv.id = 'ym-noscript-pixel';
                noscriptDiv.innerHTML = '<div><img src="https://mc.yandex.ru/watch/' + YA_METRIKA_ID + '" style="position:absolute; left:-9999px;" alt="" /></div>';
                document.body.appendChild(noscriptDiv);
            }
        });
    }

    // Хелпер отправки цели
    function reachGoal(targetName, params) {
        if (typeof ym === 'function') {
            ym(YA_METRIKA_ID, 'reachGoal', targetName, params || {});
        }
        if (window.location.hostname === 'localhost' || window.location.protocol === 'file:') {
            console.log('[Analytics Goal]:', targetName, params);
        }
    }

    // Автоматический трекинг целевых действий
    document.addEventListener('DOMContentLoaded', function() {
        // 1. Клик по кнопкам связи в Telegram
        document.querySelectorAll('a[href*="t.me/brandianna"]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                reachGoal('lead_telegram', { 
                    button_text: (btn.innerText || '').trim(),
                    page: window.location.pathname
                });
            });
        });

        // 2. Клик по соцсетям (VK, TikTok)
        document.querySelectorAll('a[href*="vk.ru"]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                reachGoal('click_vk');
            });
        });
        document.querySelectorAll('a[href*="tiktok.com"]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                reachGoal('click_tiktok');
            });
        });

        // 3. Отправка расчета в калькуляторе
        var calcBtn = document.getElementById('calcTelegramBtn');
        if (calcBtn) {
            calcBtn.addEventListener('click', function() {
                var total = (document.getElementById('calcTotalPrice') || {}).innerText || '';
                reachGoal('calc_submit', { total_estimate: total });
            });
        }

        // 4. Клики по кейсам в портфолио
        document.querySelectorAll('.portfolio-item a, a.case-page-btn').forEach(function(link) {
            link.addEventListener('click', function() {
                reachGoal('view_case_click', { href: link.getAttribute('href') });
            });
        });
    });

    // Экспорт глобально
    window.reachAnalyticsGoal = reachGoal;
})();
